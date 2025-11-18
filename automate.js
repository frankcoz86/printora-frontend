  /*******************************************************
   * Printora â€“ Apps Script Automation (Drive + Gmail)
   * Replaces: Make/Integromat, Brevo, FattureInCloud
   *
   * Endpoints (deploy as Web App: Anyone with the link):
   *  - doPost(): accepts JSON with { event: 'ORDER_CREATED' | 'PAYMENT_SUCCEEDED' | 'PAYMENT_FAILED', ... }
   *
   * Events:
   *  - ORDER_CREATED:
   *      Creates Drive folder: /ROOT/YYYY/MM/ORD-<order_code || id>-<surname|-company>-<city>/
   *      Subfolders: client-uploads, editor-files, invoices
   *      Moves print_files[].driveFileId out of _staging to proper subfolders
   *      Optionally shares order folder with customer
   *      Sends â€œOrder Receivedâ€ email (HTML) to customer + BCC internal
   *
   *  - PAYMENT_SUCCEEDED:
   *      (Best-effort) fetches enriched order by id from Supabase (optional)
   *      Builds Google Doc invoice â†’ PDF once (idempotent) into /invoices
   *      Emails customer with PDF attached + BCC internal
   *
   *  - PAYMENT_FAILED:
   *      Emails customer + internal with retry/assistance message
   *
   * Script Properties (File â†’ Project properties â†’ Script properties):
   *   ROOT_FOLDER_ID           = <Drive folder id of Customer_Orders>
   *   STAGING_FOLDER_ID        = <Drive folder id of Customer_Orders/_staging>
   *   INTERNAL_EMAILS          = "ordini@printora.it, admin@printora.it"   // comma-separated
   *   SHARE_WITH_CUSTOMER      = "true" | "false"
   *   SUPABASE_URL             = https://xyzcompany.supabase.co   (optional, for enrichment)
   *   SUPABASE_SERVICE_KEY     = <service_role or anon key>       (prefer service role to read orders)
   *
   * Optional branding props:
   *   BRAND_NAME               = "Printora"
   *   BRAND_FROM_EMAIL         = "noreply@printora.it"
   *   BRAND_FROM_NAME          = "Printora"
   *   BRAND_VAT_RATE           = "22"   // as percent, e.g. "22"
   *   BRAND_ADDRESS_LINE1      = "Via Esempio 123"
   *   BRAND_ADDRESS_LINE2      = "00100 Roma (RM)"
   *
   * NOTE: Uses Drive v3 via UrlFetch + OAuth to be Shared-Drive safe. No Advanced Service toggle required.
   *******************************************************/

  const PROPS = PropertiesService.getScriptProperties();

  const CFG = {
    ROOT_FOLDER_ID: getProp('ROOT_FOLDER_ID', true),
    STAGING_FOLDER_ID: getProp('STAGING_FOLDER_ID', true),
    INTERNAL_EMAILS: (getProp('INTERNAL_EMAILS') || '').split(',').map(s => s.trim()).filter(Boolean),
    SHARE_WITH_CUSTOMER: (getProp('SHARE_WITH_CUSTOMER') || 'false').toLowerCase() === 'true',


    SUPABASE_URL: getProp('SUPABASE_URL'),
    SUPABASE_KEY: getProp('SUPABASE_SERVICE_KEY') || getProp('SUPABASE_ANON_KEY'),

    BRAND: {
      NAME: getProp('BRAND_NAME') || 'Printora',
      FROM_EMAIL: getProp('BRAND_FROM_EMAIL') || Session.getActiveUser().getEmail() || 'noreply@printora.it',
      FROM_NAME: getProp('BRAND_FROM_NAME') || 'Printora',
      VAT_RATE: Number(getProp('BRAND_VAT_RATE') || '22'),
      ADDR1: getProp('BRAND_ADDRESS_LINE1') || '',
      ADDR2: getProp('BRAND_ADDRESS_LINE2') || '',
      LOGO_FILE_ID: getProp('BRAND_LOGO_FILE_ID') || '',
      LOGO_URL: getProp('BRAND_LOGO_URL') || '',
      ACCENT: getProp('BRAND_ACCENT_COLOR') || '#111827',
      WEBSITE: getProp('BRAND_WEBSITE') || '',
      VAT_ID: getProp('BRAND_VAT_ID') || ''
    }
  };

  // Force all sheet date/times to Italian time
  const IT_TZ = PROPS.getProperty('ORDERS_TIMEZONE') || 'Europe/Rome';

  // Email toggles (defaults: only send invoice email on payment)
  CFG.SEND_ORDER_RECEIVED_EMAIL = (getProp('SEND_ORDER_RECEIVED_EMAIL') || 'false').toLowerCase() === 'true';
  CFG.SEND_INTERNAL_ALERTS      = (getProp('SEND_INTERNAL_ALERTS')      || 'false').toLowerCase() === 'true';
  // Who gets BCC on the invoice email (default: true)
  CFG.BCC_INVOICE_TO_INTERNALS = (getProp('BCC_INVOICE_TO_INTERNALS') || 'true').toLowerCase() === 'true';
  // Whether to send separate internal â€œnotificationâ€ emails (default: false)
  CFG.SEND_INTERNAL_PINGS      = (getProp('SEND_INTERNAL_PINGS')      || 'false').toLowerCase() === 'true';
  CFG.FAIL = {
    FROM_EMAIL: getProp('FAIL_FROM_EMAIL') || CFG.BRAND.FROM_EMAIL,
    FROM_NAME:  getProp('FAIL_FROM_NAME')  || CFG.BRAND.FROM_NAME,
    INTERNALS:  (getProp('FAIL_INTERNALS') || '').split(',').map(s => s.trim()).filter(Boolean)
  };
  CFG.DRIVE = CFG.DRIVE || {};
  CFG.DRIVE.ORDERS_ROOT_ID = '0ALyXVb2bHbtPUk9PVA';
  // Per-order state
  function wasInvoiceEmailed(orderId, orderCode) {
    if (orderId != null && PROPS.getProperty(`INVOICE_SENT_ID_${orderId}`) === '1') return true;
    if (orderCode && PROPS.getProperty(`INVOICE_SENT_CODE_${orderCode}`) === '1') return true;
    return false;
  }
  function setInvoiceEmailed(orderId, orderCode) {
    if (orderId != null) PROPS.setProperty(`INVOICE_SENT_ID_${orderId}`, '1');
    if (orderCode)       PROPS.setProperty(`INVOICE_SENT_CODE_${orderCode}`, '1');
  }
  function invoiceEmailMarkerExists(folderId) {
    const it = DriveApp.getFolderById(folderId).getFilesByName('invoice_email.json');
    return it.hasNext();
  }

  // â”€â”€ Order â†” folder mapping persisted in Script Properties â”€â”€
  function setOrderFolderMapping(orderId, orderCode, folderId) {
    if (orderId != null) PROPS.setProperty(`ORDER_FOLDER_ID_${orderId}`, String(folderId));
    if (orderCode)      PROPS.setProperty(`ORDER_FOLDER_CODE_${orderCode}`, String(folderId));
  }
  function getOrderFolderMapping(orderId, orderCode) {
    const byCode = orderCode ? PROPS.getProperty(`ORDER_FOLDER_CODE_${orderCode}`) : null;
    if (byCode) return byCode;
    const byId = (orderId != null) ? PROPS.getProperty(`ORDER_FOLDER_ID_${orderId}`) : null;
    return byId || null;
  }

  // Simple in-memory caches per invocation (reduces list/create thrash)
  const CACHE = {
    folderByKey: new Map() // key: `${parentId}::${name}` -> id
  };

  /** â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   * HTTP entrypoint
   * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function doPost(e) {
    try {
      const body = parseJson(e && e.postData && e.postData.contents);
       // Lightweight black-box recorder for debugging live webhooks:
      try { PROPS.setProperty('LAST_WEBHOOK_JSON', JSON.stringify(body || {})); } catch (__) {}
      if (!body || !body.event) return jsonERR('Missing event');

      const evt = String(body.event).toUpperCase();
      if (evt === 'ORDER_CREATED')     return jsonOK(handleOrderCreated(body));
      if (evt === 'PAYMENT_SUCCEEDED') return jsonOK(handlePaymentSucceeded(body));
      if (evt === 'PAYMENT_FAILED')    return jsonOK(handlePaymentFailed(body));
      if (evt === 'CONTACT_MESSAGE') return jsonOK(handleContactMessage(body));

      return jsonERR('Unknown event');
    } catch (err) {
      console.error('doPost error:', err);
      return jsonERR('Internal error', String(err && err.message || err));
    }
  }

  // Handle OAuth redirect (your Web App GET)
  function doGet(e) {
    const params = (e && e.parameter) ? e.parameter : {};
    console.log('FIC OAuth GET params:', JSON.stringify(params));

    // If FIC returned an error, show it clearly
    if (params.error) {
      const msg = 'FIC OAuth error: ' + params.error + (params.error_description ? (' â€” ' + params.error_description) : '');
      return ContentService.createTextOutput(msg).setMimeType(ContentService.MimeType.TEXT);
    }

    // Exchange the authorization code for refresh/access tokens
    if (params.code) {
      try {
        ficExchangeCodeForRefreshToken(params.code);
        return ContentService.createTextOutput('FIC authorized âœ“ Refresh token saved. You can close this tab.')
          .setMimeType(ContentService.MimeType.TEXT);
      } catch (err) {
        return ContentService.createTextOutput('FIC auth exchange failed: ' + String(err))
          .setMimeType(ContentService.MimeType.TEXT);
      }
    }

    // No code: just a normal GET to the web app
    return ContentService.createTextOutput('OK (no OAuth code received)').setMimeType(ContentService.MimeType.TEXT);
  }


  /** â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   * ORDER_CREATED
   * payload (from frontend/NewShippingPage.jsx fireAppsScript):
   * {
   *   event: 'ORDER_CREATED',
   *   id, order_code, created_at, planned_drive_path,
   *   shipping: {... name, surname, email, address, city, zip, province, company?... },
   *   print_files: [{driveFileId, kind:'client-upload'|'editor-file', fileName?, mimeType?, size?}, ...],
   *   amount: <total cents>,
   *   payment_method: 'card'|'paypal'|...
   * }
   * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function handleOrderCreated(payload) {
    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      const orderId = payload.id;
    const orderCode = payload.order_code || `ORD-${orderId}`;
    const shipping = payload.shipping || {};
    const customerEmail = (shipping.email || '').trim();
    const printFilesRaw = Array.isArray(payload.print_files) ? payload.print_files : [];

    // 1) Ensure folder structure (ROOT/YYYY/MM/ORD-.../{client-uploads,editor-files,invoices})
    const folderInfo = ensureOrderFolders({
      orderId,
      orderCode,
      shipping,
      planned: payload.planned_drive_path,
      createdAt: payload.created_at
    });

    // 2) Persist mapping so PAYMENT_SUCCEEDED reuses THIS folder (no duplicates)
    setOrderFolderMapping(orderId, orderCode, folderInfo.orderFolderId);

    // 3) Move files out of _staging to the correct subfolder (idempotent)
    const moved = movePrintFilesToOrder(printFilesRaw, folderInfo);

    // 4) Optional: share order folder with customer (best-effort)
    if (CFG.SHARE_WITH_CUSTOMER && customerEmail) {
      try { addViewerPermission(folderInfo.orderFolderId, customerEmail); }
      catch (e) { console.warn('Share failed (non-fatal):', String(e && e.message || e)); }
    }

    // 5) Write/overwrite a small marker for later enrichment & lookups
    writeJsonFile(folderInfo.orderFolderId, 'order.json', {
      event: 'ORDER_CREATED',
      receivedAt: new Date().toISOString(),
      order: {
        id: orderId,
        code: orderCode,
        created_at: payload.created_at,
        amount_cents: payload.amount || null,
        shipping,
        payment_method: payload.payment_method || null
      },
      folder: {
        id: folderInfo.orderFolderId,
        link: folderInfo.orderFolderLink
      },
      moved
    }, true); // overwrite if exists

// Build products list for the email (works with items | cart_items | order_items)
const rawItems =
  (Array.isArray(payload.items) && payload.items) ||
  (Array.isArray(payload.cart_items) && payload.cart_items) ||
  (Array.isArray(payload.order_items) && payload.order_items) ||
  [];

const orderItems = rawItems.map(it => ({
  name: buildCleanItemName(it),                      // ← deduped, normalized
  quantity: it.quantity || it.qty || 1,
  // Accept cents or euro strings
  price: (typeof it.unit_amount === 'number')
           ? (it.unit_amount / 100).toFixed(2)
           : (it.price || it.unit_price || '')
}));

if (CFG.SEND_ORDER_RECEIVED_EMAIL && customerEmail) {
  sendOrderReceivedEmail({
    to: customerEmail,
    orderCode,
    shipping,
    amountCents: payload.amount || null,
    orderItems                 // ← add this line
  });
}

    if (CFG.SEND_INTERNAL_PINGS) {
      bccInternal(`Order received: ${orderCode}`, `Folder: ${folderInfo.orderFolderLink}`);
    }

    ordersSheet_upsert(payload, { statusOverride: 'pending' });

    return {
      order_id: orderId,
      order_code: orderCode,
      order_folder: folderInfo.orderFolderLink,
      moved_count: moved.total
    };
      } finally {
      lock.releaseLock();
    }
  }

function setOrderRowIndex(orderId, orderCode, rowIndex) {
  if (orderId != null) PROPS.setProperty(`ORDER_ROW_${orderId}`, String(rowIndex));
  if (orderCode)       PROPS.setProperty(`ORDER_ROW_CODE_${orderCode}`, String(rowIndex));
}
function getOrderRowIndex(orderId, orderCode) {
  const byCode = orderCode ? PROPS.getProperty(`ORDER_ROW_CODE_${orderCode}`) : null;
  if (byCode) return Number(byCode) || -1;
  const byId = (orderId != null) ? PROPS.getProperty(`ORDER_ROW_${orderId}`) : null;
  return byId ? (Number(byId) || -1) : -1;
}
function clearOrderRowIndex(orderId, orderCode) {
  if (orderId != null) PROPS.deleteProperty(`ORDER_ROW_${orderId}`);
  if (orderCode)       PROPS.deleteProperty(`ORDER_ROW_CODE_${orderCode}`);
}

function setOrderSheetName(orderId, orderCode, sheetName) {
  if (orderId != null) PROPS.setProperty(`ORDER_SHEET_${orderId}`, String(sheetName || ''));
  if (orderCode)       PROPS.setProperty(`ORDER_SHEET_CODE_${orderCode}`, String(sheetName || ''));
}

function getOrderSheetName(orderId, orderCode) {
  const byCode = orderCode ? PROPS.getProperty(`ORDER_SHEET_CODE_${orderCode}`) : null;
  if (byCode != null) return byCode;
  const byId = (orderId != null) ? PROPS.getProperty(`ORDER_SHEET_${orderId}`) : null;
  return byId || '';
}

// Detect if a string already contains a size like "85x200", "85×200", optional "cm/mm"
function hasDims(s) {
  if (!s) return false;
  return /(\d+(?:\.\d+)?)\s*(?:cm|mm)?\s*[x×]\s*(\d+(?:\.\d+)?)\s*(?:cm|mm)?/i.test(String(s));
}

// Format a nice "W×H cm"
function fmtDims(w, h) {
  if (!w || !h) return '';
  return `${Number(w)}×${Number(h)} cm`;
}

// Remove trailing "— size" (or "- size") chunks from a name
function stripTrailingDims(name) {
  if (!name) return '';
  return String(name).replace(
    /\s*[—-]\s*(\d+(?:\.\d+)?)\s*(?:cm|mm)?\s*[x×]\s*(\d+(?:\.\d+)?)\s*(?:cm|mm)?\s*(?:cm|mm)?\s*$/i,
    ''
  ).trim();
}

// Build a clean display name with at most one size label
function buildCleanItemName(raw) {
  const it = raw || {};
  const base0 = it.name || it.title || it.productName || it.description || 'Articolo';
  // If base already ends with "— 85x200", remove it so we control duplication
  let base = stripTrailingDims(base0);

  // Prefer explicit numeric width/height when present
  let w = it.width_cm, h = it.height_cm;

  // Else, try details.dimensions → parse to numbers
  if (!(w && h) && it.details && it.details.dimensions) {
    const pp = parseDimsCm(it.details.dimensions);
    if (pp.w && pp.h) { w = pp.w; h = pp.h; }
  }

  // Else, try parsing any size already inside the (cleaned) base name
  if (!(w && h) && hasDims(base)) {
    const m = String(base).match(/(\d+(?:\.\d+)?)\s*(?:cm|mm)?\s*[x×]\s*(\d+(?:\.\d+)?)\s*(?:cm|mm)?/i);
    if (m) { w = Number(m[1]); h = Number(m[2]); }
  }

  // Decide whether to append a size label:
  // - If the (original) base name already had a size, don't append again.
  // - Otherwise, append one normalized label if we know W/H.
  const baseOriginallyHadDims = hasDims(base0);
  const dimsLabel = (!baseOriginallyHadDims && w && h) ? fmtDims(w, h) : '';

  return [base, dimsLabel].filter(Boolean).join(' — ');
}

// Parse "85x200 cm", "85 x 200", "85cm x 200cm", "85Ã—200", etc.
// Returns { w: number|null, h: number|null } in centimeters
function parseDimsCm(s) {
  if (!s) return { w: null, h: null };
  const txt = String(s).toLowerCase().replace(/\s+/g, ' ').trim();

  // Common separators: x, Ã—, X
  // allow optional unit labels around each number (cm, mm)
  const m = txt.match(/(\d+(?:\.\d+)?)\s*(?:cm|mm)?\s*[xÃ—]\s*(\d+(?:\.\d+)?)\s*(?:cm|mm)?/i);
  if (!m) return { w: null, h: null };

  let w = Number(m[1]), h = Number(m[2]);
  // If original string mentions mm, convert to cm (rare)
  const hasMM = /\bmm\b/i.test(txt);
  if (hasMM) { w = w / 10; h = h / 10; }
  return { w, h };
}


// === CONFIG
const SHEET_CFG = {
  SS_ID: PROPS.getProperty('ORDERS_SHEET_ID') || '',           // REQUIRED
  TAB:   PROPS.getProperty('ORDERS_SHEET_TAB') || 'Orders'     // optional
};

// Exact header order (must match your request)
const ORDER_COLS = [
  'order_id','order_date','customer_name','customer_email','customer_phone',
  'product_name','quantity','width_cm','height_cm','total_price','currency',
  'payment_method','payment_status','shipping_street','shipping_city','shipping_postal_code',
  'shipping_country','billing_company','billing_vat_number','billing_tax_code',
  'billing_recipient_code', 'billing_pec', // â† NEW
  'billing_street','billing_city','billing_postal_code','billing_country','print_file_url','notes'
];

// Ensure sheet and header row
// === OPS (Pending/Failed) sheet config ===
const OPS_CFG = {
  SS_ID: PROPS.getProperty('OPS_SHEET_ID') || '',                 // REQUIRED for routing
  TAB_PENDING: PROPS.getProperty('OPS_TAB_PENDING') || 'Pending',
  TAB_FAILED:  PROPS.getProperty('OPS_TAB_FAILED')  || 'Failed'
};

// === BACKUP sheet config ===
const BACKUP_CFG = {
  SS_ID: PROPS.getProperty('BACKUP_SHEET_ID') || SHEET_CFG.SS_ID, // Default to same as orders sheet
  TAB: PROPS.getProperty('BACKUP_TAB') || 'Paid_Orders_Backup'
};

function ensureHeader_(sh) {
  const firstRow = sh.getRange(1, 1, 1, ORDER_COLS.length).getValues()[0];
  const headerMatches = firstRow.every((v, i) => String(v || '') === ORDER_COLS[i]);
  if (!headerMatches) {
    sh.clear();
    sh.getRange(1, 1, 1, ORDER_COLS.length).setValues([ORDER_COLS]);
    sh.setFrozenRows(1);
  }
}

// Existing paid sheet
function ordersSheet_() {
  if (!SHEET_CFG.SS_ID) throw new Error('ORDERS_SHEET_ID not set in Script Properties');
  const ss = SpreadsheetApp.openById(SHEET_CFG.SS_ID);
  try { if (ss.getSpreadsheetTimeZone() !== IT_TZ) ss.setSpreadsheetTimeZone(IT_TZ); } catch(_) {}
  let sh = ss.getSheetByName(SHEET_CFG.TAB) || ss.insertSheet(SHEET_CFG.TAB);
  ensureHeader_(sh);
  return sh;
}

// New: generic tab opener on OPS sheet
function opsSheet_(tabName) {
  if (!OPS_CFG.SS_ID) throw new Error('OPS_SHEET_ID not set (Pending/Failed sheet)');
  const ss = SpreadsheetApp.openById(OPS_CFG.SS_ID);
  try { if (ss.getSpreadsheetTimeZone() !== IT_TZ) ss.setSpreadsheetTimeZone(IT_TZ); } catch(_) {}
  let sh = ss.getSheetByName(tabName) || ss.insertSheet(tabName);
  ensureHeader_(sh);
  return sh;
}

function pendingSheet_() { return opsSheet_(OPS_CFG.TAB_PENDING); }
function failedSheet_()  { return opsSheet_(OPS_CFG.TAB_FAILED);  }

// Backup sheet for paid orders
function backupSheet_() {
  if (!BACKUP_CFG.SS_ID) throw new Error('BACKUP_SHEET_ID not configured in Script Properties');
  const ss = SpreadsheetApp.openById(BACKUP_CFG.SS_ID);
  try { if (ss.getSpreadsheetTimeZone() !== IT_TZ) ss.setSpreadsheetTimeZone(IT_TZ); } catch(_) {}
  let sh = ss.getSheetByName(BACKUP_CFG.TAB) || ss.insertSheet(BACKUP_CFG.TAB);
  ensureHeader_(sh);
  return sh;
}

// Copy order to backup sheet before moving to main orders sheet
function copyOrderToBackup(orderId, orderCode, orderRow) {
  try {
    console.log('[copyOrderToBackup] Starting backup for orderId:', orderId, 'orderCode:', orderCode);
    const backupSh = backupSheet_();
    console.log('[copyOrderToBackup] Backup sheet accessed:', backupSh.getName());
    
    // Check if order already exists in backup
    const data = backupSh.getDataRange().getValues();
    const header = data[0];
    const idxId = header.indexOf('order_id');
    console.log('[copyOrderToBackup] Header check - order_id column index:', idxId);
    
    let existingRowIndex = -1;
    for (let r = 1; r < data.length; r++) {
      if (String(data[r][idxId]) === String(orderId)) {
        existingRowIndex = r + 1;
        break;
      }
    }
    
    // Add timestamp to notes for backup tracking
    const backupRow = [...orderRow];
    const notesIndex = ORDER_COLS.indexOf('notes');
    if (notesIndex >= 0) {
      const currentNotes = backupRow[notesIndex] || '';
      const backupTimestamp = `[BACKUP: ${new Date().toISOString()}]`;
      backupRow[notesIndex] = currentNotes ? `${currentNotes} ${backupTimestamp}` : backupTimestamp;
    }
    
    if (existingRowIndex > 0) {
      // Update existing backup row
      backupSh.getRange(existingRowIndex, 1, 1, ORDER_COLS.length).setValues([backupRow]);
      console.log('[copyOrderToBackup] UPDATED backup row', existingRowIndex, 'for order', orderId);
    } else {
      // Append new backup row
      backupSh.appendRow(backupRow);
      console.log('[copyOrderToBackup] APPENDED backup row for order', orderId);
    }
    
    return true;
  } catch (e) {
    console.error('[copyOrderToBackup] ERROR:', e.message, 'Stack:', e.stack);
    return false;
  }
}


// Find existing row data by order_id or order_code
function findExistingOrderRow(orderId, orderCode) {
  const sh = ordersSheet_();
  const data = sh.getDataRange().getValues();
  const header = data[0];
  const idx_id = header.indexOf('order_id');
  const idx_code = header.indexOf('notes'); // fallback if code stored in notes

  for (let r = 1; r < data.length; r++) {
    const row = data[r];
    if (String(row[idx_id] || '') === String(orderId || '')) return row;
    if (orderCode && String(row[idx_code] || '').includes('#' + orderCode)) return row;
  }
  return null;
}

/**
 * Fetch billing VAT/Tax from the Orders sheet by orderId or orderCode
 */
