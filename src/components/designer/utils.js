import { fabric } from 'fabric';

export const FONT_FAMILIES = [
    'Arial', 'Verdana', 'Helvetica', 'Times New Roman', 'Courier New', 
    'Georgia', 'Palatino', 'Garamond', 'Comic Sans MS', 'Impact',
    'Montserrat', 'Lato', 'Roboto', 'Open Sans', 'Poppins', 'Oswald',
    'Merriweather', 'Playfair Display', 'Nunito', 'Raleway', 'Bebas Neue',
    'Lobster', 'Pacifico', 'Anton', 'Dancing Script', 'Shadows Into Light',
    'Caveat', 'Permanent Marker', 'Amatic SC', 'Righteous'
];

export const FONT_URLS = {
    'Arial': '/fonts/arial.ttf',
    'Verdana': '/fonts/verdana.ttf',
    'Helvetica': '/fonts/helvetica.ttf',
    'Times New Roman': '/fonts/times.ttf',
    'Courier New': '/fonts/cour.ttf',
    'Georgia': '/fonts/georgia.ttf',
    'Palatino': '/fonts/palatino.ttf',
    'Garamond': '/fonts/garamond.ttf',
    'Comic Sans MS': '/fonts/comic.ttf',
    'Impact': '/fonts/impact.ttf',
    'Montserrat': 'https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw5aXo.ttf',
    'Lato': 'https://fonts.gstatic.com/s/lato/v24/S6uyw4BMUTPHjx4wXg.ttf',
    'Roboto': 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.ttf',
    'Open Sans': 'https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVI.ttf',
    'Poppins': 'https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJbecnFH.ttf',
    'Oswald': 'https://fonts.gstatic.com/s/oswald/v53/TK3_WkUHHAIjg75cFRf3bXL8LICs1_FvsUtiYw.ttf',
    'Merriweather': 'https://fonts.gstatic.com/s/merriweather/v30/u-440qyriQwlOrhSvowK_l5-eR7sXcf_hP0.ttf',
    'Playfair Display': 'https://fonts.gstatic.com/s/playfairdisplay/v37/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtM.ttf',
    'Nunito': 'https://fonts.gstatic.com/s/nunito/v26/XRXV3I6Li01BKofINeaBTMnFcQ.ttf',
    'Raleway': 'https://fonts.gstatic.com/s/raleway/v28/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVvaorCFPrcVIT9d0c-dYA.ttf',
    'Bebas Neue': 'https://fonts.gstatic.com/s/bebasneue/v14/JTUSjIg69CK48gW7PXooxW5ryg.ttf',
    'Lobster': 'https://fonts.gstatic.com/s/lobster/v30/neILzCirqoswsqX9_oU.ttf',
    'Pacifico': 'https://fonts.gstatic.com/s/pacifico/v22/FwZY7-Qmy14u9lezJ-6H6M0.ttf',
    'Anton': 'https://fonts.gstatic.com/s/anton/v25/1Ptsg8ZZ_Myl4dMnew.ttf',
    'Dancing Script': 'https://fonts.gstatic.com/s/dancingscript/v25/If2cXTr6YS-zF4S-kcSWSVi_sxjsohD9F50Ruu7BMSo3Rep8hA.ttf',
    'Shadows Into Light': 'https://fonts.gstatic.com/s/shadowsintolight/v19/UqyNK9UOIntux_czAvDQx_ZcHqZXBNQzdcD5.ttf',
    'Caveat': 'https://fonts.gstatic.com/s/caveat/v18/WnznHAc5bAfYB2Q7aAnP-A.ttf',
    'Permanent Marker': 'https://fonts.gstatic.com/s/permanentmarker/v16/Fh4uPib9Iyv2ucM6pGQMWimMp004HaqIfrA.ttf',
    'Amatic SC': 'https://fonts.gstatic.com/s/amaticsc/v26/TUZyZWprpvBS1UI_志Dq.ttf',
    'Righteous': 'https://fonts.gstatic.com/s/righteous/v17/1cXxaUPOo9PUbpr1DsAU-Oo.ttf',
};


