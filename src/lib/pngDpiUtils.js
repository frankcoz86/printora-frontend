/**
 * setPngDpiMetadata
 *
 * Injects a PNG pHYs chunk so that image editors (Photoshop, GIMP, etc.)
 * and metadata tools read the correct DPI from the file.
 *
 * The pHYs chunk is inserted right after the IHDR chunk (byte offset 33),
 * which is exactly where the PNG spec requires it to appear.
 *
 * No external dependencies — includes a self-contained CRC-32 implementation
 * as required by the PNG chunk specification.
 *
 * @param {string} dataURL  - A PNG data URL (e.g. from canvas.toDataURL)
 * @param {number} dpi      - The DPI value to embed (e.g. 300)
 * @returns {string}        - A new PNG data URL with the pHYs chunk embedded
 */
export const setPngDpiMetadata = (dataURL, dpi) => {
    // 1. Decode base64 → Uint8Array
    const base64 = dataURL.split(',')[1];
    const binaryStr = atob(base64);
    const src = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) src[i] = binaryStr.charCodeAt(i);

    // 2. Tiny CRC-32 (required to produce a valid PNG chunk)
    const crcTable = (() => {
        const t = new Uint32Array(256);
        for (let n = 0; n < 256; n++) {
            let c = n;
            for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
            t[n] = c;
        }
        return t;
    })();
    const crc32 = (buf) => {
        let c = 0xFFFFFFFF;
        for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
        return (c ^ 0xFFFFFFFF) >>> 0;
    };

    // 3. Build the pHYs chunk
    // DPI → pixels per metre: e.g. 300 DPI = round(300 / 0.0254) = 11811 ppm
    const ppm = Math.round(dpi / 0.0254);
    const TYPE = new Uint8Array([0x70, 0x48, 0x59, 0x73]); // ASCII 'pHYs'
    const data = new Uint8Array(9);
    const dv = new DataView(data.buffer);
    dv.setUint32(0, ppm); // pixels per unit X
    dv.setUint32(4, ppm); // pixels per unit Y
    data[8] = 1;          // unit specifier: 1 = metre

    const crcInput = new Uint8Array(13); // type(4) + data(9)
    crcInput.set(TYPE, 0);
    crcInput.set(data, 4);
    const checksum = crc32(crcInput);

    const chunk = new Uint8Array(4 + 4 + 9 + 4); // length + type + data + crc
    const cv = new DataView(chunk.buffer);
    cv.setUint32(0, 9);         // data length field = 9
    chunk.set(TYPE, 4);
    chunk.set(data, 8);
    cv.setUint32(17, checksum); // CRC field

    // 4. Splice pHYs in after IHDR
    //    Offset 33 = 8-byte PNG signature + 25-byte IHDR (4 len + 4 type + 13 data + 4 crc)
    const INSERT_AT = 33;
    const out = new Uint8Array(src.length + chunk.length);
    out.set(src.slice(0, INSERT_AT), 0);
    out.set(chunk, INSERT_AT);
    out.set(src.slice(INSERT_AT), INSERT_AT + chunk.length);

    // 5. Re-encode to base64 data URL
    let bin = '';
    out.forEach(b => (bin += String.fromCharCode(b)));
    return 'data:image/png;base64,' + btoa(bin);
};