function getOrderBillingInfo(orderId, orderCode) {
  try {
    // search across PAID, then Pending, then Failed
    const sheets = [null, null, null];
    try { sheets[0] = ordersSheet_(); } catch(_) {}
    try { sheets[1] = pendingSheet_(); } catch(_) {}
    try { sheets[2] = failedSheet_();  } catch(_) {}

    for (const sh of sheets.filter(Boolean)) {
    const data = sh.getDataRange().getValues();
    const header = data[0];

    const idxId      = header.indexOf('order_id');
    const idxCompany = header.indexOf('billing_company');        // ← NEW
    const idxVat     = header.indexOf('billing_vat_number');
    const idxTax     = header.indexOf('billing_tax_code');
    const idxSDI     = header.indexOf('billing_recipient_code'); // ← NEW
    const idxPEC     = header.indexOf('billing_pec');            // ← NEW

      for (let r = 1; r < data.length; r++) {
        const row = data[r];
        if (String(row[idxId]) === String(orderId)) {
          return {
            company: (idxCompany>=0 && row[idxCompany]) ? String(row[idxCompany]).trim() : '',
            vat_number: (idxVat>=0 && row[idxVat]) ? String(row[idxVat]).trim() : '',
            tax_code:   (idxTax>=0 && row[idxTax]) ? String(row[idxTax]).trim() : '',
            recipient_code: (idxSDI>=0 && row[idxSDI]) ? String(row[idxSDI]).trim() : '',
            pec: (idxPEC>=0 && row[idxPEC]) ? String(row[idxPEC]).trim() : ''
          };
        }
      }
    }
    return { company: '', vat_number: '', tax_code: '', recipient_code: '', pec: '' };
  } catch (e) {
    console.warn('[getOrderBillingInfo] failed', e.message);
    return { company: '', vat_number: '', tax_code: '', recipient_code: '', pec: '' };
  }
}

// Upsert one order row (create or update by order_id, else by order_code)
// Upsert one order row (create or update by order_id, else by order_code)
function ordersSheet_upsert(payload, { statusOverride } = {}) {
  const t0 = Date.now();
  console.log('â”€â”€ ordersSheet_upsert.START â”€â”€');
  try {
   // pick the target sheet based on final paymentStatus (computed later)
   let shTargetSelector = null; // function that returns a sheet based on status

    // â€”â€”â€” Resolve fields from payload (and Stripe-ish payment_details) â€”â€”â€”
    const p    = payload || {};
    const pay  = p.payment_details || p.payment_summary || {};
    const ship = p.shipping || {};
    const cust = p.customer || {};
    const bill = p.billing || p.billing_info || {};   // (use if you have a separate billing block)

    const orderId   = p.id ?? p.order_id ?? null;
    const orderCode = p.order_code || (orderId != null ? `ORD-${orderId}` : '');

    console.log('[upsert] orderId:', orderId, 'orderCode:', orderCode, 'statusOverride:', statusOverride, 'event:', p.event);

    // 🚫 Skip writing to the sheet if we don't have a real order id
    const isMissingOrderId =
      orderId == null ||
      String(orderId).trim() === '' ||
      String(orderId).toLowerCase() === 'null';

    // Some integrations send "ORD-null" (or similar) as a placeholder — treat that as invalid too
    const isBogusOrderCode =
      !!p.order_code && /(^|\b)ord[-_\s]*null\b/i.test(String(p.order_code));

    if (isMissingOrderId || isBogusOrderCode) {
      console.warn('[upsert] Skipping sheet write: invalid/missing order_id/order_code', {
        orderId, orderCode: p.order_code || ''
      });
      return { skipped: true, reason: 'missing_or_invalid_order_id' };
    }

    // Pull existing row data from ANY sheet to preserve ALL data
    let existing = {};
    let existingRow = null;
    
    // Search across all sheets for existing data
    const searchSheets = [ordersSheet_(), pendingSheet_(), failedSheet_()];
    for (const sh of searchSheets) {
      try {
        const data = sh.getDataRange().getValues();
        const header = data[0];
        const idxId = header.indexOf('order_id');
        
        for (let r = 1; r < data.length; r++) {
          if (String(data[r][idxId]) === String(orderId)) {
            existingRow = data[r];
            existing = Object.fromEntries(ORDER_COLS.map((c, i) => [c, existingRow[i] || '']));
            console.log('[upsert] existingRow found in', sh.getName(), '-> preserving ALL existing data');
            break;
          }
        }
        if (existingRow) break;
      } catch (e) {
        console.warn('[upsert] failed to search sheet', sh.getName(), e.message);
      }
    }
    
    if (!existingRow) {
      console.log('[upsert] existingRow not found in any sheet');
    }

    // name & email - preserve existing if payload is incomplete
const customerName =
  [ship.name || ship.first_name, ship.surname].filter(Boolean).join(' ').trim() ||
  [cust.first_name || cust.firstname, cust.last_name || cust.lastname].filter(Boolean).join(' ').trim() ||
  (ship.name || cust.name || '').trim() ||
  existing.customer_name || '';

    const customerEmail =
      (ship.email && String(ship.email).trim()) ||
      (cust.email && String(cust.email).trim()) ||
      (pay.customer_email && String(pay.customer_email).trim()) ||
      existing.customer_email || '';

    const customerPhone =
      (ship.phone && String(ship.phone).trim()) ||
      (cust.phone && String(cust.phone).trim()) ||
      existing.customer_phone || '';

    // product(s)
    const items = Array.isArray(p.items) && p.items.length
      ? p.items
      : (Array.isArray(pay.line_items) ? pay.line_items : []);
    console.log('[upsert] items.count:', items.length);

    // product name & quantity - preserve existing if payload is incomplete
    const productName = items.length
      ? items.map(it => it.name || it.title || it.description || it.productName || 'Articolo').join(' | ')
      : (p.product_name || existing.product_name || '');

    const totalQty = items.reduce((a,it) => a + Number(it.quantity || it.qty || 1), 0) || (p.quantity || existing.quantity || 1);

    // width / height (cm): try explicit fields, then details.dimensions, then name, then productId
    let widthCm = '', heightCm = '';
    if (items.length) {
      const it0 = items[0] || {};
      widthCm  = it0.width_cm  ?? '';
      heightCm = it0.height_cm ?? '';
      if (!(widthCm && heightCm)) {
        const candidates = [
          it0?.details?.dimensions,
          it0?.name,
          it0?.productId,
          p?.details?.dimensions
        ].filter(Boolean);
        for (const c of candidates) {
          const { w, h } = parseDimsCm(c);
          if (w && h) { widthCm = w; heightCm = h; break; }
        }
      }
    }
    
    // Use existing dimensions if not found in payload
    if (!widthCm && existing.width_cm) widthCm = existing.width_cm;
    if (!heightCm && existing.height_cm) heightCm = existing.height_cm;

    // money / currency - preserve existing if payload is incomplete
    const currency = (p.currency || pay.currency || existing.currency || 'EUR').toString().toUpperCase();
    let totalCents =
      (typeof p.amount_total_cents === 'number' && p.amount_total_cents > 0) ? p.amount_total_cents
        : (typeof pay.amount_total === 'number' ? pay.amount_total : (typeof p.amount === 'number' ? p.amount : 0));
    
    // Use existing total price if no amount in payload
    const totalPrice = totalCents > 0 ? (Number(totalCents) / 100) : (existing.total_price || 0);
    console.log('[upsert] currency:', currency, 'totalCents:', totalCents, 'totalPrice(EUR):', totalPrice);

    // payment method/status - preserve existing if payload is incomplete
    const paymentMethod = (p.payment_method || pay.payment_method || existing.payment_method || '').toString();

    // keep existing status if it is already terminal (paid/failed)
    const existingStatus = String((existing.payment_status || '')).toLowerCase();

    // â€”â€”â€” STATUS RESOLUTION (with explicit logs) â€”â€”â€”
    let paymentStatus =
      (statusOverride ? String(statusOverride).toLowerCase() : '') ||
      (p.event && String(p.event).toUpperCase() === 'PAYMENT_SUCCEEDED' ? 'paid' :
       p.event && String(p.event).toUpperCase() === 'PAYMENT_FAILED'    ? 'failed' : 'pending');

    console.log('[upsert] status.preCheck -> override=', statusOverride, 'event=', p.event, 'computed=', paymentStatus, 'existingStatus=', existingStatus);

    // never downgrade from paid/failed back to pending
    if (['paid', 'failed'].includes(existingStatus) && paymentStatus === 'pending') {
      console.log('[upsert] status.protectTerminal -> keeping existing terminal status:', existingStatus);
      paymentStatus = existingStatus;
    }

    console.log('[upsert] status.final =', paymentStatus);

    // Decide target sheet by status
function sheetForStatus(status) {
  const s = String(status || '').toLowerCase();
  if (s === 'paid')   return ordersSheet_();      // PAID stays in the main sheet
  if (s === 'failed') return failedSheet_();      // FAILED in ops sheet
  return pendingSheet_();                         // default → PENDING in ops sheet
}

const sh = sheetForStatus(paymentStatus);
// Invalidate cached row index if this order moved to a different sheet
const currentSheetName = sh.getName();
const prevSheetName = getOrderSheetName(orderId, orderCode);
if (prevSheetName && prevSheetName !== currentSheetName) {
  clearOrderRowIndex(orderId, orderCode); // ensures we APPEND on the new sheet
}
setOrderSheetName(orderId, orderCode, currentSheetName); // keep current location

// Remove this order from the *other* sheets to avoid duplicates when status flips
function deleteFromSheetByOrder(shDel, orderId, orderCode) {
  if (!shDel) return;
  const data = shDel.getDataRange().getValues();
  const header = data[0] || [];
  const idxId = header.indexOf('order_id');
  const idxNotes = header.indexOf('notes');
  if (idxId < 0 || idxNotes < 0) return;

  for (let r = data.length - 1; r >= 1; r--) {
    const rid = String(data[r][idxId] || '');
    const note = String(data[r][idxNotes] || '');
    const matchId = (rid === String(orderId || ''));
    const matchCode = (orderCode && note.includes('#' + orderCode));
    if (matchId || matchCode) {
      shDel.deleteRow(r + 1);
    }
  }
}

// CRITICAL FIX: Preserve billing info BEFORE deleting from other sheets
const preservedBilling = getOrderBillingInfo(orderId, orderCode) || {
  company: '',
  vat_number: '',
  tax_code: '',
  recipient_code: '',
  pec: ''
};
console.log('[upsert] preservedBilling before deletion:', JSON.stringify(preservedBilling));

// When moving to PAID, delete from Pending + Failed
if (paymentStatus === 'paid') {
  try { deleteFromSheetByOrder(pendingSheet_(), orderId, orderCode); } catch(_) {}
  try { deleteFromSheetByOrder(failedSheet_(),  orderId, orderCode); } catch(_) {}
}
// When marking FAILED, delete from Pending and PAID
else if (paymentStatus === 'failed') {
  try { deleteFromSheetByOrder(pendingSheet_(), orderId, orderCode); } catch(_) {}
  try { deleteFromSheetByOrder(ordersSheet_(),  orderId, orderCode); } catch(_) {}
}
// When marking PENDING, delete from Failed and PAID
else { // 'pending'
  try { deleteFromSheetByOrder(failedSheet_(),  orderId, orderCode); } catch(_) {}
  try { deleteFromSheetByOrder(ordersSheet_(),  orderId, orderCode); } catch(_) {}
}

    // shipping - preserve existing if payload is incomplete
    const shippingStreet = ship.address || ship.address1 || ship.address_line1 || existing.shipping_street || '';
    const shippingCity   = ship.city || ship.town || existing.shipping_city || '';
    const shippingPost   = ship.zip || ship.postcode || ship.postal_code || existing.shipping_postal_code || '';
    const shippingCountry= (ship.country || ship.country_code || existing.shipping_country || 'IT');

// Ensure values are strings before trimming, to prevent "trim is not a function"
function safeTrim(v) {
  if (v == null) return null;
  const s = (typeof v === 'string' ? v : String(v));
  const t = s.trim();
  return t.length ? t : null;
}

// Pull billing info from sheets (Paid, then Pending, then Failed) as a fallback
const sheetBilling = getOrderBillingInfo(orderId, orderCode) || {
  company: '',
  vat_number: '',
  tax_code: '',
  recipient_code: '',
  pec: ''
};

const billingCompany =
  safeTrim(bill.company || cust.company || ship.company || preservedBilling.company || existing.billing_company);

const billingVatNumber =
  safeTrim(bill.vat_number || cust.vat_number || preservedBilling.vat_number || existing.billing_vat_number);

const billingTaxCode =
  safeTrim(bill.tax_code || bill.codice_fiscale || cust.codice_fiscale || preservedBilling.tax_code || existing.billing_tax_code);

const billingStreet =
  safeTrim(bill.address || bill.street || existing.billing_street || shippingStreet);

const billingCity =
  safeTrim(bill.city || existing.billing_city || shippingCity);

const billingPost =
  safeTrim(bill.postcode || bill.postal_code || existing.billing_postal_code || shippingPost);

const billingCountry =
  safeTrim(bill.country || existing.billing_country || shippingCountry);

const billingRecipientCode =
  safeTrim((bill.recipient_code || bill.codice_destinatario || bill.sdiCode) || preservedBilling.recipient_code || existing.billing_recipient_code);

const billingPec =
  safeTrim((bill.pec || bill.pec_address || bill.pecAddress) || preservedBilling.pec || existing.billing_pec);


    // files: prefer item.printFiles[0], else payload.print_files[0]
    const pfFromItem = (items[0] && Array.isArray(items[0].printFiles)) ? items[0].printFiles : [];
    const pf = pfFromItem.length ? pfFromItem
                                 : (Array.isArray(p.print_files) ? p.print_files : []);
    const firstFile = pf[0] || {};

    const printFileUrl =
      firstFile.driveLink ||
      (firstFile.driveFileId ? `https://drive.google.com/file/d/${firstFile.driveFileId}/view` : '') ||
      existing.print_file_url || '';

    const notesRaw = (ship.notes && String(ship.notes)) || (p.notes && String(p.notes)) || '';
    const notes = [orderCode ? `#${orderCode}` : '', notesRaw].filter(Boolean).join(' | ');

    // order date
    const when = p.created_at ? new Date(p.created_at) : new Date();
    const orderDate = Utilities.formatDate(when, IT_TZ, 'yyyy-MM-dd HH:mm:ss');

    // â€”â€”â€” Find existing row index â€”â€”â€”
    const data = sh.getDataRange().getValues();  // includes header
    const header = data[0];
    const idx_id = header.indexOf('order_id');

    let rowIndex = getOrderRowIndex(orderId, orderCode); // 1) try cached row
    console.log('[upsert] rowIndex.cache =', rowIndex);

    if (!(rowIndex > 1)) {
      // 2) normal scan by order_id
      const data2 = sh.getDataRange().getValues();  // includes header
      const header2 = data2[0];
      const idx_id2 = header2.indexOf('order_id');
      if (idx_id2 >= 0) {
        for (let r = 1; r < data2.length; r++) {
          if (String(data2[r][idx_id2]) === String(orderId ?? '')) { rowIndex = r+1; break; }
        }
      }
      console.log('[upsert] rowIndex.scanById =', rowIndex);

      // 3) fallback by order_code token in notes
      if (!(rowIndex > 1) && orderCode) {
        const idx_notes2 = header2.indexOf('notes');
        if (idx_notes2 >= 0) {
          for (let r = 1; r < data2.length; r++) {
            if (String(data2[r][idx_notes2] || '').includes('#' + orderCode)) { rowIndex = r+1; break; }
          }
        }
        console.log('[upsert] rowIndex.scanByCodeInNotes =', rowIndex);
      }
    }

    // Build row in exact column order
    const row = [
      orderId,
      orderDate,
      customerName,
      customerEmail,
      customerPhone,
      productName,
      totalQty,
      widthCm,
      heightCm,
      totalPrice,
      currency,
      paymentMethod,
      paymentStatus,
      shippingStreet,
      shippingCity,
      shippingPost,
      shippingCountry,
      billingCompany,
      billingVatNumber,
      billingTaxCode,
      billingRecipientCode,
      billingPec,   // â† NEW
      billingStreet,
      billingCity,
      billingPost,
      billingCountry,
      printFileUrl,
      notes
    ];

    console.log('[upsert] aboutToWrite -> rowIndex:', rowIndex, 'sheet:', sh.getName(), 'cols:', ORDER_COLS.length);

    // Copy to backup sheet if payment status is 'paid'
    if (paymentStatus === 'paid') {
      try {
        copyOrderToBackup(orderId, orderCode, row);
        console.log('[upsert] Order copied to backup sheet for orderId:', orderId);
      } catch (e) {
        console.warn('[upsert] Failed to copy to backup sheet:', e.message);
      }
    }

    if (rowIndex > 0) {
      sh.getRange(rowIndex, 1, 1, ORDER_COLS.length).setValues([row]);
      setOrderSheetName(orderId, orderCode, sh.getName());
      console.log('[upsert] UPDATED rowIndex', rowIndex, 'status=', paymentStatus);
    } else {
      sh.appendRow(row);
      const lastRow = sh.getLastRow();
      setOrderSheetName(orderId, orderCode, sh.getName());
      console.log('[upsert] APPENDED rowIndex', lastRow, 'status=', paymentStatus);
    }

    console.log('â”€â”€ ordersSheet_upsert.DONE in', (Date.now() - t0), 'ms');
  } catch (e) {
    console.error('ordersSheet_upsert.ERROR:', e && e.message, e && e.stack);
    throw e;
  }
}

/**
 * Normalize and validate Italian recipient data before SdI submission.
 */