export const drawGuides = (canvas, state) => {
    const scale = canvas.cmToPxScale;
    
    if (state.product.type === 'banner') {
        const safeMarginCm = 3;
        const safeMarginPx = safeMarginCm * scale;
        const safeArea = new fabric.Rect({
            left: safeMarginPx,
            top: safeMarginPx,
            width: canvas.width - (safeMarginPx * 2),
            height: canvas.height - (safeMarginPx * 2),
            fill: 'transparent',
            stroke: '#3b82f6',
            strokeWidth: 1,
            strokeDashArray: [5, 5],
            selectable: false,
            evented: false,
            excludeFromExport: true,
            guideType: 'safe-area',
            id: `guide-safe-area`
        });
        canvas.add(safeArea);
        
        const warningText = new fabric.Text('Area di Sicurezza Testi', {
            fontSize: 10,
            fill: '#3b82f6',
            left: safeMarginPx + 5,
            top: safeMarginPx + 5,
            selectable: false,
            evented: false,
            excludeFromExport: true,
            guideType: 'safe-area-text',
            id: `guide-safe-area-text`
        });
        canvas.add(warningText);

        const eyeletMarginCm = 3;
        const eyeletDiameterCm = 0.8; // 8mm
        
        const eyeletMarginPx = eyeletMarginCm * scale;
        const eyeletRadiusPx = (eyeletDiameterCm / 2) * scale;

        const createEyelet = (left, top, id) => new fabric.Circle({
            left,
            top,
            radius: eyeletRadiusPx,
            fill: 'rgba(100, 100, 100, 0.7)',
            stroke: 'rgba(200, 200, 200, 0.8)',
            strokeWidth: 0.5,
            selectable: false,
            evented: false,
            originX: 'center',
            originY: 'center',
            excludeFromExport: true, // Initially true, changed on export
            guideType: 'eyelet',
            id: `guide-eyelet-${id}`
        });

        const longSideSpacingCm = 50;
        const shortSideSpacingCm = 50;

        const longSideSpacingPx = longSideSpacingCm * scale;
        const shortSideSpacingPx = shortSideSpacingCm * scale;

        const isWidthLonger = state.width > state.height;
        
        const horizontalSpacing = isWidthLonger ? longSideSpacingPx : shortSideSpacingPx;
        const verticalSpacing = isWidthLonger ? shortSideSpacingPx : longSideSpacingPx;

        let eyeletId = 0;
        // Top and Bottom Eyelets
        for (let x = eyeletMarginPx; x <= canvas.width - eyeletMarginPx; x += horizontalSpacing) {
            canvas.add(createEyelet(x, eyeletMarginPx, eyeletId++));
            canvas.add(createEyelet(x, canvas.height - eyeletMarginPx, eyeletId++));
        }
        // Ensure last eyelet is at the edge
        if ((canvas.width - eyeletMarginPx * 2) % horizontalSpacing !== 0) {
             canvas.add(createEyelet(canvas.width - eyeletMarginPx, eyeletMarginPx, eyeletId++));
             canvas.add(createEyelet(canvas.width - eyeletMarginPx, canvas.height - eyeletMarginPx, eyeletId++));
        }
        
        // Add central eyelet on shorter side
        if (isWidthLonger) { // Horizontal banner, shorter sides are left/right
            canvas.add(createEyelet(eyeletMarginPx, canvas.height / 2, eyeletId++));
            canvas.add(createEyelet(canvas.width - eyeletMarginPx, canvas.height / 2, eyeletId++));
        } else { // Vertical banner, shorter sides are top/bottom
            canvas.add(createEyelet(canvas.width / 2, eyeletMarginPx, eyeletId++));
            canvas.add(createEyelet(canvas.width / 2, canvas.height - eyeletMarginPx, eyeletId++));
        }


        // Left and Right Eyelets (skip corners and center)
        for (let y = eyeletMarginPx + verticalSpacing; y < canvas.height - eyeletMarginPx; y += verticalSpacing) {
            if (isWidthLonger && Math.abs(y - canvas.height / 2) < verticalSpacing / 2) continue; // Skip if too close to center
            canvas.add(createEyelet(eyeletMarginPx, y, eyeletId++));
            canvas.add(createEyelet(canvas.width - eyeletMarginPx, y, eyeletId++));
        }

    } else if (state.product.type === 'rollup') {
        const topSafeMarginCm = 2;
        const sideSafeMarginCm = 2;
        const bottomVisibleAreaCm = 200;
        const bottomMarginCm = 10;

        const topSafeMarginPx = topSafeMarginCm * scale;
        const sideSafeMarginPx = sideSafeMarginCm * scale;
        const bottomVisibleAreaPx = bottomVisibleAreaCm * scale;
        const bottomMarginPx = bottomMarginCm * scale;

        const safeArea = new fabric.Rect({
            left: sideSafeMarginPx,
            top: topSafeMarginPx,
            width: canvas.width - (sideSafeMarginPx * 2),
            height: bottomVisibleAreaPx - topSafeMarginPx,
            fill: 'transparent',
            stroke: '#3b82f6',
            strokeWidth: 1,
            strokeDashArray: [5, 5],
            selectable: false,
            evented: false,
            excludeFromExport: true,
            guideType: 'safe-area',
            id: 'guide-safe-area'
        });
        canvas.add(safeArea);

        const warningText = new fabric.Text('Area di Sicurezza Testi', {
            fontSize: 10,
            fill: '#3b82f6',
            left: sideSafeMarginPx + 5,
            top: topSafeMarginPx + 5,
            selectable: false,
            evented: false,
            excludeFromExport: true,
            guideType: 'safe-area-text',
            id: 'guide-safe-area-text'
        });
        canvas.add(warningText);

        const bottomArea = new fabric.Rect({
            left: 0,
            top: canvas.height - bottomMarginPx,
            width: canvas.width,
            height: bottomMarginPx,
            fill: 'rgba(100, 100, 100, 0.5)',
            stroke: '#f87171',
            strokeWidth: 1,
            selectable: false,
            evented: false,
            excludeFromExport: true,
            guideType: 'rollup-bottom-area',
            id: 'guide-rollup-bottom-area'
        });
        canvas.add(bottomArea);

         const bottomWarningText = new fabric.Text('Area non visibile (coperta dalla struttura)', {
            fontSize: 12,
            fill: 'rgba(255, 255, 255, 0.9)',
            left: canvas.width / 2,
            top: canvas.height - (bottomMarginPx / 2),
            originX: 'center',
            originY: 'center',
            selectable: false,
            evented: false,
            excludeFromExport: true,
            guideType: 'rollup-bottom-text',
            id: 'guide-rollup-bottom-text'
        });
        canvas.add(bottomWarningText);
    } else if (state.product.type === 'rigid-media') {
        const safeMarginCm = 3;
        const safeMarginPx = safeMarginCm * scale;
        const safeArea = new fabric.Rect({
            left: safeMarginPx,
            top: safeMarginPx,
            width: canvas.width - (safeMarginPx * 2),
            height: canvas.height - (safeMarginPx * 2),
            fill: 'transparent',
            stroke: '#3b82f6',
            strokeWidth: 1,
            strokeDashArray: [5, 5],
            selectable: false,
            evented: false,
            excludeFromExport: true,
            guideType: 'safe-area',
            id: 'guide-safe-area'
        });
        canvas.add(safeArea);
        
        const warningText = new fabric.Text('Area di Sicurezza Testi', {
            fontSize: 10,
            fill: '#3b82f6',
            left: safeMarginPx + 5,
            top: safeMarginPx + 5,
            selectable: false,
            evented: false,
            excludeFromExport: true,
            guideType: 'safe-area-text',
            id: 'guide-safe-area-text'
        });
        canvas.add(warningText);
    }
    
    canvas.renderAll();
};