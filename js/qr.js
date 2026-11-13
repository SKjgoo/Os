/* مولّد رمز QR مصغّر (بايت، مستوى تصحيح L، الإصدارات 1–10) — مكتوب لهذا الموقع بلا مكتبات خارجية. */
const QR = (() => {
  const ECC = [7, 10, 15, 20, 26, 18, 20, 24, 30, 18], BLK = [1, 1, 1, 1, 1, 2, 2, 2, 2, 4];
  const rawModules = (v) => { let r = (16 * v + 128) * v + 64; if (v >= 2) { const n = Math.floor(v / 7) + 2; r -= (25 * n - 10) * n - 55; if (v >= 7) r -= 36; } return r; };
  const dataCw = (v) => Math.floor(rawModules(v) / 8) - ECC[v - 1] * BLK[v - 1];
  // GF(256)
  const EXP = new Array(512), LOG = new Array(256);
  (() => { let x = 1; for (let i = 0; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 256) x ^= 0x11d; } for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255]; })();
  const mul = (a, b) => (a && b ? EXP[LOG[a] + LOG[b]] : 0);
  function rsDiv(deg) { let r = [1]; for (let i = 0; i < deg; i++) { const n = new Array(r.length + 1).fill(0); r.forEach((c, j) => { n[j] ^= c; n[j + 1] ^= mul(c, EXP[i]); }); r = n; } return r; }
  function rsRem(data, gen) { const deg = gen.length - 1, res = new Array(deg).fill(0); data.forEach((b) => { const f = b ^ res.shift(); res.push(0); for (let i = 0; i < deg; i++) res[i] ^= mul(gen[i + 1], f); }); return res; }
  function utf8(s) { return [...unescape(encodeURIComponent(s))].map((c) => c.charCodeAt(0)); }

  function encode(text) {
    const bytes = utf8(text);
    let ver = 1;
    while (ver <= 10) { const cc = ver < 10 ? 8 : 16; if (4 + cc + bytes.length * 8 <= dataCw(ver) * 8) break; ver++; }
    if (ver > 10) throw new Error('النص أطول من الحد');
    const bits = []; const put = (v, n) => { for (let i = n - 1; i >= 0; i--) bits.push((v >>> i) & 1); };
    put(4, 4); put(bytes.length, ver < 10 ? 8 : 16); bytes.forEach((b) => put(b, 8));
    const cap = dataCw(ver) * 8; put(0, Math.min(4, cap - bits.length)); while (bits.length % 8) bits.push(0);
    for (let p = 0xEC; bits.length < cap; p ^= 0xEC ^ 0x11) put(p, 8);
    const data = []; for (let i = 0; i < bits.length; i += 8) data.push(parseInt(bits.slice(i, i + 8).join(''), 2));
    // blocks + ecc + interleave
    const nb = BLK[ver - 1], ecl = ECC[ver - 1], raw = Math.floor(rawModules(ver) / 8);
    const short = Math.floor(raw / nb) - ecl, nLong = raw % nb, gen = rsDiv(ecl), blocks = [];
    for (let i = 0, k = 0; i < nb; i++) { const len = short + (i < nb - nLong ? 0 : 1); const d = data.slice(k, k + len); k += len; blocks.push({ d, e: rsRem(d, gen) }); }
    const out = [];
    for (let i = 0; i <= short; i++) blocks.forEach((b) => { if (i < b.d.length) out.push(b.d[i]); });
    for (let i = 0; i < ecl; i++) blocks.forEach((b) => out.push(b.e[i]));
    return { ver, cw: out };
  }
  function matrix(text) {
    const { ver, cw } = encode(text), size = ver * 4 + 17;
    const m = Array.from({ length: size }, () => new Array(size).fill(false)), fn = Array.from({ length: size }, () => new Array(size).fill(false));
    const set = (x, y, v) => { m[y][x] = v; fn[y][x] = true; };
    for (let i = 0; i < size; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
    const finder = (cx, cy) => { for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) { const x = cx + dx, y = cy + dy; if (x < 0 || y < 0 || x >= size || y >= size) continue; const d = Math.max(Math.abs(dx), Math.abs(dy)); set(x, y, d !== 2 && d !== 4); } };
    finder(3, 3); finder(size - 4, 3); finder(3, size - 4);
    if (ver > 1) { const n = Math.floor(ver / 7) + 2, step = Math.ceil((ver * 4 + 4) / (n * 2 - 2)) * 2, pos = [6]; for (let p = size - 7; pos.length < n; p -= step) pos.splice(1, 0, p);
      pos.forEach((px, i) => pos.forEach((py, j) => { if ((i === 0 && j === 0) || (i === 0 && j === n - 1) || (i === n - 1 && j === 0)) return; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) set(px + dx, py + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1); })); }
    const mask = 0, ecl = 1; // L = 01
    const fmtData = (ecl << 3) | mask; let rem = fmtData; for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const fb = ((fmtData << 10) | rem) ^ 0x5412, bit = (i) => ((fb >>> i) & 1) !== 0;
    for (let i = 0; i <= 5; i++) set(8, i, bit(i)); set(8, 7, bit(6)); set(8, 8, bit(7)); set(7, 8, bit(8)); for (let i = 9; i < 15; i++) set(14 - i, 8, bit(i));
    for (let i = 0; i < 8; i++) set(size - 1 - i, 8, bit(i)); for (let i = 8; i < 15; i++) set(8, size - 15 + i, bit(i)); set(8, size - 8, true);
    if (ver >= 7) { let r = ver; for (let i = 0; i < 12; i++) r = (r << 1) ^ ((r >>> 11) * 0x1F25); const vb = (ver << 12) | r;
      for (let i = 0; i < 18; i++) { const b = ((vb >>> i) & 1) !== 0, a = size - 11 + (i % 3), c = Math.floor(i / 3); set(a, c, b); set(c, a, b); } }
    let i = 0;
    for (let right = size - 1; right >= 1; right -= 2) { if (right === 6) right = 5;
      for (let vert = 0; vert < size; vert++) for (let j = 0; j < 2; j++) { const x = right - j, up = ((right + 1) & 2) === 0, y = up ? size - 1 - vert : vert;
        if (!fn[y][x] && i < cw.length * 8) { m[y][x] = ((cw[i >>> 3] >>> (7 - (i & 7))) & 1) !== 0; i++; } } }
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (!fn[y][x] && (x + y) % 2 === 0) m[y][x] = !m[y][x];
    return m;
  }
  function svg(text, px) {
    const m = matrix(text), n = m.length, q = 4; let d = '';
    m.forEach((row, y) => row.forEach((v, x) => { if (v) d += `M${x + q},${y + q}h1v1h-1z`; }));
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n + q * 2} ${n + q * 2}" width="${px || 160}" height="${px || 160}" shape-rendering="crispEdges" role="img" aria-label="QR"><rect width="100%" height="100%" fill="#fff"/><path d="${d}" fill="#000"/></svg>`;
  }
  return { matrix, svg };
})();
if (typeof module !== 'undefined') module.exports = QR;