function normalizeItalianRecipientForSdI({ vatNumber, taxCode, city, province, zip, eiRecipientCode, eiPec }) {
  const out = { errors: [], fixes: [] };

  vatNumber = String(vatNumber || '').trim();
  taxCode   = String(taxCode   || '').trim().toUpperCase();
  city      = String(city      || '').trim();
  province  = String(province  || '').trim().toUpperCase();
  zip       = String(zip       || '').trim();
  eiRecipientCode = String(eiRecipientCode || '').trim().toUpperCase();
  eiPec          = String(eiPec || '').trim() || null;

  const vatDigits = vatNumber.replace(/^IT/i, '').replace(/\D/g, '');
  const isB2B = vatDigits.length === 11;
  const isB2C = !isB2B && taxCode.length === 16;

  if (!isB2B && !isB2C) {
    out.errors.push('Missing or invalid identifiers: need 11-digit P.IVA (B2B) or 16-char CF (B2C).');
  }

  if (isB2B) {
    if (eiRecipientCode.length !== 7 && !eiPec) {
      out.fixes.push('No SDI/PEC for B2B → forcing recipient_code "0000000".');
      eiRecipientCode = '0000000';
    }
    if (taxCode && taxCode.length !== 16) {
      out.fixes.push('B2B with non-16 CF → dropping tax_code.');
      taxCode = '';
    }
  } else {
    eiRecipientCode = '0000000';
    if (vatDigits) {
      out.fixes.push('B2C cannot have P.IVA → dropping vat_number.');
      vatNumber = '';
    }
  }

  if (!/^\d{5}$/.test(zip)) out.errors.push('CAP must be 5 digits.');
  if (!/^[A-Z]{2}$/.test(province)) out.errors.push('Provincia must be 2 uppercase letters.');

  return {
    isB2B, isB2C,
    vatNumber: (isB2B ? ('IT' + vatDigits) : ''),     // ← only 11-digit VAT returns; otherwise empty
    taxCode, city, province, zip,
    eiRecipientCode, eiPec,
    errors: out.errors, fixes: out.fixes
  };
}

/**
 * Run pre-flight normalization + validation for Italian invoices.
 * This is used *inside* ficCreateAndOptionallyEmailInvoice before sending.
 */
function ficPreflightNormalizeItalianRecipient(vatNumber, taxCode, city, province, zip, eiRecipientCode, eiPec) {
const norm = normalizeItalianRecipientForSdI({ vatNumber, taxCode, city, province, zip, eiRecipientCode, eiPec });
if (norm.fixes.length) console.warn('[SdI] preflight.fixes', JSON.stringify(norm.fixes));
if (norm.errors.length) console.warn('[SdI] preflight.errors', JSON.stringify(norm.errors));
  return norm;
}


/** â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
 * PAYMENT_SUCCEEDED  âœ… CANONICAL (maps Supabase fields)
 * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function handlePaymentSucceeded(payload) {
  const orderId    = payload.id;
  const orderCode  = payload.order_code || `ORD-${orderId}`;
  const forceEmail = !!payload.force_email;
  const forceBuild = !!payload.force_build;

  console.log('[HPS] start', JSON.stringify({
    orderId, orderCode, forceEmail, forceBuild,
    keys: Object.keys(payload || {})
  }));

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const folderInfo = findOrderFolder(orderId, orderCode);
    console.log('[HPS] folderInfo', JSON.stringify({
      orderFolderId: folderInfo.orderFolderId,
      invoicesFolderId: folderInfo.invoicesFolderId
    }));

    // Optional enrichment
    let enrichedOrder = null;
    try {
      enrichedOrder = supaGetOrder(orderId);
      console.log('[HPS] supa OK', !!enrichedOrder);
    } catch (e) {
      console.warn('[HPS] supa FAIL', e && e.message);
    }

    // Merge webhook + enrichment
    const data = Object.assign({}, (enrichedOrder || {}), payload);

    // Keep non-empty items if only one side has them
    if (!Array.isArray(data.items) || data.items.length === 0) {
      data.items =
        (Array.isArray(payload.items)        && payload.items.length)        ? payload.items :
        (Array.isArray(enrichedOrder?.items) && enrichedOrder.items.length)  ? enrichedOrder.items : [];
    }
    if (forceBuild) data.force_build = true;

    // Resolve email early
    const emailForInvoice = resolveCustomerEmail({ payload: data, folderInfo, enrichedOrder });
    console.log('[HPS] resolvedEmail', emailForInvoice || '(none)', 'items', (data.items || []).length);

    let inv = null;
    let emailedNow = false;

    // Decide FIC path once and log it
    const ficEnabled = isFICEnabled();
    console.log('[HPS] FIC enabled?', ficEnabled);

    if (ficEnabled) {
      try {
        console.log('[HPS] FIC â†’ create', orderCode);
        const ficRes = ficCreateAndOptionallyEmailInvoice({
          orderId, orderCode, payload: data, customerEmail: emailForInvoice
        });

        inv = {
          fileId:   ficRes.id,
          fileUrl:  ficRes.web_url || ficRes.pdf_url || null,
          fileName: ficRes.number ? `Fattura_${ficRes.number}.pdf` : `Invoice_${orderCode}.pdf`,
          totals:   ficRes.totals || null,
          pdfBlob:  null
        };
        console.log('[HPS] FIC created', JSON.stringify({
          docId: ficRes.id, number: ficRes.number, emailed: ficRes.emailed, hasPdfUrl: !!ficRes.pdf_url
        }));

        // Save FIC PDF into /invoices if we got it
        if (ficRes.pdfBlob) {
          try {
            ficRes.pdfBlob.setName(inv.fileName);
            const pdfFile = DriveApp.getFolderById(folderInfo.invoicesFolderId).createFile(ficRes.pdfBlob);
            inv.fileId   = pdfFile.getId();
            inv.fileUrl  = 'https://drive.google.com/open?id=' + pdfFile.getId();
            inv.fileName = pdfFile.getName();
            inv.pdfBlob  = pdfFile.getBlob();
            console.log('[HPS] FIC pdf saved', inv.fileId);
          } catch (e) {
            console.warn('[HPS] FIC pdf save FAIL', e && e.message);
          }
        } else {
          console.warn('[HPS] FIC returned no pdfBlob (pdf_url may have failed to fetch)');
        }

        if (ficRes.emailed) {
          emailedNow = true;
          setInvoiceEmailed(orderId, orderCode);
          try {
            writeJsonFile(folderInfo.orderFolderId, 'invoice_email.json', {
              sentAt: new Date().toISOString(),
              to: emailForInvoice || '(unknown)',
              fileId: ficRes.id,
              fileName: ficRes.number || `Invoice_${orderCode}`
            }, true);
            console.log('[HPS] wrote invoice_email.json (FIC)');
          } catch (e) {
            console.warn('[HPS] marker write FAIL (FIC)', e && e.message);
          }
        }
      } catch (e) {
        console.error('[HPS] FIC ERROR â†’ fallback', e && e.message);
        // Local HTMLâ†’PDF fallback
        inv = buildInvoiceOnce({
          orderId, orderCode,
          orderFolderId: folderInfo.orderFolderId,
          invoicesFolderId: folderInfo.invoicesFolderId,
          payload: data
        });
        console.log('[HPS] fallback pdf built', inv && inv.fileId);

        if (emailForInvoice && inv && inv.pdfBlob) {
          sendInvoiceEmail({
            to: emailForInvoice,
            orderCode,
            pdfBlob: inv.pdfBlob,
            invoiceFileName: inv.fileName,
            totalCents: inv.totals?.totalCents
          });
          emailedNow = true;
          setInvoiceEmailed(orderId, orderCode);
          try {
            writeJsonFile(folderInfo.orderFolderId, 'invoice_email.json', {
              sentAt: new Date().toISOString(),
              to: emailForInvoice,
              fileId: inv.fileId,
              fileName: inv.fileName
            }, true);
            console.log('[HPS] wrote invoice_email.json (fallback)');
          } catch (e2) {
            console.warn('[HPS] marker write FAIL (fallback)', e2 && e2.message);
          }
        } else if (!emailForInvoice) {
          console.warn('[HPS] fallback: missing email â†’ no Gmail send');
        }
      }
    } else {
      // FIC disabled â†’ original local behavior
      console.log('[HPS] FIC disabled â†’ local invoice');
      inv = buildInvoiceOnce({
        orderId, orderCode,
        orderFolderId: folderInfo.orderFolderId,
        invoicesFolderId: folderInfo.invoicesFolderId,
        payload: data
      });
      console.log('[HPS] local pdf built', inv && inv.fileId);

      if (emailForInvoice && inv && inv.pdfBlob) {
        sendInvoiceEmail({
          to: emailForInvoice,
          orderCode,
          pdfBlob: inv.pdfBlob,
          invoiceFileName: inv.fileName,
          totalCents: inv.totals?.totalCents
        });
        emailedNow = true;
        setInvoiceEmailed(orderId, orderCode);
        try {
          writeJsonFile(folderInfo.orderFolderId, 'invoice_email.json', {
            sentAt: new Date().toISOString(),
            to: emailForInvoice,
            fileId: inv.fileId,
            fileName: inv.fileName
          }, true);
          console.log('[HPS] wrote invoice_email.json (local)');
        } catch (e2) {
          console.warn('[HPS] marker write FAIL (local)', e2 && e2.message);
        }
      } else if (!emailForInvoice) {
        console.warn('[HPS] local: missing email â†’ no Gmail send');
      }
    }

    if (CFG.SEND_INTERNAL_PINGS) {
      bccInternal(`Payment succeeded: ${orderCode}`, `Invoice: ${inv && inv.fileUrl ? inv.fileUrl : '(not created)'}`);
    }

    const alreadyMarked = wasInvoiceEmailed(orderId, orderCode) || invoiceEmailMarkerExists(folderInfo.orderFolderId);
    const result = {
      order_id: orderId,
      order_code: orderCode,
      invoice: (inv && inv.fileUrl) || null,
      emailed: emailedNow || alreadyMarked,
      forced: forceEmail,
      rebuilt: !!forceBuild
    };
    console.log('[HPS] done', JSON.stringify(result));
    ordersSheet_upsert(data, { statusOverride: 'paid' });

    return result;
  } finally {
    lock.releaseLock();
  }
}

  /** â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   * FattureInCloud (FIC) â€“ OAuth2 + Create & Email Invoice
   * Focused, no side-effects elsewhere. Uses your existing payload + math.
   * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

  function isFICEnabled() {
  const en = (PROPS.getProperty('FIC_ENABLED') || '').trim().toLowerCase();
  return en === 'true' || en === '1' || en === 'yes';
  }

function ficCfg() {
  const clientId     = PROPS.getProperty('FIC_CLIENT_ID') || '';
  const clientSecret = PROPS.getProperty('FIC_CLIENT_SECRET') || '';
  const companyId    = PROPS.getProperty('FIC_COMPANY_ID') || '';
  const redirectUri  = PROPS.getProperty('FIC_REDIRECT_URI') || '';
  const refreshToken = PROPS.getProperty('FIC_REFRESH_TOKEN') || '';

  const senderEmail  = PROPS.getProperty('FIC_SENDER_EMAIL') || '';
  const senderId     = PROPS.getProperty('FIC_SENDER_ID') || '';       // â† NEW
  const sendEmail    = (PROPS.getProperty('FIC_SEND_EMAIL') || 'true').toLowerCase() === 'true';

  if (!clientId || !clientSecret || !companyId || !redirectUri) {
    throw new Error('FIC config incomplete (FIC_CLIENT_ID / SECRET / COMPANY_ID / REDIRECT_URI).');
  }
  return { clientId, clientSecret, companyId, redirectUri, refreshToken, senderEmail, senderId, sendEmail };
}


function ficPrintAuthUrl() {
  const { clientId, redirectUri } = ficCfg();

  // âœ… Valid, minimal scopes for what your script actually does:
  // - read/write clients (upsert/find by email)
  // - read/write issued invoices (create + email)
  // - read settings (VAT types)
  const scope = [
    'entity.clients:r',
    'entity.clients:a',
    'issued_documents.invoices:r',
    'issued_documents.invoices:a',
    'emails:r',
    'settings:r'
  ].join(' ');

  const state = Utilities.getUuid();
  const url =
    'https://api-v2.fattureincloud.it/oauth/authorize'
    + '?response_type=code'
    + '&client_id=' + encodeURIComponent(clientId)
    + '&redirect_uri=' + encodeURIComponent(redirectUri)
    + '&scope=' + encodeURIComponent(scope)
    + '&state=' + encodeURIComponent(state);

  console.log('Open this URL to authorize FIC:', url);
  return url;
}

  function ficExchangeCodeForRefreshToken(code) {
    const { clientId, clientSecret, redirectUri } = ficCfg();
    const res = UrlFetchApp.fetch('https://api-v2.fattureincloud.it/oauth/token', {
      method: 'post',
      muteHttpExceptions: true,
      contentType: 'application/x-www-form-urlencoded',
      payload: {
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code
      }
    });
    const body = JSON.parse(res.getContentText() || '{}');
    if (!body.refresh_token) throw new Error('FIC token exchange failed: ' + res.getContentText());
    PROPS.setProperty('FIC_REFRESH_TOKEN', body.refresh_token);
    if (body.access_token) PROPS.setProperty('FIC_ACCESS_TOKEN', body.access_token);
    if (body.expires_in)   PROPS.setProperty('FIC_ACCESS_EXPIRES_AT', String(Date.now() + (Number(body.expires_in) * 1000) - 30000));
  }

  function ficGetAccessToken() {
    const { clientId, clientSecret, refreshToken } = ficCfg();
    let access = PROPS.getProperty('FIC_ACCESS_TOKEN') || '';
    const expAt = Number(PROPS.getProperty('FIC_ACCESS_EXPIRES_AT') || 0);

    if (access && Date.now() < expAt) return access;
    if (!refreshToken) throw new Error('Missing FIC_REFRESH_TOKEN. Run ficPrintAuthUrl() and approve.');

    const res = UrlFetchApp.fetch('https://api-v2.fattureincloud.it/oauth/token', {
      method: 'post',
      muteHttpExceptions: true,
      contentType: 'application/x-www-form-urlencoded',
      payload: {
        grant_type: 'refresh_token',
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken
      }
    });
    const body = JSON.parse(res.getContentText() || '{}');
    if (!body.access_token) throw new Error('FIC refresh failed: ' + res.getContentText());

    PROPS.setProperty('FIC_ACCESS_TOKEN', body.access_token);
    if (body.expires_in) PROPS.setProperty('FIC_ACCESS_EXPIRES_AT', String(Date.now() + (Number(body.expires_in) * 1000) - 30000));
    return body.access_token;
  }

  function ficReq(path, options) {
    const { companyId } = ficCfg();
    const token = ficGetAccessToken();
    const url = 'https://api-v2.fattureincloud.it/c/' + encodeURIComponent(companyId) + path;
    const resp = UrlFetchApp.fetch(url, {
      method: (options && options.method) || 'get',
      muteHttpExceptions: true,
      headers: Object.assign({
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }, (options && options.headers) || {}),
      payload: options && options.payload ? JSON.stringify(options.payload) : undefined
    });
    const code = resp.getResponseCode();
    const txt = resp.getContentText();
    if (code >= 300) throw new Error('FIC ' + path + ' ' + code + ': ' + txt);
    return JSON.parse(txt || '{}');
  }

  // Ensure / upsert customer (basic, by email)
  function ficUpsertClientByEmail(customer) {
    // Very small, pragmatic implementation:
    // Try find by email; if not found, create.
    const email = (customer && customer.email || '').trim();
    if (!email) return null;

    // Search
    let found = null;
    try {
      const q = ficReq('/entities/clients?per_page=50', { method: 'get' });
      const list = (q && q.data) || [];
      found = list.find(c => (c.email || '').toLowerCase() === email.toLowerCase());
    } catch (_) {}

    if (found) return found;

    // Create
  const ctry = ficCountryFromAny(customer.country);
  const uniqueCode = 'CLI-' + Utilities.base64EncodeWebSafe(email.toLowerCase()).replace(/=+$/,''); // unique, safe

  const payload = {
    data: {
      code: uniqueCode, // ðŸ‘ˆ makes the record unique even if the name repeats
      name: (customer.name || [customer.first_name, customer.last_name].filter(Boolean).join(' ') || 'Cliente').trim(),
      email: email,
      address_street: customer.address || undefined,
      address_postal_code: customer.zip || customer.postcode || undefined,
      address_city: customer.city || undefined,
      address_province: customer.province || undefined,
      country: ctry.country,
      country_iso: ctry.country_iso
    }
  };

    const created = ficReq('/entities/clients', { method: 'post', payload });
    return created && created.data ? created.data : null;
  }

  // Map any "country-ish" value to FIC-expected fields
  function ficCountryFromAny(v) {
    const s = String(v || '').trim();
    if (!s) return { country: undefined, country_iso: undefined };

    const upper = s.toUpperCase();

    // Common fast paths
    if (upper === 'IT' || upper === 'ITALY' || upper === 'ITALIA') {
      return { country: 'Italia', country_iso: 'IT' };
    }

    // If it looks like an ISO code, put it in country_iso only
    if (/^[A-Z]{2}$/.test(upper)) {
      return { country: undefined, country_iso: upper };
    }

    // Otherwise treat it as a full name as-is
    return { country: s, country_iso: undefined };
  }

  function ficSafeEntityName(contact) {
    const raw =
      (contact && String(contact.name || '').trim()) ||
      '';

    // Fallbacks: email local-part â†’ generic "Cliente"
    if (raw) return raw;

    const email = contact && contact.email ? String(contact.email).trim() : '';
    if (email && email.includes('@')) {
      return email.split('@')[0]; // e.g. "mario.rossi"
    }
    return 'Cliente';
  }

  function ficListVatTypes() {
    const res = ficReq('/settings/vat_types', { method: 'get' });
    const list = (res && res.data) || [];
    // Debug once so we can see what's actually returned
    console.log('FIC VAT types:', JSON.stringify(list.map(t => ({
      id: t.id, value: t.value, description: t.description, is_default: t.is_default, is_disabled: t.is_disabled
    }))));
    return list;
  }

  function pctNum(x) {
    if (x == null) return null;
    const s = String(x).replace('%', '').replace(',', '.');
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }

  function ficGetVatTypeIdByValue(vatRate) {
    // 0) Manual override (works immediately if you know the id)
    const manual = PROPS.getProperty('FIC_DEFAULT_VAT_ID');
    if (manual) return String(manual);

    const key = 'FIC_VAT_ID_FOR_' + String(vatRate);
    const cached = PROPS.getProperty(key);
    if (cached) return cached;

    const list = ficListVatTypes();
    if (!list.length) throw new Error('No VAT types returned by FIC.');

    const wantedRate = pctNum(vatRate);

    // Try several common shapes/fields and ignore disabled entries
    let wanted =
      list.find(t => !t.is_disabled && pctNum(t.value ?? t.percentage ?? t.rate) === wantedRate) ||
      list.find(t => !t.is_disabled && t.is_default) ||
      list.find(t => !t.is_disabled && pctNum(t.value ?? t.percentage ?? t.rate) > 0) ||
      list.find(t => !t.is_disabled) ||
      list[0];

    if (!wanted || !wanted.id) {
      throw new Error('Could not resolve a VAT type id for rate ' + vatRate);
    }

    PROPS.setProperty(key, String(wanted.id)); // cache for next time
    return String(wanted.id);
  }
// --- SAFE PATCH: preserve existing code so FIC doesn't auto-regenerate it and 409 ---
function ficUpdateClient(id, patch) {
  const safePatch = Object.assign({}, patch || {});
  delete safePatch.code;                      // â† never touch code
  delete safePatch.id;                        // â† never send id in the body
  return ficReq('/entities/clients/' + id, {
    method: 'put',
    payload: { data: safePatch }
  }).data;
}


/**
 * Creates the invoice in FIC, (optionally) emails it from FIC, and
 * returns a pdfBlob you can save into /invoices.
 *
 * Returns: { id, number, web_url, pdf_url, emailed, totals, pdfBlob }
 */
function ficCreateAndOptionallyEmailInvoice({ orderId, orderCode, payload, customerEmail }) {
  const p = payload || {};
  const t0 = Date.now();
  console.log('[FIC] create.start', JSON.stringify({ orderId, orderCode }));

  const cfg = ficCfg();

  // â”€â”€ 1) Totals & items (NET prices)
  const calc = computeInvoiceBreakdown(payload);
  console.log('[FIC] breakdown', JSON.stringify(calc.breakdown));
  const items = calc.items.length ? calc.items : [{ name: 'Articolo', quantity: 1, unit_amount: 0 }];
  console.log('[FIC] items.count', items.length, 'first', items[0] ? {
    name: String(items[0].name),
    qty: Number(items[0].quantity || 1),
    unit: Number(items[0].unit_amount || 0)
  } : null);

// 2) Contact mapping
const ship = payload.shipping || {};
const cust = payload.customer || {};
const phone = (ship.phone || String(ship.phone).trim() || cust.phone || String(cust.phone).trim() || '').trim();
const email = customerEmail || (ship.email || cust.email || '').trim();
const person = (ship.name ? String(ship.name).trim() : [ship.name, ship.surname].filter(Boolean).join(' ').trim()) || 
               ([cust.firstname, cust.lastname].filter(Boolean).join(' ').trim() || '');
const company = (cust.company || ship.company || '').trim();
const displayName = person ? `${person}${company ? ` â€” ${company}` : ''}` : company || ficSafeEntityName({ name: person, email });
const address = ship.address || ship.address1 || '';
let city = ship.city || '';
let province = ship.province || '';
let zip = ship.zip || ship.postcode || '';
const country = ship.country || 'IT';

// *** NEW: Fetch billing info from Google Sheet ***
console.log('[FIC] fetching billing from sheet', { orderId, orderCode });
const sheetBilling = getOrderBillingInfo(orderId, orderCode);
console.log('[FIC] sheet billing', { vat: sheetBilling.vat_number, tax: sheetBilling.tax_code });

// Extract VAT / Tax IDs - PREFER SHEET VALUES FIRST

 const bill = (p.billing && Object.keys(p.billing || {}).length
               ? p.billing
               : (p.billing_info || {}));
console.log('[FIC] incoming billing', {
  recipient_code: bill.recipient_code || bill.codice_destinatario || null,
  pec: bill.pec || bill.pec_address || null
});

let vatNumber = (
  sheetBilling.vat_number ||                    // â† FROM SHEET (priority)
  bill.vat_number || bill.vat || 
  cust.vat_number || cust.vat || 
  ''
).trim();
let taxCode = (
  sheetBilling.tax_code ||                      // â† FROM SHEET (priority)
  bill.tax_code || bill.codice_fiscale || 
  cust.codice_fiscale || 
  ''
).trim();

console.log('[FIC] contact', JSON.stringify({ email, person, company, displayName, city, province, zip, country }));
console.log('[FIC] resolved VAT/Tax', { vatNumber, taxCode });

// --- Electronic invoicing routing (Italy only) ---
const countryIso = ficCountryFromAny(country).country_iso || 'IT';

// ✅ DECLARE FIRST
let eiRecipientCode =
  (bill.recipient_code || 
   bill.codice_destinatario || 
   bill.sdiCode ||
   sheetBilling.recipient_code) ||
  PROPS.getProperty('FIC_DEFAULT_RECIPIENT_CODE') || '0000000';

let eiPec =
  (bill.pec || 
   bill.pec_address || 
   bill.pecAddress ||
   sheetBilling.pec) ||
  (PROPS.getProperty('FIC_DEFAULT_RECIPIENT_PEC') || null);

// ✅ NOW LOG THEM
console.log('[FIC] resolved EI', { eiRecipientCode, eiPec });

// --- PRE-FLIGHT NORMALIZATION FOR ITALIAN RECIPIENTS ---
const norm = ficPreflightNormalizeItalianRecipient(vatNumber, taxCode, city, province, zip, eiRecipientCode, eiPec);

// Overwrite local values if normalized (so later entity & ei_data use corrected values)
vatNumber       = norm.vatNumber;
taxCode         = norm.taxCode;       // ← CF will become '' for B2B if not 16 chars
city            = norm.city;
province        = norm.province;
zip             = norm.zip;
eiRecipientCode = norm.eiRecipientCode;
eiPec           = norm.eiPec;
// -------------------------------------------------------

// Choose EI payment method code for SdI (defaults work; override via Script Property)
const eiPaymentMethod =
  PROPS.getProperty('FIC_EI_PAYMENT_METHOD') ||
  (/(card|credit|debit|stripe|visa|master)/i.test(String(payload.payment_method||'')) ? 'MP08' : 'MP01'); 
// MP08 = carta di pagamento (Stripe/cards), MP01 = contanti


// 3 Upsert client by email, then update ALL relevant fields
let client = null;
try {
  if (email) {
    client = ficUpsertClientByEmail({ email, name: displayName, address, city, province, zip, country });
  }
  console.log('[FIC] client.linked', client ? { id: client.id, name: client.name, code: client.code } : null);

  // Update client with full current order details (name, VAT, tax code, address)
  if (client) {
    try {
const updatePayload = {
  name: displayName,
  email: email,
  vat_number: vatNumber || undefined,
  tax_code: taxCode || undefined,
  address_street: address || undefined,
  address_postal_code: zip || undefined,
  address_city: city || undefined,
  address_province: province || undefined,
  ...ficCountryFromAny(country),
  e_invoice: true,
  ei_code: eiRecipientCode || '0000000',
  certified_email: eiPec || undefined
};
      
      client = ficUpdateClient(client.id, updatePayload);
      console.log('[FIC] client.updated', { id: client.id, name: client.name, vat: !!vatNumber, tax: !!taxCode });
    } catch (e) {
      console.warn('[FIC] client.update.skip', e, e.message);
    }
  }
} catch (e) {
  console.warn('[FIC] client.upsert.fail (proceeding inline)', e, e.message);
}

  // â”€â”€ 4) Items â†’ FIC format (NET + VAT id)
  const vatRate   = calc.breakdown.vatRate || 22;
  console.log('[FIC] vat.rate', vatRate);
  const vatTypeId = ficGetVatTypeIdByValue(vatRate);
  console.log('[FIC] vat.typeId', vatTypeId);

const ficItems = items.map(li => ({
  name: sdiSanitizeText(String(li.name || 'Articolo')),
  qty: Number(li.quantity || li.qty || 1),
  net_price: round2(Number(li.unit_amount || li.unitPrice || 0)), // NET €
  vat: { id: vatTypeId }
}));

// â¬‡ï¸ ADD THIS: reflect shipping & discount into FIC items so totals match
if ((calc.breakdown.shippingCents || 0) > 0) {
  ficItems.push({
    name: sdiSanitizeText('Spedizione'),
    qty: 1,
    net_price: round2(calc.breakdown.shippingCents / 100),
    vat: { id: vatTypeId }
  });
}
if ((calc.breakdown.discountCents || 0) > 0) {
  ficItems.push({
    name: sdiSanitizeText('Sconto'),
    qty: 1,
    net_price: round2(-calc.breakdown.discountCents / 100),
    vat: { id: vatTypeId }
  });
}


// 5) Notes (FORCE hard line breaks in FIC PDF)
const cityProvCap = [city, province ? `(${province})` : null, zip].filter(Boolean).join(' ');

// Build clean, well-spaced notes with TWO blank lines after each field
const NOTES_LINES = [
  `Ordine: ${orderCode}`,
  '',  // first blank line
  '',  // second blank line
  company && `Azienda: ${company}`,
  '',  // first blank line
  '',  // second blank line
  vatNumber && `Partita IVA: ${vatNumber}`,
  '',  // first blank line
  '',  // second blank line
  taxCode && `Codice Fiscale: ${taxCode}`,
  '',  // first blank line
  '',  // second blank line
  person && `Nome: ${person}`,
  '',  // first blank line
  '',  // second blank line
  email && `Email: ${email}`,
  '',  // first blank line
  '',  // second blank line
  phone && `Telefono: ${phone}`,
  '',  // first blank line
  '',  // second blank line
  address && `Indirizzo: ${address}`,
  '',  // first blank line
  '',  // second blank line
  cityProvCap && `CittÃ /Prov/CAP: ${cityProvCap}`,
  '',  // first blank line
  '',  // second blank line
  country && `Paese: ${country}`
].filter(v => v !== null && v !== '');  // Remove nulls but keep empty strings

// FIC collapses plain \n, so send HTML with <br/> (escaped) to force line breaks
const notesHtml = NOTES_LINES
  .map(l => sdiSanitizeText(l))
  .map(l => escapeHtml(l))
  .join('<br/>\n');

// keep a text preview for logs
console.log('[FIC] notes.preview', NOTES_LINES.join(' âŽ '));

// (keep a text preview for logs)
console.log('[FIC] notes.preview', NOTES_LINES.join(' âŽ '));

// 6) Entity block - always include name, VAT, Tax Code
const safeName = displayName || ficSafeEntityName({name: person, email});

const entityBlock = client ? {
  id: client.id,
  name: client.name || safeName,
  email: email || undefined,
  vat_number: vatNumber || undefined,
  tax_code: taxCode || undefined,
  address_street: address || undefined,
  address_postal_code: zip || undefined,
  address_city: city || undefined,
  address_province: province || undefined,
  ...ficCountryFromAny(country),

  // ➜ ensure FIC UI “Fatturazione elettronica” is filled
  e_invoice: true,
  ei_code: eiRecipientCode || '0000000',
  certified_email: eiPec || undefined
} : {
  name: safeName,
  email: email || undefined,
  vat_number: vatNumber || undefined,
  tax_code: taxCode || undefined,
  address_street: address || undefined,
  address_postal_code: zip || undefined,
  address_city: city || undefined,
  address_province: province || undefined,
  ...ficCountryFromAny(country),

  // ➜ same for the inline entity case
  e_invoice: true,
  ei_code: eiRecipientCode || '0000000',
  certified_email: eiPec || undefined
};

  console.log('[FIC] entity.block', JSON.stringify({ hasId: !!entityBlock.id, name: entityBlock.name, email: entityBlock.email }));

  // â”€â”€ 7) Build the document payload
  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'Europe/Rome', 'yyyy-MM-dd');
  // Recompute totals from the exact items weâ€™re sending to FIC (prevents 1Â¢ drift)
  const ficNetEUR = round2(ficItems.reduce((a, it) => a + (Number(it.net_price) * Number(it.qty || 1)), 0));
  const ficVatEUR = round2(ficNetEUR * (vatRate / 100));
  const totalEUR  = round2(ficNetEUR + ficVatEUR);
  const isPaid = !!payload.paid_at ||
                 /^(succeeded|paid|complete)$/i.test((payload.payment_details && payload.payment_details.status) || '');
  const paymentAccountId = PROPS.getProperty('FIC_PAYMENT_ACCOUNT_ID'); // optional

// --- Extract "numeration" and "number" from orderCode like "ORD-22"
let ficNumeration = null;
let ficNumber = null;
{
  const m = String(orderCode || '')
    .trim()
    .match(/^([A-Za-z]+)[^\d]*?(\d+)$/);
  if (m) {
    ficNumeration = '-' + m[1].toUpperCase(); // <-- add the "-" prefix here
    ficNumber = parseInt(m[2], 10);
  }
}

  const createPayload = {
    data: {
      type: 'invoice',
      date: today,
      numeration: ficNumeration || orderCode,   // "ORD"
      ...(ficNumber != null ? { number: ficNumber } : {}), // 22
      subject: 'Fattura ' + orderCode,
      currency: { id: 'EUR' },
      entity: entityBlock,
      items_list: ficItems,
      use_gross_prices: false,
      show_totals: 'all',
      notes: notesHtml,
      notes_as_html: true,

      // â–¼ NEW
      e_invoice: true,
      ei_data: {
        // these two lines make the UI fields populate:
        recipient_code: eiRecipientCode || '0000000',
        pec: eiPec || null,
        // keep your SdI payment method code:
        payment_method: eiPaymentMethod
      },

      payment_method: { name: String(payload.payment_method || 'Carta') },
      payments_list: [{
        amount: totalEUR,
        due_date: today,
        status: isPaid ? 'paid' : 'not_paid',
        ...(isPaid && paymentAccountId ? { payment_account: { id: Number(paymentAccountId) } } : {})
      }]
    }
  };
  console.log('[FIC] payload.summary', JSON.stringify({
    date: today,
    numeration: orderCode,
    items: ficItems.length,
    isPaid,
    amount: totalEUR
  }));

  // â”€â”€ 8) Create the document
  let doc;
  let verify = null;
  try {
    const created = ficReq('/issued_documents', { method: 'post', payload: createPayload });
    doc = created && created.data;
    console.log('[FIC] created', JSON.stringify({ id: doc && doc.id, number: doc && doc.number }));

    // Pre-flight: ask FIC to run "Formal verification" on the XML we just created
    verify = ficVerifyEInvoice(doc.id);
if (verify && verify.valid === false) {
  console.warn('[FIC] e-invoice.verify.invalid', JSON.stringify(verify.validation_result || verify));
} else {
  console.log('[FIC] e-invoice.verify.ok');
}

    if (!doc || !doc.id) throw new Error('FIC create invoice failed: no id returned');
  } catch (err) {
    console.error('[FIC] create.error', err && err.message);
    try {
      console.error('[FIC] create.payload.check', JSON.stringify({
        entity: { hasId: !!entityBlock.id, name: entityBlock.name, email: entityBlock.email },
        items: ficItems.map(it => ({ name: it.name, qty: it.qty, net_price: it.net_price, vat: it.vat })),
        payments: createPayload.data.payments_list,
        notesHasBR: /<br\/?>/i.test(notesHtml) 
      }));
    } catch (_) {}
    throw err;
  }

// 8.1) Send e-invoice to SdI + poll async SdI status (to see the real reason)
const mustTryEISend =
  (ficCountryFromAny(country).country_iso || 'IT') === 'IT' &&
  ((vatNumber && vatNumber.replace(/^IT/i, '').trim().length === 11) ||
   (taxCode && taxCode.trim().length === 16));

if (mustTryEISend) {
  // Only send if verify didn't report invalid (null/405 → treat as OK)
  if (!verify || verify.valid !== false) {
    // small settle so their backend computes totals
+   Utilities.sleep(1200);  // ← you were missing the actual delay

    let sent = false;

    // 1) try to send (retry once unless it's a 4xx validation error)
    for (let i = 1; i <= 2; i++) {
      try {
        ficReq('/issued_documents/' + encodeURIComponent(doc.id) + '/e_invoice/send', {
          method: 'post',
          payload: { data: {} }
        });
        console.log('[FIC] e-invoice sent to SdI');
        sent = true;
        break;
      } catch (e) {
        const msg = String((e && e.message) || '');
        // Validation errors: do not retry; fix data instead
        if (/ 4\d\d: /.test(msg) || /Validation step|Validation XML/i.test(msg)) {
          console.warn('[FIC] e-invoice send validation error (no retry):', msg);
          break;
        }
        console.warn('[FIC] e-invoice send retry', i, msg);
        Utilities.sleep(1000);
      }
    }

    // 2) poll final SdI status so we can see the exact discard reason
    if (sent) {
      const st = ficWaitEInvoiceStatus(doc.id, { timeoutMs: 90000, intervalMs: 5000 });
      if (st && (st.status === 'discarded' || st.status === 'error')) {
        console.warn('[FIC] e-invoice.rejected', JSON.stringify({
          status: st.status,
          code: st.error_code || null,
          message: st.error_message || null
        }));
      } else {
        console.log('[FIC] e-invoice.final', JSON.stringify(st));
      }
    }
  } else {
    console.warn('[FIC] skip send: formal verification failed');
  }
} else {
  console.log('[FIC] e-invoice send skipped (non-IT or missing VAT/CF)');
}

// â”€â”€ 9) Get a downloadable PDF (poll up to ~60s) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// new: ~3s max
let pdf_url = null, pdfBlob = null;
for (let i = 1; i <= 3; i++) {             // only 3 tries
  try {
    const pdfRes = ficReq('/issued_documents/' + encodeURIComponent(doc.id) + '/pdf', { method: 'get' });
    pdf_url = (pdfRes && pdfRes.data && pdfRes.data.url) || null;
    if (pdf_url) {
      const f = UrlFetchApp.fetch(pdf_url, { muteHttpExceptions: true });
      const fname = (doc.number ? ('Fattura_' + doc.number + '.pdf') : ('Invoice_' + orderCode + '.pdf'));
      pdfBlob = f.getBlob().setName(fname);
      break;
    }
  } catch (e) {}
  if (!pdf_url) Utilities.sleep(1000);     // 1s between tries
}
if (!pdf_url) console.warn('[FIC] pdf.notready.after.3s');



// â”€â”€ 10) Email directly from FIC (optional) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
let emailed = false;
if (cfg.sendEmail && email) {
  try {
   const emailPayload = {
     data: {
       recipient_email: email,
       subject: 'Fattura ' + (doc.number || orderCode),
        body: 'In allegato trovi la tua fattura.',
        attach_pdf: true,
        include: { document: true, delivery_note: false, attachment: false, accompanying_invoice: false },
        // REQUIRED by FIC:
        send_copy: true,
       // Basic plan safe default: force a valid sender so API doesnâ€™t 422
       sender_email: (cfg.senderEmail || 'no-reply@fattureincloud.it')
        // (If you later get a real sender id, you can pass sender_id instead.)
      }
    };
    console.log('[FIC] email.attempt', JSON.stringify({
      to: email, senderEmail: cfg.senderEmail || null, senderId: cfg.senderId || null
    }));

    ficReq('/issued_documents/' + encodeURIComponent(doc.id) + '/email', {
      method: 'post',
      payload: emailPayload
    });
    emailed = true;
    console.log('[FIC] email.sent', true);
  } catch (e) {
    console.warn('[FIC] email.fail', e && e.message);
  }
} else {
  console.log('[FIC] email.skip', JSON.stringify({ sendEmail: cfg.sendEmail, hasRecipient: !!email }));
}

  // â”€â”€ 11) Return mirror shape
  const totals = {
    currency: 'EUR',
    subtotalCents: Math.round(calc.breakdown.subtotalCents),
    shippingCents: Math.round(calc.breakdown.shippingCents),
    discountCents: Math.round(calc.breakdown.discountCents),
    imponibileCents: Math.round(calc.breakdown.imponibileCents),
    vatRate,
    vatCents: Math.round(calc.breakdown.vatCents),
    totalCents: Math.round(calc.breakdown.totalCents)
  };

  const result = {
    id: doc.id,
    number: doc.number || null,
    web_url: doc.url || null,
    pdf_url,
    emailed,
    totals,
    pdfBlob
  };
  console.log('[FIC] create.done', JSON.stringify({
    id: result.id, number: result.number, emailed: result.emailed, tookMs: (Date.now() - t0)
  }));
  return result;
}


  function round2(n) { return Math.round(Number(n || 0) * 100) / 100; }

  /** â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   * Supabase tickets insert (uses service role key)
   * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function supaInsertTicket(row) {
    if (!CFG.SUPABASE_URL || !CFG.SUPABASE_KEY) {
      throw new Error('Supabase not configured: SUPABASE_URL or SUPABASE_SERVICE_KEY missing');
    }
    const table = getProp('TICKETS_TABLE') || 'tickets';
    const url = `${CFG.SUPABASE_URL}/rest/v1/${encodeURIComponent(table)}`;
    const res = UrlFetchApp.fetch(url, {
      method: 'post',
      headers: {
        'apikey': CFG.SUPABASE_KEY,
        'Authorization': 'Bearer ' + CFG.SUPABASE_KEY,

        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      payload: JSON.stringify(row),
      muteHttpExceptions: true
    });
    const code = res.getResponseCode();
    if (code >= 300) {
      throw new Error(`supaInsertTicket ${code}: ${res.getContentText()}`);
    }
    const body = JSON.parse(res.getContentText() || '[]');
    return Array.isArray(body) && body.length ? body[0] : body;
  }

  // Pretty HTML for PAYMENT_FAILED (customer + internal)
function buildPaymentFailedEmail({ brand = CFG.BRAND, orderCode, retryUrl, customerEmail, orderFolderLink, payload }) {
  const accent = brand.ACCENT || '#111827';
  const site   = (brand.WEBSITE || 'https://printora.it').replace(/\/+$/,'');
  const badge  = `
    <span style="
      display:inline-block;padding:4px 10px;border-radius:999px;
      background:#fee2e2;color:#991b1b;font-weight:700;font-size:12px;
      letter-spacing:.3px;text-transform:uppercase
    ">Payment failed</span>`;

  const btn = `
    <a href="${retryUrl}" target="_blank" style="
      display:inline-block;padding:10px 16px;border-radius:10px;
      background:${accent};color:#fff;text-decoration:none;font-weight:600">
      Riprova il pagamento
    </a>`;

  const metaRow = (label, value, isLink=false) => `
    <tr>
      <td style="padding:8px 0;color:#64748b;width:140px">${escapeHtml(label)}</td>
      <td style="padding:8px 0">${isLink
        ? `<a href="${value}" target="_blank" style="color:${accent};text-decoration:none">${escapeHtml(value)}</a>`
        : `<span style="color:#0f172a">${escapeHtml(value || '-')}</span>`}
      </td>
    </tr>`;

  const outer = (inner) => `
    <div style="font-family:Inter,Helvetica,Arial,sans-serif;background:#f8fafc;padding:0;margin:0">
      <div style="max-width:640px;margin:0 auto;padding:24px">
        <div style="background:#fff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden">
          <div style="padding:18px 20px;border-bottom:1px solid #e5e7eb;display:flex;align-items:center;gap:10px">
            <div style="font-size:18px;font-weight:800;letter-spacing:.2px;color:#0f172a">${escapeHtml(brand.NAME || 'Printora')}</div>
            <div style="margin-left:auto">${badge}</div>
          </div>
          <div style="padding:20px">${inner}</div>
          <div style="padding:14px 20px;border-top:1px solid #e5e7eb;color:#64748b;font-size:12px">
            ${escapeHtml(brand.ADDR1 || '')} ${escapeHtml(brand.ADDR2 || '')}${brand.WEBSITE ? ` · <a href="${site}" style="color:${accent};text-decoration:none">${escapeHtml(site)}</a>` : ''}
          </div>
        </div>
      </div>
    </div>`.trim();

  // ---------- Customer email ----------
  const customerInner = `
    <h1 style="margin:0 0 8px;font-size:20px;color:#0f172a">Pagamento non riuscito per ${escapeHtml(orderCode)}</h1>
    <p style="margin:0 0 16px;color:#0f172a">Purtroppo il pagamento non è andato a buon fine.</p>
    <p style="margin:0 20px 18px 0">${btn}</p>
    <table style="width:100%;border-collapse:collapse">
      ${metaRow('Ordine', orderCode)}
      ${metaRow('Riprova', retryUrl, true)}
    </table>
    <p style="margin:18px 0 0;color:#334155">Se hai bisogno di aiuto, rispondi a questa email: ti assistiamo noi.</p>
  `;
  const customerHtml = outer(customerInner);
  const customerSubject = `[${brand.NAME}] Pagamento non riuscito — ${orderCode}`;

  // ---------- Internal email ----------
// Pretty-print payload details for admins in table format
function formatOrderDetails(p) {
  if (!p) return '<i>No details available</i>';

  const block = (title, rowsHtml) => `
    <div style="margin-top:18px;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden">
      <div style="background:#f1f5f9;padding:8px 12px;font-weight:700;color:#0f172a">${escapeHtml(title)}</div>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        ${rowsHtml}
      </table>
    </div>`;

  const row = (k,v) => `
    <tr>
      <td style="padding:6px 10px;width:170px;color:#64748b">${escapeHtml(k)}</td>
      <td style="padding:6px 10px;color:#0f172a">${escapeHtml(v || '-')}</td>
    </tr>`;

  const customer = p.customer ? block('Customer', Object.entries(p.customer).map(([k,v])=>row(k,v)).join('')) : '';
  const shipping = p.shipping ? block('Shipping', Object.entries(p.shipping).map(([k,v])=>row(k,v)).join('')) : '';
  const billing  = p.billing  ? block('Billing',  Object.entries(p.billing ).map(([k,v])=>row(k,v)).join('')) : '';

  const items = Array.isArray(p.items) && p.items.length
    ? block('Items', p.items.map(i => `
        <tr><td colspan="2" style="padding:6px 10px;border-bottom:1px solid #e5e7eb">
          <strong>${escapeHtml(i.name)}</strong><br>
          Qty: ${escapeHtml(i.quantity)} | ${i.width_cm}×${i.height_cm}cm | €${i.unit_amount}
        </td></tr>`).join(''))
    : '';

  const files = Array.isArray(p.print_files) && p.print_files.length
    ? block('Print Files', p.print_files.map(f => `
        <tr><td colspan="2" style="padding:6px 10px">
          ${escapeHtml(f.kind)} — 
          <a href="${f.driveLink}" style="color:${accent};text-decoration:none">Open file</a>
        </td></tr>`).join(''))
    : '';

  const payment = p.payment_details ? block('Payment Details', Object.entries(p.payment_details).map(([k,v])=>{
      if (typeof v === 'object') return row(k, JSON.stringify(v));
      return row(k,v);
  }).join('')) : '';

  const notes = p.notes ? block('Notes', `<tr><td style="padding:6px 10px" colspan="2">${escapeHtml(p.notes)}</td></tr>`) : '';

  const general = block('Order Info', [
    row('Order ID', p.id),
    row('Order Code', p.order_code),
    row('Created At', p.created_at),
    row('Currency', p.currency),
    row('Payment Method', p.payment_method),
    row('Amount Total (cents)', p.amount_total_cents)
  ].join(''));

  return [general, customer, shipping, billing, items, files, payment, notes].join('');
}

const internalInner = `
  <h1 style="margin:0 0 6px;font-size:20px;color:#0f172a">PAYMENT_FAILED — ${escapeHtml(orderCode)}</h1>
  <table style="width:100%;border-collapse:collapse;margin:6px 0 14px">
    ${metaRow('Cliente', customerEmail || '-')}
    ${metaRow('Retry', retryUrl, true)}
    ${orderFolderLink ? metaRow('Order folder', orderFolderLink, true) : ''}
  </table>
  ${formatOrderDetails(payload)}
`;

  const internalHtml = outer(internalInner);
  const internalSubject = `[Alert] Payment failed — ${orderCode}`;

  return { customerHtml, internalHtml, customerSubject, internalSubject };
}

  /** â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   * PAYMENT_FAILED
   * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function handlePaymentFailed(payload) {
    const orderId = payload.id;
    const orderCode = payload.order_code || `ORD-${orderId}`;

    // Get folder info so resolveCustomerEmail can also read the marker if needed
    const folderInfo = findOrderFolder(orderId, orderCode);

    // Use the robust resolver (payload -> enriched -> marker)
    const customerEmail = resolveCustomerEmail({
      payload: payload || {},
      folderInfo,
      enrichedOrder: null
    });

    const orderFolderLink = folderInfo?.orderFolderLink || '';

    // Build retry URL back to your checkout
    const site = (CFG.BRAND.WEBSITE || 'https://printora.it').replace(/\/+$/,'');
    const retryUrl = `${site}/checkout?retry=1&order=${encodeURIComponent(orderCode)}`;

    // 1) Insert a ticket row in Supabase (now includes the resolved email)
    try {
      const row = {
        type: 'PAYMENT_FAILED',
        order_code: orderCode,
        customer_email: customerEmail || null,
        status: 'open',
        severity: 'normal',
        retry_url: retryUrl,
        details_json: payload || {},
        order_folder: orderFolderLink,
        notes: null
      };
      if (typeof supaInsertTicket === 'function') supaInsertTicket(row);
    } catch (e) {
      console.warn('Ticket insert failed:', e);
    }

// 2) Email the customer FROM supporto@ (only if we have an email)
const tpl = buildPaymentFailedEmail({
  orderCode,
  retryUrl,
  customerEmail,
  orderFolderLink,
  payload,
  brand: CFG.BRAND
});

// Customer email
if (customerEmail) {
  const opts = getSafeSendOptions({
    bccList: CFG.FAIL?.INTERNALS || [],
    desiredFrom: CFG.FAIL?.FROM_EMAIL || CFG.BRAND.FROM_EMAIL,
    name: CFG.FAIL?.FROM_NAME || CFG.BRAND.FROM_NAME,
    htmlBody: tpl.customerHtml
  });
  GmailApp.sendEmail(customerEmail, tpl.customerSubject, stripHtml(tpl.customerHtml), opts);
}

// 3) Separate internal copy (still from supporto@)
if (CFG.FAIL?.INTERNALS?.length) {
  const to = CFG.FAIL.INTERNALS[0];
  const bccRest = CFG.FAIL.INTERNALS.slice(1);
  const opts2 = getSafeSendOptions({
    bccList: bccRest,
    desiredFrom: CFG.FAIL?.FROM_EMAIL || CFG.BRAND.FROM_EMAIL,
    name: CFG.FAIL?.FROM_NAME || CFG.BRAND.FROM_NAME,
    htmlBody: tpl.internalHtml
  });
  GmailApp.sendEmail(to, tpl.internalSubject, stripHtml(tpl.internalHtml), opts2);
}

    ordersSheet_upsert(payload, { statusOverride: 'failed' });

    return { order_id: orderId, order_code: orderCode };
  }

  // â”€â”€ CONTACT_MESSAGE handler â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function handleContactMessage(payload) {
  const name    = (payload.name||'').trim();
  const email   = (payload.email||'').trim();
  const subject = (payload.subject||'Contatto dal sito').trim();
  const message = (payload.message||'').trim();
  const order   = (payload.order_code||'').trim();

  if (!name || !email || !message) {
    return { ok:false, error:'Missing name/email/message' };
  }

  const html = `
    <p><b>Nuovo messaggio dal modulo contatti</b></p>
    ${order ? `<p>Ordine: <b>${escapeHtml(order)}</b></p>` : ``}
    <p>Da: ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
    <hr/>
    <pre style="white-space:pre-wrap;font-family:Inter,system-ui">${escapeHtml(message)}</pre>
  `;

  // Uses your existing helpers
  const opts = getSafeSendOptions({
    desiredFrom: CFG.BRAND.FROM_EMAIL,
    name:        CFG.BRAND.FROM_NAME,
    replyTo:     email,
    htmlBody:    emailShell(html),
  });

  GmailApp.sendEmail('supporto@printora.it', `[Contatto] ${subject}`, stripHtml(html), opts);
  return { ok:true };
}

  /** â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   * Email helpers
   * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function resolveCustomerEmail({ payload, folderInfo, enrichedOrder }) {
    const p = payload || {};
    const pay = p.payment_details || {};
    const ship = p.shipping || {};
    const cust = p.customer || {};

    // 1) Prefer explicitly provided shipping email on the current payload
  const enr = enrichedOrder || {};
  let email =
    (ship.email && String(ship.email).trim()) ||
    (cust.email && String(cust.email).trim()) ||
    (pay.customer_email && String(pay.customer_email).trim()) ||
    (enr.customer && enr.customer.email && String(enr.customer.email).trim()) ||
    null;


    // 2) Fallback: the marker written at ORDER_CREATED
    if (!email && folderInfo && folderInfo.orderFolderId) {
      const marker = readJsonFile(folderInfo.orderFolderId, 'order.json');
      const m = marker && marker.order && marker.order.shipping && marker.order.shipping.email;
      if (m && String(m).trim()) email = String(m).trim();
    }

    // 3) Normalize empties
    if (email && !/@/.test(email)) email = null;
    return email;
  }

/** Ensure "anyone with link" can view (no discover). Requires Advanced Drive service. */
function ensureAnyoneReader(fileId) {
  const plist = Drive.Permissions.list(fileId, { supportsAllDrives: true });
  const hasAnyone = (plist.items || []).some(p => p.type === 'anyone' && p.role === 'reader');
  if (!hasAnyone) {
    Drive.Permissions.insert(
      { role: 'reader', type: 'anyone', withLink: true, allowFileDiscovery: false },
      fileId,
      { supportsAllDrives: true, sendNotificationEmails: false }
    );
  }
}

/** Ensure a specific user has view access (fallback if “anyone” is blocked by admin policy). */
function ensureUserReader(fileId, email) {
  if (!email) return;
  const plist = Drive.Permissions.list(fileId, { supportsAllDrives: true });
  const hasUser = (plist.items || []).some(p => p.type === 'user' && p.role === 'reader' && p.emailAddress === email);
  if (!hasUser) {
    Drive.Permissions.insert(
      { role: 'reader', type: 'user', emailAddress: email },
      fileId,
      { supportsAllDrives: true, sendNotificationEmails: false }
    );
  }
}

/**
 * Returns the link to show in the email button, honoring CFG.SHARE_WITH_CUSTOMERS.
 * - If true: returns the actual Shared Drive folder URL (view-only for the customer).
 * - If false: returns your internal proxy URL /files/:orderCode (no sharing change).
 */
function getCustomerFilesLink(orderCode, customerEmail) {
  // If you don’t want to expose Drive, use the internal page:
  if (!CFG.SHARE_WITH_CUSTOMER) {
    return `https://printora.it/files/${encodeURIComponent(orderCode)}`;
  }

  // Reuse/locate the canonical folder (builds under CFG.ROOT_FOLDER_ID if missing)
  const info = findOrderFolder(null, orderCode); // returns { orderFolderId, orderFolderLink, ... }
  const folderId = info.orderFolderId;
  const url = info.orderFolderLink || ('https://drive.google.com/drive/folders/' + folderId + '?usp=drive_link');

  // Best-effort: give the customer view access (uses your existing Drive v3 UrlFetch)
  try {
    if (customerEmail) addViewerPermission(folderId, customerEmail);
  } catch (e) {
    console.warn('addViewerPermission failed (non-fatal):', e && e.message || e);
  }

  return url;
}

function sendOrderReceivedEmail({ to, orderCode, shipping, amountCents, orderDate, orderItems }) {
  // Money formatting
  const totalText = Number.isFinite(amountCents) ? euro(amountCents / 100) : '';
  // Use &euro; + numeric part to avoid encoding issues in some clients
  const totalForHtml = totalText
    ? '&euro;&nbsp;' + escapeHtml(totalText.replace(/[^\d.,]/g, '')) // keep only 0-9 . , 
    : '—';

  // Dates & fields
const name = [shipping?.name || shipping?.first_name, shipping?.surname]
  .filter(Boolean).join(' ').trim() || '';
  const order_date = orderDate
    ? Utilities.formatDate(new Date(orderDate), 'Europe/Rome', 'dd/MM/yyyy')
    : Utilities.formatDate(new Date(), 'Europe/Rome', 'dd/MM/yyyy');

  const city = (shipping?.city || '').trim();
  const postcode = (shipping?.postcode || '').trim();
  const cityPost = (city && postcode) ? `${escapeHtml(city)}, ${escapeHtml(postcode)}`
                 : (city || postcode) ? escapeHtml(city || postcode)
                 : '';
  // right where you compute order_date, totalForHtml, cityPost, etc.
  const orderNotes = (shipping && typeof shipping.notes === 'string')
  ? shipping.notes.trim()
  : '';

  const customerEmail = shipping?.email || to;
  const filesUrl = getCustomerFilesLink(orderCode, customerEmail);
  console.log('[EMAIL] share=%s filesUrl=%s send=%s',
  CFG.SHARE_WITH_CUSTOMER, filesUrl, CFG.SEND_ORDER_RECEIVED_EMAIL);

  // Drive folder (view-only) link
  let driveFolderUrl = '';
  try {
    driveFolderUrl = getOrderDriveFolderUrl(orderCode);
  } catch (e) {
    // Fallback (won’t break the email if config missing)
    driveFolderUrl = `https://printora.it/files/${encodeURIComponent(orderCode)}`;
  }

  // Clean, emoji-free HTML; mobile-friendly; inline styles for Outlook/Gmail
const html = `
  <div style="font-family: Inter, Helvetica, Arial, sans-serif; color:#222; background:#f9f9f9; padding:30px 0;">
    <div style="max-width:600px; margin:auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
      <div style="background:#111827; color:#fff; padding:20px 30px;">
        <h2 style="margin:0; font-size:20px; font-weight:700;">Conferma Ordine</h2>
        <p style="margin:4px 0 0;">${escapeHtml(CFG.BRAND.NAME)}</p>
      </div>

      <div style="padding:30px;">
        <p style="font-size:15px;">Ciao <b>${escapeHtml(name)}</b>,</p>
        <p style="font-size:15px;">Abbiamo ricevuto il tuo ordine <b>${escapeHtml(orderCode)}</b> in data ${escapeHtml(order_date)}, per un totale di <b>${totalForHtml}</b>.</p>

        <p style="margin-top:20px; font-size:15px;">
          Il file è attualmente in fase di verifica e preparazione per la stampa da parte del nostro reparto tecnico.
        </p>

        <div style="background:#f3f4f6; border-radius:8px; padding:15px 20px; margin:20px 0;">
          <h3 style="margin:0 0 8px; font-size:16px;">File Grafici</h3>
          <p style="margin:0; font-size:14px;">Puoi visualizzare o caricare i tuoi file per la stampa cliccando sul pulsante qui sotto:</p>
          <p style="margin:10px 0 0;">
            <a href="${filesUrl}" target="_blank"
              style="display:inline-block; background:#111827; color:#fff; text-decoration:none; padding:10px 18px; border-radius:6px; font-weight:600;">
              Accedi ai tuoi file
            </a>
          </p>
        </div>

        <p style="font-size:15px;">Tempi medi di produzione: <b>24–48 ore lavorative</b></p>

        <p style="font-size:15px;">Al termine della lavorazione, ti invieremo il tracking della spedizione non appena il tuo ordine sarà affidato al corriere.</p>

        <div style="background:#f3f4f6; border-radius:8px; padding:15px 20px; margin:25px 0;">
          <h3 style="margin:0 0 8px; font-size:16px;">Nota Importante</h3>
          <p style="margin:0; font-size:14px; line-height:1.5;">
            Riceverai anche una copia della fattura direttamente dall’indirizzo
            <b>isladistribuzione@gmail.com</b> — ti consigliamo di aggiungerlo ai tuoi contatti per evitare che finisca nella posta indesiderata.
          </p>
        </div>

<h3 style="margin-top:30px; font-size:17px;">Dettagli dell’Ordine</h3>
<table role="presentation" cellpadding="0" cellspacing="0" border="0"
       style="width:100%; border-collapse:collapse; font-size:14px; margin-bottom:20px; mso-table-lspace:0pt; mso-table-rspace:0pt;">
  <colgroup>
    <col style="width:180px;">
    <col>
  </colgroup>
  <tr>
    <td style="padding:6px 12px 6px 0; font-weight:600; vertical-align:top; white-space:nowrap;">Numero ordine:</td>
    <td style="padding:6px 0; vertical-align:top;">${escapeHtml(orderCode)}</td>
  </tr>
  <tr>
    <td style="padding:6px 12px 6px 0; font-weight:600; vertical-align:top; white-space:nowrap;">Data ordine:</td>
    <td style="padding:6px 0; vertical-align:top;">${escapeHtml(order_date)}</td>
  </tr>
  <tr>
    <td style="padding:6px 12px 6px 0; font-weight:600; vertical-align:top; white-space:nowrap;">Totale:</td>
    <td style="padding:6px 0; vertical-align:top;">${totalForHtml}</td>
  </tr>
</table>

        ${Array.isArray(orderItems) && orderItems.length ? `
        <h4 style="margin:15px 0 5px;">Prodotti Acquistati</h4>
        <table style="width:100%; border-collapse:collapse; font-size:14px;">
          <thead>
            <tr style="background:#f3f4f6;">
              <th align="left" style="padding:6px;">Prodotto</th>
              <th align="center" style="padding:6px;">Quantità</th>
            </tr>
          </thead>
          <tbody>
            ${orderItems.map(it => `
              <tr>
                <td style="padding:6px;">${escapeHtml(it.name)}</td>
                <td align="center" style="padding:6px;">${escapeHtml(it.quantity)}</td>
              </tr>`).join('')}
          </tbody>
        </table>
        ` : ''}

<h4 style="margin-top:25px;">Indirizzo di Spedizione</h4>
<table role="presentation" cellpadding="0" cellspacing="0" border="0"
       style="width:100%; border-collapse:collapse; font-size:14px; mso-table-lspace:0pt; mso-table-rspace:0pt;">
  <colgroup>
    <col style="width:180px;">
    <col>
  </colgroup>

  <tr>
    <td style="padding:6px 12px 6px 0; font-weight:600; vertical-align:top; white-space:nowrap;">Nome e Cognome:</td>
    <td style="padding:6px 0; vertical-align:top;">
  ${escapeHtml([shipping?.name || shipping?.first_name, shipping?.surname].filter(Boolean).join(' ').trim())}</td>
  </tr>

  ${shipping?.company ? `
  <tr>
    <td style="padding:6px 12px 6px 0; font-weight:600; vertical-align:top; white-space:nowrap;">Azienda:</td>
    <td style="padding:6px 0; vertical-align:top;">${escapeHtml(shipping.company)}</td>
  </tr>` : ''}

  ${shipping?.address ? `
  <tr>
    <td style="padding:6px 12px 6px 0; font-weight:600; vertical-align:top; white-space:nowrap;">Indirizzo:</td>
    <td style="padding:6px 0; vertical-align:top;">${escapeHtml(shipping.address)}</td>
  </tr>` : ''}

  ${(cityPost) ? `
  <tr>
    <td style="padding:6px 12px 6px 0; font-weight:600; vertical-align:top; white-space:nowrap;">Città:</td>
    <td style="padding:6px 0; vertical-align:top;">${cityPost}</td>
  </tr>` : ''}

  ${shipping?.country ? `
  <tr>
    <td style="padding:6px 12px 6px 0; font-weight:600; vertical-align:top; white-space:nowrap;">Paese:</td>
    <td style="padding:6px 0; vertical-align:top;">${escapeHtml(shipping.country)}</td>
  </tr>` : ''}

  ${shipping?.phone ? `
  <tr>
    <td style="padding:6px 12px 6px 0; font-weight:600; vertical-align:top; white-space:nowrap;">Telefono:</td>
    <td style="padding:6px 0; vertical-align:top;">${escapeHtml(shipping.phone)}</td>
  </tr>` : ''}

  ${orderNotes ? `
  <tr>
    <td style="padding:6px 12px 6px 0; font-weight:600; vertical-align:top; white-space:nowrap;">
      Note dell'ordine:
    </td>
    <td style="padding:6px 0; vertical-align:top;">
      <div style="white-space:pre-wrap;">${escapeHtml(orderNotes)}</div>
    </td>
  </tr>
  ` : ''}
</table>

        <div style="margin-top:25px; padding:15px; background:#f3f4f6; border-radius:8px;">
          <p style="margin:0; font-size:14px;">
            Per qualsiasi informazione o urgenza, contattaci direttamente su WhatsApp:<br>
            <b><a href="https://wa.me/393792775116" style="color:#111827; text-decoration:none;">+39 379 2775116</a></b><br>
            Siamo sempre disponibili per aggiornamenti o assistenza.
          </p>
        </div>

        <p style="margin-top:25px; font-size:15px;">
          Grazie per aver scelto <b>Printora</b>, il tuo partner per la stampa digitale professionale.
        </p>

        <p style="font-size:14px; color:#555;">
          Un cordiale saluto dal team,<br><br>
          <b>Printora</b><br>
          <a href="mailto:ordini@printora.it" style="color:#111827; text-decoration:none;">ordini@printora.it</a><br>
          <a href="https://printora.it" style="color:#111827; text-decoration:none;">www.printora.it</a>
        </p>
      </div>
    </div>
  </div>`;


  const opts = getSafeSendOptions({
    bccList: CFG.INTERNAL_EMAILS,
    desiredFrom: CFG.BRAND.FROM_EMAIL,
    name: CFG.BRAND.FROM_NAME,
    htmlBody: html
  });

  GmailApp.sendEmail(
    to,
    `[${CFG.BRAND.NAME}] Conferma ordine — ${orderCode}`,
    stripHtml(html),
    opts
  );
}

  function sendInvoiceEmail({ to, orderCode, pdfBlob, invoiceFileName, totalCents }) {
    const totalText = Number.isFinite(totalCents) ? euro(totalCents / 100) : '';
    const html = `
      <p>Ciao,</p>
      <p>In allegato trovi la fattura per lâ€™ordine <b>${escapeHtml(orderCode)}</b> ${totalText ? `(totale: ${totalText})` : ''}.</p>
      <p>Grazie per aver scelto ${escapeHtml(CFG.BRAND.NAME)}!</p>
    `;
    pdfBlob.setName(invoiceFileName || `Invoice_${orderCode}.pdf`);

    const opts = getSafeSendOptions({
      bccList: CFG.BCC_INVOICE_TO_INTERNALS ? CFG.INTERNAL_EMAILS : [],
      desiredFrom: CFG.BRAND.FROM_EMAIL, // used only if it's a valid alias
      replyTo:   CFG.BRAND.FROM_EMAIL,
      name:      CFG.BRAND.FROM_NAME,
      htmlBody:  emailShell(html),
      attachments: [pdfBlob]
    });

    GmailApp.sendEmail(to, `[${CFG.BRAND.NAME}] Fattura â€” ${orderCode}`, stripHtml(html), opts);
  }

  function bccInternal(subject, text) {
    if (!CFG.INTERNAL_EMAILS.length) return;
    const to = CFG.INTERNAL_EMAILS[0];
    const bccRest = CFG.INTERNAL_EMAILS.slice(1);
    const opts = getSafeSendOptions({
      bccList: bccRest,
      desiredFrom: CFG.BRAND.FROM_EMAIL,
      name: CFG.BRAND.FROM_NAME
    });
    GmailApp.sendEmail(to, subject, text || '', opts);
  }

  function emailShell(innerHtml) {
    return `
    <div style="font-family:Inter,Helvetica,Arial,sans-serif;padding:16px">
      <div style="font-size:18px;font-weight:700;margin-bottom:8px">${escapeHtml(CFG.BRAND.NAME)}</div>
      <div style="font-size:14px;line-height:1.5">${innerHtml}</div>
      <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
      <div style="color:#666;font-size:12px">
        ${escapeHtml(CFG.BRAND.ADDR1)} ${escapeHtml(CFG.BRAND.ADDR2)}
      </div>
    </div>`;
  }

  function getSafeSendOptions({ bccList = [], desiredFrom, replyTo, name, htmlBody, attachments } = {}) {
    const options = {};
    if (name) options.name = name;

    const bcc = (bccList || []).filter(Boolean).join(',');
    if (bcc) options.bcc = bcc;

    if (replyTo) options.replyTo = replyTo;

    if (desiredFrom) {
      try {
        const aliases = GmailApp.getAliases() || [];
        if (aliases.includes(desiredFrom)) {
          options.from = desiredFrom;
        }
      } catch (e) { /* ignore */ }
    }

    if (htmlBody) options.htmlBody = htmlBody;
    if (attachments && attachments.length) options.attachments = attachments;

    return options;
  }

  /** â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   * Invoice builder (idempotent, HTML â†’ PDF)  âœ… Self-contained block
   * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

  function brandLogoTag() {
    // Prefer an inline data URL from Drive (works reliably in PDF)
    if (CFG.BRAND.LOGO_FILE_ID) {
      try {
        const file = DriveApp.getFileById(CFG.BRAND.LOGO_FILE_ID);
        const blob = file.getBlob();
        const mime = blob.getContentType();
        const b64  = Utilities.base64Encode(blob.getBytes());
        return `<img src="data:${mime};base64,${b64}" alt="${escapeHtml(CFG.BRAND.NAME)}" style="height:48px;display:block"/>`;
      } catch (e) { /* fall through */ }
    }
    if (CFG.BRAND.LOGO_URL) {
      return `<img src="${CFG.BRAND.LOGO_URL}" alt="${escapeHtml(CFG.BRAND.NAME)}" style="height:48px;display:block"/>`;
    }
    // Fallback: wordmark
    return `<div style="font-size:22px;font-weight:800;letter-spacing:0.2px">${escapeHtml(CFG.BRAND.NAME)}</div>`;
  }


  /* Robust money parser: "â‚¬ 1.234,56", "68,50", 68.5, 9321 -> euros */
  function parseMoneyLike(v) {
    if (v == null || v === '') return 0;
    if (typeof v === 'number') return v;

    let s = String(v).trim();
    // keep digits, separators, minus
    s = s.replace(/[^0-9,.\-]/g, '');

    if (s.includes(',') && s.includes('.')) {
      // If last sep is comma, assume EU style "1.234,56" â†’ "1234.56"
      if (s.lastIndexOf(',') > s.lastIndexOf('.')) {
        s = s.replace(/\./g, '').replace(',', '.');
      } else {
        // "1,234.56" â†’ "1234.56"
        s = s.replace(/,/g, '');
      }
    } else if (s.includes(',')) {
      s = s.replace(',', '.');
    }

    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
  }

  /* Flexible item mapper â†’ [{ name, quantity, unit_amount(euros) }] */
  function mapItems(itemsArr) {
    if (!Array.isArray(itemsArr)) return [];

    return itemsArr.map((raw) => {
      const name =
        raw.name || raw.title || raw.productName || raw.description || 'Articolo';

      const quantity = parseMoneyLike(raw.quantity ?? raw.qty ?? 1) || 1;

      // Try common unit price fields (in euros)
      let unit =
        (raw.unit_amount && (raw.unit_amount.value ?? raw.unit_amount)) ??
        raw.unitPrice ??
        raw.unit_price ??
        raw.price_per_unit ??
        raw.price ?? 0;

      unit = parseMoneyLike(unit);

      // If value looks like cents (e.g., 9321) and is integer â‰¥ 1000, convert to euros
      if (unit >= 1000 && Number.isInteger(unit)) {
        unit = unit / 100;
      }

      // Derive from Stripe amount_total (cents) if unit missing
      if ((!unit || unit === 0) && (raw.amount_total != null)) {
        const amt = parseMoneyLike(raw.amount_total);
        if (amt >= 1000 && Number.isInteger(amt)) unit = (amt / 100) / (quantity || 1);
        else if (amt > 0) unit = amt / (quantity || 1);
      }

      return { name, quantity, unit_amount: unit || 0 };
    });
  }

  /* Simple HTML escaper for safe output */
  function htmlEscape(s) {
    return String(s || '').replace(/[&<>"']/g, function(m) {
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m];
    });
  }


  // SDI-safe text sanitizer: convert “smart” punctuation to ASCII and strip disallowed chars
function sdiSanitizeText(input) {
  let s = String(input || '');

  // Normalize accents and strip combining marks
  s = s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');

  // Common typography → ASCII
  s = s
    .replace(/[–—-]/g, '-')        // dashes → hyphen
    .replace(/[×✕✖]/g, 'x')       // multiply signs → x
    .replace(/[“”«»„]/g, '"')      // smart quotes → "
    .replace(/[‘’‚‹›]/g, "'")      // smart apostrophes → '
    .replace(/…/g, '...')          // ellipsis
    .replace(/[©®™]/g, '');        // symbols → remove

  // Remove emojis / non-printables / exotic bytes (keep basic Latin + Latin-1)
  s = s.replace(/[^\x09\x0A\x0D\x20-\x7EÀ-ÿ°]/g, '');

  // Collapse whitespace
  s = s.replace(/\s+/g, ' ').trim();

  // Be conservative on length for descriptions
  if (s.length > 1000) s = s.slice(0, 1000);
  return s;
}


  /**
   * Compute canonical invoice math (all values in cents).
   * Prefers Stripe checkout values when available; otherwise computes from items.
   * Requires: mapItems(), euro(), CFG.BRAND.VAT_RATE
   */
  function computeInvoiceBreakdown(payload) {
    const p   = payload || {};
    const pay = p.payment_details || p.payment_summary || {};

    // 1) Items (prefer Stripe line_items)
  // Prefer app items (include variants); fallback to Stripe
  const hasAppItems = Array.isArray(p.items) && p.items.length;
  const items = hasAppItems ? mapItems(p.items) : mapItems(pay.line_items);

    // subtotal from items in euros â†’ cents
    const subtotalEuros = items.reduce(
      (a, it) => a + (Number(it.quantity || 1) * Number(it.unit_amount || 0)),
      0
    );
    const subtotalCents = Math.round(subtotalEuros * 100);

  // Shipping (euros -> cents) â€” trust app value first
  let shippingCents = 0;
  if (p.shipping_total != null) {
    shippingCents = Math.round(Number(p.shipping_total) * 100);
  } else if (pay.total_details && typeof pay.total_details.amount_shipping === 'number') {
    shippingCents = Number(pay.total_details.amount_shipping);
  }

  // Discount â€” trust app value first
  let discountCents = 0;
  if (p.discount_total != null) {
    discountCents = Math.round(Number(p.discount_total) * 100);
  } else if (pay.total_details && typeof pay.total_details.amount_discount === 'number') {
    discountCents = Number(pay.total_details.amount_discount);
  }

  // Imponibile
  const imponibileCents = Math.max(0, subtotalCents + shippingCents - discountCents);

  // VAT â€” prefer appâ€™s exact cents, then Stripe, else compute from rate
  const vatRate = Number.isFinite(p.tax_rate) ? Number(p.tax_rate)
              : (Number.isFinite(CFG.BRAND.VAT_RATE) ? Number(CFG.BRAND.VAT_RATE) : 22);
  let vatCents = 0;
  if (Number.isInteger(p.tax_cents)) {
    vatCents = Number(p.tax_cents);
  } else if (pay.total_details && typeof pay.total_details.amount_tax === 'number') {
    vatCents = Number(pay.total_details.amount_tax);
  } else {
    vatCents = Math.round(imponibileCents * (vatRate / 100));
  }

    // 5) Total (prefer Stripe, sanity-check vs computed)
    const computedTotal = imponibileCents + vatCents;
    let totalCents = computedTotal;
    if (typeof pay.amount_total === 'number') {
      const totalFromStripe = Number(pay.amount_total);
      // If Stripe differs by > â‚¬0.50, trust computed to keep table/summary consistent
      totalCents = (Math.abs(totalFromStripe - computedTotal) > 50) ? computedTotal : totalFromStripe;
    }

    // If frontend/Supabase provided a definitive total, prefer it
  if (typeof p.amount_total_cents === 'number' && p.amount_total_cents > 0) {
    totalCents = Number(p.amount_total_cents);
  }

    return {
      items,
      breakdown: {
        currency: (p.currency || 'EUR').toUpperCase(),
        subtotalCents,
        shippingCents,
        discountCents,
        imponibileCents,
        vatRate,
        vatCents,
        totalCents
      }
    };
  }

  /**
   * Build the invoice PDF from HTML (idempotent).
   * Uses: htmlEscape(), euro(), writeJsonFile(), findExistingInvoicePdf()
   */
  function buildInvoiceOnce({ orderId, orderCode, orderFolderId, invoicesFolderId, payload }) {
    const forceBuild = !!payload.force_build;

    // Reuse existing PDF unless forced
    const existing = findExistingInvoicePdf(invoicesFolderId);
    if (existing && !forceBuild) {
      return {
        fileId: existing.id,
        fileUrl: 'https://drive.google.com/open?id=' + existing.id,
        fileName: existing.name,
        totals: readJsonFile(orderFolderId, 'invoice.json')?.totals || null,
        pdfBlob: DriveApp.getFileById(existing.id).getBlob()
      };
    }

    // ---- Contacts (shipping/customer fallbacks) ----
    const p = payload || {};
    const customer = p.customer || {};
    const ship     = p.shipping || {};
    const contact = {
      name:
        (ship.name && String(ship.name).trim()) ||
        [ship.name, ship.surname].filter(Boolean).join(' ').trim() ||
        [customer.first_name, customer.last_name].filter(Boolean).join(' ').trim() || '',
      company: ship.company || ship.organization || '',
      email:
        (ship.email && String(ship.email).trim()) ||
        (customer.email && String(customer.email).trim()) ||
        (p.payment_details && p.payment_details.customer_email && String(p.payment_details.customer_email).trim()) || '',
      address:  ship.address || ship.address1 || ship.address_line1 || '',
      city:     ship.city || ship.town || '',
      province: ship.province || ship.state || ship.region || '',
      zip:      ship.zip || ship.postcode || ship.postal_code || '',
      country:  ship.country || ship.country_code || ''
    };

    // ---- Money breakdown (canonical) ----
    const { items, breakdown } = computeInvoiceBreakdown(payload);

    // ---- HTML â†’ PDF rendering ----
    const today   = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'Europe/Rome', 'dd/MM/yyyy');
    const euroFmt = (cents) => euro((Number(cents || 0)) / 100);

    const rowsForTable = items.length ? items : [{ name: 'Articolo', quantity: 1, unit_amount: 0 }];

    // Inline logo helper (self-contained)
    function logoTag() {
      const fileId = (CFG.BRAND && CFG.BRAND.LOGO_FILE_ID) || '';
      const url    = (CFG.BRAND && CFG.BRAND.LOGO_URL) || '';
      if (fileId) {
        try {
          const blob = DriveApp.getFileById(fileId).getBlob();
          const mime = blob.getContentType();
          const b64  = Utilities.base64Encode(blob.getBytes());
          return `<img src="data:${mime};base64,${b64}" alt="${escapeHtml(CFG.BRAND.NAME)}" style="height:48px;display:block"/>`;
        } catch (e) { /* fall through to URL/wordmark */ }
      }
      if (url) {
        return `<img src="${url}" alt="${escapeHtml(CFG.BRAND.NAME)}" style="height:48px;display:block"/>`;
      }
      return `<div style="font-size:22px;font-weight:800;letter-spacing:0.2px">${htmlEscape(CFG.BRAND.NAME)}</div>`;
    }

    const brandAddressLine = [CFG.BRAND.ADDR1, CFG.BRAND.ADDR2].filter(Boolean).map(htmlEscape).join(' ');
    const cityProvCap = [
      contact.city ? `${contact.city}${contact.province ? ` (${contact.province})` : ''}` : '',
      contact.zip || ''
    ].filter(Boolean).join(' ');
    const accent = htmlEscape((CFG.BRAND && CFG.BRAND.ACCENT) || '#111827');
    const website = (CFG.BRAND && CFG.BRAND.WEBSITE) ? htmlEscape(CFG.BRAND.WEBSITE) : '';
    const vatId   = (CFG.BRAND && CFG.BRAND.VAT_ID) ? htmlEscape(CFG.BRAND.VAT_ID) : '';

    const html = `
  <!doctype html>
  <html>
  <head>
  <meta charset="utf-8">
  <title>Invoice ${htmlEscape(orderCode)}</title>
  <style>
    :root {
      --accent: ${accent};
      --text: #0f172a;
      --muted: #64748b;
      --line: #e5e7eb;
      --bg-card: #fafafa;
    }
    * { box-sizing: border-box; }
    body {
      font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
      color: var(--text);
      margin: 0; padding: 28px 32px;
      font-size: 13.5px;
    }
    .header { display:flex; justify-content:space-between; align-items:flex-start; gap:16px; margin-bottom:20px; }
    .brand-block { display:flex; gap:14px; align-items:center; }
    .brand-meta { color: var(--muted); font-size:12px; line-height:1.4; }
    .doc { text-align:right; }
    .doc .title { color: var(--accent); font-weight:800; font-size:20px; letter-spacing:0.2px; }
    .doc .meta { color: var(--muted); font-size:12.5px; line-height:1.5; }

    .card {
      border:1px solid var(--line); border-radius:12px; padding:12px 14px; margin: 14px 0 18px;
      background:#fff;
    }
    table { width:100%; border-collapse: collapse; }
    th, td { padding:10px 8px; vertical-align: top; }
    th { text-align:left; border-bottom:1px solid var(--line); font-size:12.5px; color:var(--muted); }
    tbody tr { border-bottom:1px solid var(--line); }
    tbody tr:nth-child(odd) { background: var(--bg-card); }
    .num { text-align:right; font-variant-numeric: tabular-nums; }
    .qty { text-align:center; }

    .totals {
      max-width: 440px; margin-left:auto; background:#fff;
      border:1px solid var(--line); border-radius:12px; padding:8px 12px;
    }
    .totals .row { display:flex; justify-content:space-between; padding:8px 0; }
    .totals .row + .row { border-top:1px dashed var(--line); }
    .totals .label { color:var(--muted); }
    .totals .strong .label, .totals .strong .val { font-weight:700; color:var(--text); }
    .totals .grand { font-size:15px; font-weight:800; color:var(--accent); }

    .footnote { color:var(--muted); font-size:11.5px; margin-top:14px; }
    .mt-6 { margin-top: 18px; }
  </style>
  </head>
  <body>

    <div class="header">
      <div class="brand-block">
        ${logoTag()}
        <div class="brand-meta">
          ${htmlEscape(CFG.BRAND.NAME)}<br/>
          ${brandAddressLine || ''}${website ? `<br/>${website}` : ''}${vatId ? `<br/>P.IVA ${vatId}` : ''}
        </div>
      </div>
      <div class="doc">
        <div class="title">Fattura</div>
        <div class="meta">
          Data: ${htmlEscape(today)}<br/>
          Ordine: ${htmlEscape(orderCode)}
        </div>
      </div>
    </div>

    <div class="card">
      <table>
        <tbody>
          <tr><td style="width:160px"><strong>Destinatario</strong></td><td></td></tr>
          <tr><td>Nome</td><td>${htmlEscape(contact.name)}</td></tr>
          ${contact.company ? `<tr><td>Azienda</td><td>${htmlEscape(contact.company)}</td></tr>` : ``}
          ${contact.email ? `<tr><td>Email</td><td>${htmlEscape(contact.email)}</td></tr>` : ``}
          ${contact.address ? `<tr><td>Indirizzo</td><td>${htmlEscape(contact.address)}</td></tr>` : ``}
          <tr><td>CittÃ /Prov/CAP</td><td>${htmlEscape(cityProvCap)}</td></tr>
          ${contact.country ? `<tr><td>Paese</td><td>${htmlEscape(contact.country)}</td></tr>` : ``}
        </tbody>
      </table>
    </div>

    <div class="card">
      <table>
        <thead>
          <tr>
            <th>Descrizione</th>
            <th class="qty" style="width:82px">Q.tÃ </th>
            <th class="num" style="width:120px">Prezzo</th>
            <th class="num" style="width:120px">Totale</th>
          </tr>
        </thead>
        <tbody>
          ${rowsForTable.map(li => `
            <tr>
              <td><strong>${htmlEscape(li.name)}</strong></td>
              <td class="qty">${Number(li.quantity||1)}</td>
              <td class="num">${euro(Number(li.unit_amount||0))}</td>
              <td class="num">${euro(Number(li.unit_amount||0) * Number(li.quantity||1))}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="totals">
      <div class="row"><div class="label">Subtotale prodotti</div><div class="val">${euroFmt(breakdown.subtotalCents)}</div></div>
      <div class="row"><div class="label">Spedizione</div><div class="val">${euroFmt(breakdown.shippingCents)}</div></div>
      ${breakdown.discountCents ? `<div class="row"><div class="label">Sconto</div><div class="val">âˆ’ ${euroFmt(breakdown.discountCents)}</div></div>` : ``}
      <div class="row strong"><div class="label">Imponibile</div><div class="val">${euroFmt(breakdown.imponibileCents)}</div></div>
      <div class="row"><div class="label">IVA (${breakdown.vatRate}%)</div><div class="val">${euroFmt(breakdown.vatCents)}</div></div>
      <div class="row strong grand"><div class="label">Totale</div><div class="val">${euroFmt(breakdown.totalCents)}</div></div>
    </div>

    <div class="footnote mt-6">
      Grazie per aver scelto ${htmlEscape(CFG.BRAND.NAME)}.
    </div>
  </body>
  </html>`.trim();

    // HTML â†’ PDF
    const pdfBlob = HtmlService.createHtmlOutput(html)
      .getBlob().setName(`Invoice_${orderCode}.html`)
      .getAs('application/pdf')
      .setName(`Invoice_${orderCode}.pdf`);
    const pdfFile = DriveApp.getFolderById(invoicesFolderId).createFile(pdfBlob);

    // Persist full breakdown (useful for audits & email body)
    writeJsonFile(folderById(orderFolderId), 'invoice.json', {
      event: 'PAYMENT_SUCCEEDED',
      createdAt: new Date().toISOString(),
      orderId, orderCode,
      totals: breakdown
    }, true);

    // Optional: debugging snapshot
    writeJsonFile(folderById(orderFolderId), 'debug_breakdown.json', {
      at: new Date().toISOString(),
      items,
      breakdown,
      rawKeys: Object.keys(payload || {})
    }, true);

    return {
      fileId: pdfFile.getId(),
      fileUrl: 'https://drive.google.com/open?id=' + pdfFile.getId(),
      fileName: pdfFile.getName(),
      totals: breakdown,
      pdfBlob: pdfFile.getBlob()
    };
  }

  /** â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   * Foldering + Drive helpers
   * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function ensureOrderFolders({ orderId, orderCode, shipping, planned, createdAt }) {
    const rootId = CFG.ROOT_FOLDER_ID;
    const d = createdAt ? new Date(createdAt) : new Date();
    const year = String(d.getFullYear());
    const month = String(d.getMonth() + 1).padStart(2, '0');
    let leafName = planned && planned.trim() ? planned.split('/').pop() : buildOrderLeaf(orderCode, shipping);

    const yearId = ensureFolder(rootId, year);           Utilities.sleep(50);
    const monthId = ensureFolder(yearId, month);         Utilities.sleep(50);
    const orderFolderId = ensureFolder(monthId, leafName); Utilities.sleep(50);
    const clientId = ensureFolder(orderFolderId, 'client-uploads'); Utilities.sleep(50);
    const editorId = ensureFolder(orderFolderId, 'editor-files');    Utilities.sleep(50);
    const invoicesId = ensureFolder(orderFolderId, 'invoices');

    const link = getWebViewLink(orderFolderId);
    return { rootId, yearId, monthId, orderFolderId, orderFolderLink: link, clientUploadsId: clientId, editorFilesId: editorId, invoicesFolderId: invoicesId };
  }

  function findOrderFolder(orderId, orderCode) {
    const mapped = getOrderFolderMapping(orderId, orderCode);
    if (mapped) {
      const orderFolderId = mapped;
      return {
        orderFolderId,
        orderFolderLink: getWebViewLink(orderFolderId),
        ...ensureOrderSubfolders(orderFolderId)
      };
    }

    if (orderCode) {
      const q = `name contains '${orderCode}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
      const candidates = driveList(q, 'files(id,name,parents,webViewLink)', 25).files || [];
      for (const f of candidates) {
        const jq = `'${f.id}' in parents and name = 'order.json' and trashed = false`;
        const marker = driveList(jq, 'files(id,name)', 2).files || [];
        if (marker.length) {
          const data = readJsonFile(f.id, 'order.json');
          const same = data && ((data.order && (String(data.order.id) === String(orderId) || data.order.code === orderCode)) || data.folder);
          if (same) {
            setOrderFolderMapping(orderId, orderCode, f.id);
            return {
              orderFolderId: f.id,
              orderFolderLink: f.webViewLink || getWebViewLink(f.id),
              ...ensureOrderSubfolders(f.id)
            };
          }
        }
      }
    }

    const created = ensureOrderFolders({ orderId, orderCode, shipping: {}, planned: null, createdAt: new Date().toISOString() });
    setOrderFolderMapping(orderId, orderCode, created.orderFolderId);
    return created;
  }

  function ensureOrderSubfolders(orderFolderId) {
    const clientUploadsId = ensureFolder(orderFolderId, 'client-uploads');
    const editorFilesId   = ensureFolder(orderFolderId, 'editor-files');
    const invoicesFolderId= ensureFolder(orderFolderId, 'invoices');
    return { clientUploadsId, editorFilesId, invoicesFolderId };
  }

  function buildOrderLeaf(orderCode, shipping) {
    const parts = [];
    if (shipping?.surname || shipping?.company) parts.push(shipping.surname || shipping.company);
    if (shipping?.city) parts.push(shipping.city);
    const suffix = slug(parts.join('-'));
    return suffix ? `${orderCode}-${suffix}` : orderCode;
  }

  function movePrintFilesToOrder(printFilesRaw, folderInfo) {
    const dedup = new Map(); // fileId -> kind
    (printFilesRaw || []).forEach(p => {
      const id = (p && (p.driveFileId || p.id)) || null;
      if (!id) return;
      const kind = String(p.kind || '').toLowerCase();
      if (!dedup.has(id)) dedup.set(id, kind);
    });

    let ok = 0, fail = 0;
    dedup.forEach((kind, fileId) => {
      try {
        const dest = (kind === 'editor-file') ? folderInfo.editorFilesId : folderInfo.clientUploadsId;
        moveFileToFolder(fileId, dest);
        ok++;
      } catch (e) {
        console.error('move failed', fileId, e);
        fail++;
      }
    });

    return { total: ok, failed: fail };
  }

  /** â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   * Drive v3 primitives via UrlFetch + OAuth (shared-drive safe)
   * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function oauthHeaders() {
    return { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() };
  }

  function driveGet(fileId, fields) {
    const url = `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}`
      + `?fields=${encodeURIComponent(fields)}&supportsAllDrives=true`;
    const res = driveFetch_(url, { method: 'get', headers: oauthHeaders(), muteHttpExceptions: true });
    return JSON.parse(res.getContentText());
  }

  function getWebViewLink(fileId) {
    const r = driveGet(fileId, 'id,webViewLink');
    return r.webViewLink || ('https://drive.google.com/open?id=' + fileId);
  }

  function driveCreateFolder(name, parentId) {
    const url = `https://www.googleapis.com/drive/v3/files?supportsAllDrives=true`;
    const payload = {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: parentId ? [parentId] : []
    };
    const res = driveFetch_(url, {
      method: 'post',
      headers: { 'Content-Type': 'application/json', ...oauthHeaders() },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    return JSON.parse(res.getContentText()).id;
  }

  function driveList(q, fields, pageSize) {
    const url = `https://www.googleapis.com/drive/v3/files`
      + `?q=${encodeURIComponent(q)}`
      + `&fields=${encodeURIComponent(fields || 'files(id,name)')}`
      + `&supportsAllDrives=true&includeItemsFromAllDrives=true&spaces=drive&pageSize=${pageSize || 100}`;
    const res = driveFetch_(url, { method: 'get', headers: oauthHeaders(), muteHttpExceptions: true });
    return JSON.parse(res.getContentText());
  }

  function ensureFolder(parentId, name) {
    const key = `${parentId}::${name}`;
    if (CACHE.folderByKey.has(key)) return CACHE.folderByKey.get(key);

    const q = `'${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder'`
            + ` and name = '${name.replace(/'/g, "\\'")}' and trashed = false`;
    const found = driveList(q, 'files(id,name)', 2);
    if (found.files && found.files.length) {
      const id = found.files[0].id;
      CACHE.folderByKey.set(key, id);
      return id;
    }

    const id = driveCreateFolder(name, parentId);
    CACHE.folderByKey.set(key, id);
    return id;
  }

  function moveFileToFolder(fileId, destFolderId) {
    const meta = driveGet(fileId, 'id,parents');
    const removeParents = (meta.parents || []).join(',');
    let url = `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}`
            + `?supportsAllDrives=true&addParents=${encodeURIComponent(destFolderId)}`
            + (removeParents ? `&removeParents=${encodeURIComponent(removeParents)}` : '');
    let res, code;
    try {
      res = driveFetch_(url, { method: 'patch', headers: oauthHeaders(), muteHttpExceptions: true }, 4);
      code = res.getResponseCode();
      if (code < 300) return;
    } catch (_) {}
    url = `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}`
        + `?supportsAllDrives=true&addParents=${encodeURIComponent(destFolderId)}`;
    res = driveFetch_(url, { method: 'patch', headers: oauthHeaders(), muteHttpExceptions: true }, 4);
    if (res.getResponseCode() >= 300) {
      throw new Error(`moveFileToFolder failed: ${res.getResponseCode()} ${res.getContentText()}`);
    }
  }

  function findExistingInvoicePdf(invoicesFolderId) {
    const q = `'${invoicesFolderId}' in parents and mimeType = 'application/pdf' and name contains 'Invoice_' and trashed = false`;
    const found = driveList(q, 'files(id,name)', 5);
    if (found.files && found.files.length) return found.files[0];
    return null;
  }

  function addViewerPermission(fileOrFolderId, email) {
    const url = `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileOrFolderId)}/permissions?supportsAllDrives=true&sendNotificationEmail=false`;
    const payload = { role: 'reader', type: 'user', emailAddress: email };
    UrlFetchApp.fetch(url, {
      method: 'post',
      headers: Object.assign({ 'Content-Type': 'application/json' }, oauthHeaders()),
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
  }

  /** â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   * Supabase fetch (optional enrichment)
   * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function supaGetOrder(orderId) {
    if (!CFG.SUPABASE_URL || !CFG.SUPABASE_KEY) return null;
    const url = `${CFG.SUPABASE_URL}/rest/v1/orders?id=eq.${encodeURIComponent(orderId)}&select=*`;
    const res = UrlFetchApp.fetch(url, {
      method: 'get',
      headers: {
        'apikey': CFG.SUPABASE_KEY,
        'Authorization': 'Bearer ' + CFG.SUPABASE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      muteHttpExceptions: true
    });
    if (res.getResponseCode() >= 300) throw new Error(`supaGetOrder ${res.getResponseCode()}: ${res.getContentText()}`);
    const arr = JSON.parse(res.getContentText());
    return Array.isArray(arr) && arr.length ? arr[0] : null;
  }

  /** â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   * Marker files (order.json / invoice.json)
   * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function writeJsonFile(folderIdOrFolder, fileName, obj, overwrite) {
    const folder = (typeof folderIdOrFolder === 'string') ? DriveApp.getFolderById(folderIdOrFolder) : folderIdOrFolder;
    if (overwrite) {
      const it = folder.getFilesByName(fileName);
      while (it.hasNext()) { it.next().setTrashed(true); }
    }
    const blob = Utilities.newBlob(JSON.stringify(obj, null, 2), 'application/json', fileName);
    folder.createFile(blob);
  }

  function readJsonFile(folderId, fileName) {
    const folder = DriveApp.getFolderById(folderId);
    const it = folder.getFilesByName(fileName);
    if (!it.hasNext()) return null;
    try { return JSON.parse(it.next().getBlob().getDataAsString()); }
    catch (e) { return null; }
  }

  function findOrderMarker(orderId, orderCode) {
    const guess = findOrderFolder(orderId, orderCode);
    return readJsonFile(guess.orderFolderId, 'order.json');
  }

  function folderById(id) { return DriveApp.getFolderById(id); }

  /** â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   * Utils
   * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function parseJson(s) { try { return JSON.parse(s || '{}'); } catch (e) { return null; } }
  // Apps Script Web Apps can't set HTTP status codes; always return 200 with an ok flag.
  function jsonOK(obj) { return ContentService.createTextOutput(JSON.stringify({ ok: true, ...(obj || {}) })).setMimeType(ContentService.MimeType.JSON); }
  function jsonERR(message, detail) { return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(message || 'error'), detail: detail || null })).setMimeType(ContentService.MimeType.JSON); }
  function getProp(name, required) { const v = PROPS.getProperty(name) || ''; if (required && !v) throw new Error(`Missing Script Property: ${name}`); return v; }
  function slug(s) { return String(s || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/(^-+|-+$)/g, '').toLowerCase(); }
  function euro(n) { const v = Number(n || 0); return Utilities.formatString('â‚¬ %s', v.toFixed(2)); }
  function cents(n) { return Math.round(Number(n || 0) * 100); }
  function sum(arr) { return arr.reduce((a, b) => a + Number(b || 0), 0); }
  function bold(s) { return s ? ('**' + s + '**') : ''; } // kept for legacy callers; not used in invoice
  function safe(s) { return String(s || ''); }
  function stripHtml(html) { return String(html || '').replace(/<[^>]+>/g, ''); }
  function escapeHtml(s) { return String(s || '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

  /** â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   * Test helpers (run manually from the editor)
   * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function test_ORDER_CREATED() {
    const payload = {
      event: 'ORDER_CREATED',
      id: 12345, order_code: 'ORD-12345',
      created_at: new Date().toISOString(),
      shipping: { name: 'Mario', surname: 'Rossi', email: 'ukivijay122@gmail.com', address: 'Via Roma 1', city: 'Roma', zip: '00100', province: 'RM' },
      print_files: [ { driveFileId: '1aTspSECjRKH2-06rJVHoi6x0816jVfIB', kind: 'client-upload' } ],
      amount: 12500,
      payment_method: 'card'
    };
    return handleOrderCreated(payload);
  }

  function driveFetch_(url, opts, maxAttempts) {
    const attempts = Math.max(1, maxAttempts || 5);
    let last;
    for (let i = 1; i <= attempts; i++) {
      try {
        const res = UrlFetchApp.fetch(url, opts);
        const code = res.getResponseCode();
        if (code < 300) return res;
        if (![403, 429, 500, 502, 503, 504].includes(code)) { last = res; break; }
        last = res;
      } catch (err) { last = err; }
      Utilities.sleep(Math.min(1500, Math.pow(2, i) * 200));
    }
    if (last && typeof last.getResponseCode === 'function') {
      throw new Error(`driveFetch_ failed ${last.getResponseCode()}: ${last.getContentText()}`);
    }
    throw new Error('driveFetch_ failed: ' + String(last));
  }

  function test_PAYMENT_SUCCEEDED() {
    const payload = {
      event: 'PAYMENT_SUCCEEDED',
      id: 12345,
      order_code: 'ORD-12345',
      amount: 12500,
      currency: 'EUR',
      force_email: true
    };
    return handlePaymentSucceeded(payload);
  }

  function resetInvoiceEmailState(orderId, orderCode) {
    if (orderId != null) PROPS.deleteProperty(`INVOICE_SENT_ID_${orderId}`);
    if (orderCode)       PROPS.deleteProperty(`INVOICE_SENT_CODE_${orderCode}`);
    const folderId = getOrderFolderMapping(orderId, orderCode);
    if (folderId) {
      const it = DriveApp.getFolderById(folderId).getFilesByName('invoice_email.json');
      while (it.hasNext()) it.next().setTrashed(true);
    }
    return { ok: true };
  }

  function testSupabaseFetch() {
    console.log('SUPABASE_URL:', CFG.SUPABASE_URL);
    console.log('SUPABASE_KEY exists:', !!CFG.SUPABASE_KEY);
    try {
      const order = supaGetOrder(4);
      console.log('supaGetOrder SUCCESS');
      console.log('Full order:', JSON.stringify(order, null, 2));
      console.log('order.customer:', order.customer);
      console.log('order.shipping:', order.shipping);
      console.log('order.items:', order.items);
      return order;
    } catch (err) {
      console.error('supaGetOrder FAILED:', err);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      throw err;
    }
  }

  function admin_cleanupProps() {
    const keys = PROPS.getKeys() || [];
    const victims = keys.filter(k => /^INVOICE_SENT_|^ORDER_FOLDER_|^ORDER_ROW_/.test(k));
    victims.forEach(k => PROPS.deleteProperty(k));
    return { deleted: victims.length };
  }

  function test_PAYMENT_SUCCEEDED_FULL() {
    // âš ï¸ Make sure the Script Properties are set (ROOT_FOLDER_ID, STAGING_FOLDER_ID, etc.)

    const payload = {
      event: 'PAYMENT_SUCCEEDED',
      id: 58,
      order_code: 'ORD-58',
      currency: 'EUR',

      // --- what frontend or supabase would send/return ---
      customer: {
        email: 'ukivijay122@gmail.com',
        first_name: 'Ukendiran M',
        last_name: 'test'
      },
      shipping: {
        // simulate missing 'name' to test fallback to customer.{first,last}
        // name: 'Ukendiran M test',     // uncomment to test direct shipping name
        email: '',                       // empty here on purpose
        address: 'No.8, Annai Indra Nagar Extn',
        city: 'coimbatore south',
        province: 'CN',                  // your screenshot shows (CN)
        postcode: '641016',
        country: 'IT'
      },
      items: [
        // Case A: numeric unit price
        { qty: 1, name: 'Striscione PVC Occhiellato', unitPrice: 68.5 },

        // Case B: same item using a "stringy" price (to test the parser)
        // { qty: 1, name: 'Banner 2', unitPrice: 'â‚¬ 68,50' }
      ],
      print_files: [
        { kind: 'client-upload', driveFileId: 'dummy-file-id', fileName: 'Sample.png', mimeType: 'image/png', size: 22148 }
      ],
      planned_drive_path: 'Customer_Orders/2025/10/ORD-58-test-coimbatore-south',
      created_at: new Date().toISOString(),
      paid_at:    new Date().toISOString(),

      // Stripe-like (checkout.session)
      payment_details: {
        id: 'cs_test_example',
        status: 'complete',
        currency: 'eur',
        customer_email: 'ukivijay122@gmail.com',
        amount_total: 5850, // 58.50 EUR (cents)
        amount_subtotal: 5850,
        total_details: { amount_tax: 0, amount_shipping: 0, amount_discount: 0, breakdown: {} },
        line_items: [
          {
            description: 'Order from Printora',
            quantity: 1,
            amount_total: 5850,
            currency: 'eur'
          }
        ]
      },

      // controls
      force_build: true,   // make a fresh PDF even if one exists
      force_email: true    // email again for testing
    };

    // (Optional) if you want to test enrichment off
    // return handlePaymentSucceeded(payload);

    // (Optional) if you want to test WITH enrichment, first fake it:
    // comment out supaGetOrder(orderId) call in handlePaymentSucceeded, or ensure your Supabase row matches this payload.

    return handlePaymentSucceeded(payload);
  }

  /**
   * Delete old invoice PDFs & markers, then rebuild (and optionally email).
   * Run from the editor via admin_forceRebuildInvoice__RUNME() below.
   */
  function admin_forceRebuildInvoice(orderId, orderCode, alsoEmail) {
    // Find the order folder + subfolders (creates them if missing)
    const info = findOrderFolder(orderId, orderCode);

    // 1) Delete any existing invoice PDFs
    const q = `'${info.invoicesFolderId}' in parents and mimeType = 'application/pdf' and name contains 'Invoice_' and trashed = false`;
    const old = driveList(q, 'files(id,name)', 100).files || [];
    old.forEach(f => {
      try { DriveApp.getFileById(f.id).setTrashed(true); } catch (e) {}
    });

    // 2) Clear markers so nothing blocks re-send / shows stale totals
    try { resetInvoiceEmailState(orderId, orderCode); } catch (e) {}
    try {
      const of = DriveApp.getFolderById(info.orderFolderId);
      ['invoice.json','debug_breakdown.json','invoice_email.json'].forEach(name => {
        const it = of.getFilesByName(name);
        while (it.hasNext()) it.next().setTrashed(true);
      });
    } catch (e) {}

    // 3) Rebuild via the normal handler (will fetch enriched order from Supabase etc.)
    //    force_build -> rebuild HTML/PDF; force_email -> resend PDF (if customer email resolvable)
    const result = handlePaymentSucceeded({
      event: 'PAYMENT_SUCCEEDED',
      id: orderId,
      order_code: orderCode,
      force_build: true,
      force_email: !!alsoEmail
    });

    return result;
  }

  /**
   * Convenience wrapper â€“ edit ORDER_CODE / ORDER_ID and click Run.
   * Only one of them is required; leave the other as null.
   */
  function admin_forceRebuildInvoice__RUNME() {
    const ORDER_CODE = 'ORD-1'; // <-- change this to the order you want to rebuild
    const ORDER_ID   = null;     // <-- or set a numeric id if you prefer

    const ALSO_EMAIL = false;    // set true to send the new PDF to the customer again
    const res = admin_forceRebuildInvoice(ORDER_ID, ORDER_CODE, ALSO_EMAIL);
    Logger.log(res);
  }

  function test_PAYMENT_FAILED_EMAILS_FIXED() {
    const payload = {
      event: 'PAYMENT_FAILED',
      id: 987654,
      order_code: 'ORD-987654',
      // Provide customer email directly in payload so resolver picks it up
      shipping: {
        email: 'ukivijay122@gmail.com',
        name: 'Test',
        surname: 'Customer',
        address: 'Via Roma 1',
        city: 'Roma'
      },
      amount: 5000,
      currency: 'EUR',
      payment_method: 'card',
      payment_details: {
        id: 'pi_test_failed',
        status: 'failed',
        customer_email: 'ukivijay122@gmail.com',
        last_payment_error: { message: 'Card declined (test)' }
      }
    };

    return handlePaymentFailed(payload);
  }

  function testFIC_Token() {
    const token = ficGetAccessToken();
    console.log('Access token OK, length:', token.length);
    return 'Token works';
  }

  function testFIC_CreateInvoice() {
    const payload = {
      event: 'PAYMENT_SUCCEEDED',
      id: 72,
      order_code: 'ORD-72',
      currency: 'EUR',
      payment_method: 'card',

      customer: {
        email: 'ukivijay122@gmail.com',
        first_name: 'Ukendiran M',
        last_name: 'test',
        company: 'ABC corporate'
      },

      shipping: {
        name: 'Ukendiran M test',
        email: 'ukivijay122@gmail.com',
        address: 'No.8, Annai Indra Nagar Extn',
        city: 'coimbatore south',
        province: 'CB',
        postcode: '641016',
        country: 'IT'
      },

      // NET (ex-VAT) prices
      items: [
        { name: 'Striscione PVC Occhiellato â€” 400cm x 100cm', qty: 1, unitPrice: 35.60 },
        { name: 'Spedizione',                                   qty: 1, unitPrice: 7.90  }
      ],

      // Keep totals deterministic (Imponibile 43.50; IVA 9.57; Totale 53.07)
      amount_total_cents: 5307,

      force_build: true,
      force_email: true
      // Do NOT set paid_at for now (no account configured) -> will be created UNPAID
    };

    const inv = ficCreateAndOptionallyEmailInvoice({
      orderId: payload.id,
      orderCode: payload.order_code,
      payload,
      customerEmail: payload.shipping.email
    });

    console.log('Invoice created:', JSON.stringify(inv, null, 2));
    return inv;
  }


  function admin_setDefaultVatId() {
    PROPS.setProperty('FIC_DEFAULT_VAT_ID', '0'); // standard 22% IVA
  }

  function admin_clearVatCache() {
    PROPS.deleteProperty('FIC_VAT_ID_FOR_22');
  }

  function ficListPaymentAccounts() {
    const res = ficReq('/settings/payment_accounts', { method: 'get' });
    const list = (res && res.data) || [];
    console.log('FIC payment accounts:', JSON.stringify(list.map(a => ({
      id: a.id, name: a.name, type: a.type
    }))));
    return list;
  }
  function admin_setPaymentAccountId(id) {
    PROPS.setProperty('FIC_PAYMENT_ACCOUNT_ID', String(id));
    return 'FIC_PAYMENT_ACCOUNT_ID=' + id;
  }
  function admin_clearPaymentAccountId() {
    PROPS.deleteProperty('FIC_PAYMENT_ACCOUNT_ID');
    return 'FIC_PAYMENT_ACCOUNT_ID cleared';
  }

  // Run this from the editor to replay the most recent webhook exactly as received.
function admin_replayLastWebhook() {
  const j = PROPS.getProperty('LAST_WEBHOOK_JSON');
  if (!j) throw new Error('No LAST_WEBHOOK_JSON captured yet');
  const payload = JSON.parse(j);
  if (!payload.event) throw new Error('Captured payload has no event');
  if (String(payload.event).toUpperCase() === 'PAYMENT_SUCCEEDED') {
    return handlePaymentSucceeded(payload);
  } else if (String(payload.event).toUpperCase() === 'ORDER_CREATED') {
    return handleOrderCreated(payload);
  } else if (String(payload.event).toUpperCase() === 'PAYMENT_FAILED') {
    return handlePaymentFailed(payload);
  }
  throw new Error('Unknown event in captured payload: ' + payload.event);
}

// Quick peek at what was captured (for sanity).
function admin_showLastWebhookSnippet() {
  const j = PROPS.getProperty('LAST_WEBHOOK_JSON') || '{}';
  const obj = JSON.parse(j);

  Logger.log(JSON.stringify({
    event: obj.event,
    has_billing: !!obj.billing,
    billing_snapshot: obj.billing ? {
      recipient_code: obj.billing.recipient_code || obj.billing.codice_destinatario || null,
      pec: obj.billing.pec || obj.billing.pec_address || null,
      vat_number: obj.billing.vat_number || null,
      tax_code: obj.billing.tax_code || null
    } : null,
    // some useful signals
    shipping_email: obj?.shipping?.email || null,
    keys: Object.keys(obj || {})
  }, null, 2));

  return true;
}

/** ---------------- TEST HELPERS FOR SHEET WRITES ---------------- **/

function _sampleOrderPayloadBase() {
  const nowIso = new Date().toISOString();
  return {
    id: 9002,
    order_code: 'ORD-1010',
    created_at: nowIso,
    currency: 'EUR',
    payment_method: 'card',
    customer: {
      email: 'ukivijay122@gmail.com',
      first_name: 'Ukie',
      last_name: 'Test',
      company: 'ABC Corporate',
      vat_number: 'IT12345678901',
      phone: '+39 333 1234567'
    },
    shipping: {
      name: 'Ukie',
      email: 'ukivijay122@gmail.com',
      address: 'Via Roma 1',
      city: 'Roma',
      postcode: '00100',
      province: 'RM',
      country: 'IT',
      phone: '+39 333 1234567',
      notes: 'Test note from test_END_TO_END_ORDER_CREATED — verifica inserimento campo note.' // ✅ add notes here
    },
    billing: {
      company: 'ABC Corporate',
      vat_number: 'IT12345678901',
      address: 'Via Industria 5',
      city: 'Roma',
      postcode: '00100',
      country: 'IT'
    },
    items: [
      { name: 'Vinile Lucido Squadrato — 100cm x 70cm', quantity: 1, unit_amount: 56.00, width_cm: 100, height_cm: 70 }
    ],
    print_files: [
      { kind: 'client-upload', driveFileId: '1uHycw1orR9mIJMRjQke15APpfpaUvvVu', driveLink: 'https://drive.google.com/file/d/1abcDEF2345678xyz/view' }
    ],
    amount_total_cents: 5662
  };
}

/** Simulate ORDER_CREATED -> should write status "pending" */
function test_SHEET_ORDER_CREATED() {
  const payload = _sampleOrderPayloadBase();
  ordersSheet_upsert(payload, { statusOverride: 'pending' });
  Logger.log('ORDER_CREATED test wrote/updated row for id=%s', payload.id);
}

/** Simulate PAYMENT_SUCCEEDED -> should flip to "paid" and update totals */
function test_SHEET_PAYMENT_SUCCEEDED() {
  const payload = _sampleOrderPayloadBase();
  payload.event = 'PAYMENT_SUCCEEDED';
  payload.payment_details = {
    status: 'complete',
    currency: 'eur',
    amount_total: payload.amount_total_cents,
    customer_email: payload.customer.email,
    line_items: payload.items.map(it => ({ description: it.name, quantity: it.quantity, amount_total: Math.round(it.unit_amount*100) }))
  };
  ordersSheet_upsert(payload, { statusOverride: 'paid' });
  Logger.log('PAYMENT_SUCCEEDED test wrote/updated row for id=%s', payload.id);
}

/** Simulate PAYMENT_FAILED -> should set status "failed" */
function test_SHEET_PAYMENT_FAILED() {
  const payload = _sampleOrderPayloadBase();
  payload.event = 'PAYMENT_FAILED';
  payload.payment_details = {
    status: 'failed',
    customer_email: payload.customer.email,
    last_payment_error: { message: 'Card declined (test)' }
  };
  ordersSheet_upsert(payload, { statusOverride: 'failed' });
  Logger.log('PAYMENT_FAILED test wrote/updated row for id=%s', payload.id);
}

/** End-to-end: call your real handlers if you want full flow (folders/emails/etc.) */
function test_END_TO_END_ORDER_CREATED() {
  const payload = _sampleOrderPayloadBase();
  payload.event = 'ORDER_CREATED';
  handleOrderCreated(payload);            // your existing function
  // ordersSheet_upsert(payload, {statusOverride:'pending'}); // already called above if you inserted it there
}

function test_END_TO_END_PAYMENT_SUCCEEDED() {
  const payload = _sampleOrderPayloadBase();
  payload.event = 'PAYMENT_SUCCEEDED';
  payload.paid_at = new Date().toISOString();
  payload.payment_details = {
    status: 'complete',
    currency: 'eur',
    amount_total: payload.amount_total_cents,
    customer_email: payload.customer.email,
    line_items: payload.items.map(it => ({ description: it.name, quantity: it.quantity, amount_total: Math.round(it.unit_amount*100) }))
  };
  handlePaymentSucceeded(payload);        // your existing function
}

function test_END_TO_END_PAYMENT_FAILED() {
  const payload = _sampleOrderPayloadBase();
  payload.event = 'PAYMENT_FAILED';
  payload.payment_details = {
    status: 'failed',
    customer_email: payload.customer.email,
    last_payment_error: { message: 'Declined (test)' }
  };
  handlePaymentFailed(payload);           // your existing function
}

function admin_debugAliases(){ Logger.log(GmailApp.getAliases()); }

function test_sendFromOrdini(){
  const to = Session.getActiveUser().getEmail();
  const html = '<p>Alias test: should be <b>ordini@printora.it</b></p>';
  const opts = {
    name: 'Printora',
    htmlBody: html,
    // mimic your helper:
    from: GmailApp.getAliases().includes('ordini@printora.it') ? 'ordini@printora.it' : undefined
  };
  GmailApp.sendEmail(to, 'Alias test', 'Fallback text', opts);
}

function debug_flipPaid() {
  const payload = { id: 53, order_code: 'ORD-53', event: 'PAYMENT_SUCCEEDED' };
  ordersSheet_upsert(payload, { statusOverride: 'paid' });
}

function test_INSPECT_BILLING_DATA() {
  // Simulate the exact payload your frontend sends
  const testPayload = {
    event: 'PAYMENT_SUCCEEDED',
    id: 12345,
    order_code: 'ORD-TEST-001',
    
    // âœ… Match your frontend field names EXACTLY
    billing: {
      company: 'Test Company SRL',
      vat_number: '12345678901',
      tax_code: 'RSSMRA80A01H501U',
      sdiCode: 'ABCDEFG',        // â† Frontend sends this
      pec: 'test@pec.example.com', // â† Frontend sends this
      email: 'billing@test.com'
    },
    
    shipping: {
      name: 'Mario',
      surname: 'Rossi',
      email: 'customer@test.com',
      address: 'Via Test 123',
      city: 'Roma',
      zip: '00100',
      province: 'RM',
      country: 'IT'
    },
    
    items: [{
      name: 'Test Product',
      quantity: 1,
      unit_amount: 100
    }],
    
    amount_total_cents: 14640,
    tax_cents: 2640,
    shipping_total: 10,
    tax_rate: 22
  };
  
  // Log what the function receives
  console.log('=== BILLING DATA INSPECTION ===');
  console.log('billing object:', JSON.stringify(testPayload.billing, null, 2));
  
  const bill = testPayload.billing || {};
  console.log('bill.recipient_code:', bill.recipient_code);
  console.log('bill.codice_destinatario:', bill.codice_destinatario);
  console.log('bill.sdiCode:', bill.sdiCode); // â† This is what you're actually sending
  console.log('bill.pec:', bill.pec);
  console.log('bill.pec_address:', bill.pec_address);
  
  // Test the actual FIC function
  try {
    return handlePaymentSucceeded(testPayload);
  } catch (e) {
    console.error('Error:', e.message);
    return { error: e.message };
  }
}

function test_FIC_ENTITY_UPDATE() {
  const cfg = ficCfg();
  
  // Test data with explicit SDI/PEC
  const testBilling = {
    sdiCode: 'TESTCODE',
    pec: 'test@pec.it',
    vat_number: '12345678901',
    tax_code: 'RSSMRA80A01H501U'
  };
  
  console.log('Testing with billing:', JSON.stringify(testBilling, null, 2));
  
  // Simulate the resolution logic
  const eiCode = testBilling.sdiCode || '0000000';
  const eiPec = testBilling.pec || null;
  
  console.log('Resolved ei_code:', eiCode);
  console.log('Resolved certified_email:', eiPec);
  
  // Create a test payload for entity update
  const updatePayload = {
    name: 'Test Customer',
    email: 'test@example.com',
    vat_number: testBilling.vat_number,
    tax_code: testBilling.tax_code,
    e_invoice: true,
    ei_code: eiCode,
    certified_email: eiPec
  };
  
  console.log('Update payload:', JSON.stringify(updatePayload, null, 2));
  
  return { eiCode, eiPec, updatePayload };
}

/** Ask FIC to formally verify the XML (no sending). Useful to catch issues early. */
function ficVerifyEInvoice(docId) {
  try {
    const res = ficReq('/issued_documents/' + encodeURIComponent(docId) + '/e_invoice/verify', {
      method: 'post',
      payload: { data: {} }
    });
    // -> { data: { valid: true|false, validation_result: { xml_errors: [...] } } }
    return (res && res.data) || {};
  } catch (e) {
    const msg = String((e && e.message) || '');
    console.warn('[FIC] e-invoice.verify.fail', msg);
    // 405 = method not allowed → treat as “verification not available” (don’t block send)
    if (/ 405: /.test(msg)) {
      return { valid: true, skipped: true };
    }
    return { valid: false, error: msg };
  }
}

/** Poll SdI delivery status so we can log the *real* discard reason from SdI. */
/** Poll SdI delivery status so we can log the *real* discard reason from SdI. */
function ficWaitEInvoiceStatus(docId, opts) {
  const timeoutMs  = (opts && opts.timeoutMs)  || 30000; // up to 90s
  const intervalMs = (opts && opts.intervalMs) || 5000;
  const start = Date.now();

  function getStatus() {
    // Newer tenants
    try {
      const res = ficReq('/issued_documents/' + encodeURIComponent(docId) + '/e_invoice/status', { method: 'get' });
      return (res && res.data) || null;
    } catch (e) {
      const msg = String((e && e.message) || '');
      // Older tenants fallback
      if (/ 404: /.test(msg)) {
        try {
          const res2 = ficReq('/issued_documents/' + encodeURIComponent(docId) + '/e_invoice', { method: 'get' });
          return (res2 && res2.data) || null;
        } catch (e2) {
          console.warn('[FIC] e-invoice.status.fallback.fail', (e2 && e2.message) || e2);
          return null;
        }
      }
      console.warn('[FIC] e-invoice.status.fail', msg);
      return null;
    }
  }

  while (Date.now() - start < timeoutMs) {
    Utilities.sleep(intervalMs);
    const st = getStatus();
    if (st) {
      console.log('[FIC] e-invoice.status', JSON.stringify(st));
      if (st.status === 'sent' || st.status === 'discarded' || st.status === 'error') return st;
    }
  }
  return { status: 'timeout' };
}

/** Dump the effective flags we use in code (from Script Properties via CFG). */
function _debugDumpCfg() {
  try {
    console.log('[CFG] SHARE_WITH_CUSTOMER=%s', CFG.SHARE_WITH_CUSTOMER);
    console.log('[CFG] SEND_ORDER_RECEIVED_EMAIL=%s', CFG.SEND_ORDER_RECEIVED_EMAIL);
    console.log('[CFG] DRIVE.ORDERS_ROOT_ID=%s', (CFG.DRIVE && CFG.DRIVE.ORDERS_ROOT_ID) ? CFG.DRIVE.ORDERS_ROOT_ID : '(missing)');
    console.log('[CFG] BRAND.NAME=%s FROM_EMAIL=%s', CFG.BRAND && CFG.BRAND.NAME, CFG.BRAND && CFG.BRAND.FROM_EMAIL);
  } catch (e) {
    console.error('[CFG] dump error:', e.stack || e);
  }
}

/** Log what URL we’ll inject and whether sharing succeeds, without stopping the run. */
function _diagnoseFilesLink(orderCode, customerEmail) {
  try {
    const url = getCustomerFilesLink(orderCode, customerEmail);
    console.log('[FILES] order=%s share=%s url=%s',
      orderCode, CFG.SHARE_WITH_CUSTOMER, url);

    // If Advanced Drive service is enabled, list permissions (optional)
    try {
      // This will only work if "Google Drive API" service is added to the project.
      const folderId = (url.match(/folders\/([^/?]+)/) || [])[1];
      if (folderId) {
        const plist = Drive.Permissions.list(folderId, { supportsAllDrives: true });
        const perms = (plist.items || []).map(p => ({
          type: p.type, role: p.role, email: p.emailAddress, domain: p.domain, allowFileDiscovery: p.allowFileDiscovery
        }));
        console.log('[FILES] perms for %s: %s', orderCode, JSON.stringify(perms));
      }
    } catch (permErr) {
      console.warn('[FILES] perms listing skipped (Advanced Drive not enabled or blocked):', permErr && permErr.message);
    }

    return url;
  } catch (e) {
    console.error('[FILES] error building link for %s: %s', orderCode, e.stack || e);
    return null;
  }
}

/** Call your production email function and log outcome (respects SEND_ORDER_RECEIVED_EMAIL). */
function _diagnoseSendEmail(payload) {
  try {
    const customerEmail = (payload.shipping && payload.shipping.email) || payload.to;
    _diagnoseFilesLink(payload.orderCode, customerEmail);

    if (!CFG.SEND_ORDER_RECEIVED_EMAIL) {
      console.warn('[EMAIL] SEND_ORDER_RECEIVED_EMAIL=false — email will NOT be sent for %s', payload.orderCode);
      return;
    }

    // This is your real email function. If it throws, we see the stack.
    sendOrderReceivedEmail(payload);
    console.log('[EMAIL] sent OK for %s to=%s', payload.orderCode, payload.to);
  } catch (e) {
    console.error('[EMAIL] send ERROR for %s: %s', payload.orderCode, e.stack || e);
  }
}

function _testReplayOrders() {
  _debugDumpCfg();

  const myEmail = Session.getActiveUser().getEmail(); // receive test to yourself
  const tests = [
    {
      to: myEmail,
      orderCode: 'ORD-94',
      shipping: {
        name: 'Ukendiran M',
        email: myEmail,
        company: 'ABC corporate',
        address: 'VIA CARFIO 9/C',
        city: 'Napoli',
        postcode: '80100',
        country: 'IT',
        phone: '6380471087'
      },
      amountCents: 1647, // €16.47
      orderDate: '2025-10-27T10:00:00Z',
      orderItems: [
        { name: 'Banner 100x70', quantity: 1, price: '16,47' }
      ]
    },

    // Add more historical orders here if you want to “replay” several
    // { to: myEmail, orderCode: 'ORD-95', shipping: {...}, amountCents: 2500, ... },
  ];

  tests.forEach(_diagnoseSendEmail);
}
function admin_removeNonPaidFromMainSheet() {
  const sh = ordersSheet_();
  const data = sh.getDataRange().getValues();
  const header = data[0] || [];
  const idx = header.indexOf('payment_status');
  if (idx < 0) return;
  for (let r = data.length - 1; r >= 1; r--) {
    const s = String(data[r][idx] || '').toLowerCase();
    if (s !== 'paid') sh.deleteRow(r + 1);
  }
}

// Test function to debug backup functionality
function testBackupFunctionality() {
  try {
    console.log('=== Testing Backup Functionality ===');
    
    // Test 1: Check backup configuration
    console.log('BACKUP_CFG.SS_ID:', BACKUP_CFG.SS_ID);
    console.log('BACKUP_CFG.TAB:', BACKUP_CFG.TAB);
    
    // Test 2: Try to access backup sheet
    const backupSh = backupSheet_();
    console.log('Backup sheet name:', backupSh.getName());
    console.log('Backup sheet ID:', backupSh.getParent().getId());
    
    // Test 3: Check headers
    const headers = backupSh.getRange(1, 1, 1, ORDER_COLS.length).getValues()[0];
    console.log('Backup sheet headers:', headers);
    
    // Test 4: Test copying a sample row
    const sampleRow = [
      'TEST123', // order_id
      new Date().toISOString(), // order_date
      'Test Customer', // customer_name
      'test@example.com', // customer_email
      '+1234567890', // customer_phone
      'Test Product', // product_name
      1, // quantity
      100, // width_cm
      200, // height_cm
      25.50, // total_price
      'EUR', // currency
      'card', // payment_method
      'paid', // payment_status
      'Test Street', // shipping_street
      'Test City', // shipping_city
      '12345', // shipping_postal_code
      'IT', // shipping_country
      '', // billing_company
      '', // billing_vat_number
      '', // billing_tax_code
      '', // billing_recipient_code
      '', // billing_pec
      '', // billing_street
      '', // billing_city
      '', // billing_postal_code
      '', // billing_country
      '', // print_file_url
      '#TEST123 | Test backup' // notes
    ];
    
    const result = copyOrderToBackup('TEST123', 'TEST123', sampleRow);
    console.log('Test backup result:', result);
    
    return 'Test completed - check console logs';
  } catch (e) {
    console.error('Test failed:', e.message, e.stack);
    return 'Test failed: ' + e.message;
  }
}