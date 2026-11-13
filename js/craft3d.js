/* ============================================================
   عارض ثلاثي الأبعاد مبسّط للحرف (مجسّمات مبنية بالشيفرة، بدون مكتبات).
   كل مجسّم سلسلة مقاطع بيضاوية (مثل الخرّاطة) ويُرسم على canvas ويُدار بالسحب.
   النماذج تقريبية للتعريف بالشكل العام وليست نسخًا دقيقة للقطع الأصلية.
   ============================================================ */
const Craft3D = (() => {
  const bell = (t, a, b, c) => a + b * Math.sin(Math.PI * Math.min(1, Math.max(0, t))) ** c;
  /* مقطع: { x, y, rx, rz, a } مركز (x,y) ونصفا القطر وزاوية ميل المقطع داخل المستوى */
  const lathe = (pts) => pts.map(([r, y]) => ({ x: 0, y, rx: r, rz: r, a: 0 }));

  const MODELS = {
    pottery: { name: 'جرّة فخار', base: [181, 101, 58], bands: [[0.18, 0.24], [0.52, 0.58]], band: [70, 40, 28], zig: [0.38, 0.46],
      sections: lathe([[0.01, 0], [0.26, 0.02], [0.34, 0.12], [0.5, 0.35], [0.56, 0.55], [0.46, 0.78], [0.3, 0.92], [0.26, 1.0], [0.34, 1.06], [0.36, 1.1], [0.3, 1.1], [0.2, 1.02]]) },
    incense: { name: 'مبخرة', base: [160, 90, 52], bands: [[0.38, 0.44]], band: [214, 170, 80], zig: [0.6, 0.7],
      sections: lathe([[0.01, 0], [0.3, 0.02], [0.24, 0.1], [0.14, 0.22], [0.12, 0.34], [0.2, 0.42], [0.34, 0.5], [0.42, 0.6], [0.44, 0.7], [0.36, 0.78], [0.24, 0.84], [0.12, 0.9], [0.1, 0.97], [0.16, 1.05], [0.01, 1.1]]) },
    copper: { name: 'دلّة قهوة', base: [184, 115, 51], bands: [[0.3, 0.34], [0.7, 0.74]], band: [230, 190, 110], zig: [0.46, 0.56],
      sections: lathe([[0.01, 0], [0.3, 0.02], [0.28, 0.12], [0.22, 0.26], [0.2, 0.36], [0.3, 0.44], [0.42, 0.56], [0.46, 0.66], [0.36, 0.78], [0.22, 0.88], [0.14, 0.96], [0.1, 1.04], [0.14, 1.1], [0.1, 1.16], [0.01, 1.2]]) },
    perfume: { name: 'مرشّ ماء الورد', base: [200, 210, 220], bands: [[0.12, 0.16]], band: [150, 60, 90], zig: [0.55, 0.62],
      sections: lathe([[0.01, 0], [0.28, 0.02], [0.34, 0.1], [0.36, 0.3], [0.34, 0.5], [0.26, 0.62], [0.14, 0.74], [0.08, 0.86], [0.08, 1.0], [0.14, 1.04], [0.14, 1.12], [0.06, 1.14], [0.01, 1.16]]) },
    khanjar: { yaw0: 0.25, name: 'الخنجر العُماني', base: [190, 192, 200], bands: [[0.1, 0.16], [0.35, 0.4]], band: [214, 170, 80], zig: [0.6, 0.7],
      sections: (() => {
        const s = [], N = 30;
        // مقبض (قرن/فضة) ثم غمد منحنٍ
        [[0.02, 1.3, 0.1, 0.09], [0.05, 1.22, 0.16, 0.14], [0.06, 1.12, 0.07, 0.07], [0.06, 1.04, 0.07, 0.07], [0.05, 0.98, 0.15, 0.1]].forEach(([x, y, rx, rz]) => s.push({ x, y, rx, rz, a: 0 }));
        for (let i = 0; i <= N; i++) { const t = i / N; const y = 0.94 - 0.94 * t; const x = 0.05 + 0.62 * t * t; const dx = 1.24 * t, dy = -0.94; const a = Math.atan2(dx, -dy);
          s.push({ x, y, rx: 0.15 * (1 - 0.15 * t) * (1 - 0.9 * t ** 4) + 0.02, rz: 0.045 * (1 - 0.5 * t), a }); }
        return s;
      })() }
  };

  function build(model, seg) {
    const S = model.sections, rings = S.map((sec) => {
      const c = Math.cos(sec.a), sn = Math.sin(sec.a), ring = [];
      for (let j = 0; j < seg; j++) { const th = (j / seg) * Math.PI * 2, px = Math.cos(th) * sec.rx, pz = Math.sin(th) * sec.rz;
        ring.push([sec.x + px * c, sec.y + px * sn, pz]); }
      return ring;
    });
    return rings;
  }
  const inBand = (arr, t) => arr.some(([a, b]) => t >= a && t <= b);

  function create(canvas, key) {
    const model = MODELS[key]; if (!model) return null;
    const ctx = canvas.getContext('2d'), SEG = 40, rings = build(model, SEG), n = rings.length;
    let yaw = model.yaw0 != null ? model.yaw0 : 0.6, pitch = 0.2, drag = false, lx = 0, ly = 0, raf = 0, alive = true;
    const ys = model.sections.map((s) => s.y), ymin = Math.min(...ys), ymax = Math.max(...ys), yc = (ymin + ymax) / 2;
    const xs = model.sections.map((s) => s.x), xc = (Math.min(...xs) + Math.max(...xs)) / 2;
    function draw() {
      const W = canvas.width, H = canvas.height, sc = Math.min(W, H) * 0.78 / Math.max(ymax - ymin, 1.1);
      ctx.clearRect(0, 0, W, H);
      const g = ctx.createRadialGradient(W / 2, H * 0.55, 10, W / 2, H * 0.55, W * 0.7); g.addColorStop(0, 'rgba(255,255,255,.18)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const P = rings.map((r) => r.map(([x, y, z]) => {
        const X = x - xc, Y = y - yc, Z = z;
        const x1 = X * cy + Z * sy, z1 = -X * sy + Z * cy;
        const y2 = Y * cp - z1 * sp, z2 = Y * sp + z1 * cp;
        const f = 1 / (1 - z2 * 0.12);
        return [W / 2 + x1 * sc * f, H / 2 - y2 * sc * f, z2];
      }));
      const quads = [];
      for (let i = 0; i < n - 1; i++) for (let j = 0; j < SEG; j++) {
        const j2 = (j + 1) % SEG, a = P[i][j], b = P[i][j2], c = P[i + 1][j2], d = P[i + 1][j];
        const ux = b[0] - a[0], uy = b[1] - a[1], vx = d[0] - a[0], vy = d[1] - a[1];
        const nz = ux * vy - uy * vx;                       // اتجاه الوجه على الشاشة
        const z = (a[2] + b[2] + c[2] + d[2]) / 4;
        quads.push({ i, j, a, b, c, d, z, nz });
      }
      quads.sort((p, q) => p.z - q.z);
      quads.forEach((q) => {
        const t = q.i / (n - 1);
        let col = model.base;
        if (inBand(model.bands, t)) col = model.band;
        else if (model.zig && t >= model.zig[0] && t <= model.zig[1] && (q.j % 4 < 2)) col = model.band;
        // إضاءة تقريبية: كلما واجه الوجه الكاميرا واليسار الأعلى كان أفتح
        const facing = Math.min(1, Math.abs(q.nz) / 700);
        const lum = 0.45 + 0.35 * facing + 0.2 * (Math.cos(((q.j + 0.5) / SEG) * Math.PI * 2 + yaw - 0.9) * 0.5 + 0.5);
        ctx.fillStyle = `rgb(${Math.min(255, col[0] * lum) | 0},${Math.min(255, col[1] * lum) | 0},${Math.min(255, col[2] * lum) | 0})`;
        ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = 0.6;
        ctx.beginPath(); ctx.moveTo(q.a[0], q.a[1]); ctx.lineTo(q.b[0], q.b[1]); ctx.lineTo(q.c[0], q.c[1]); ctx.lineTo(q.d[0], q.d[1]); ctx.closePath(); ctx.fill(); ctx.stroke();
      });
    }
    function loop() { if (!alive) return; if (!drag) yaw += model.yaw0 != null ? 0.006 : 0.012; draw(); raf = requestAnimationFrame(loop); }
    const pos = (e) => { const t = e.touches ? e.touches[0] : e; return [t.clientX, t.clientY]; };
    const down = (e) => { drag = true; [lx, ly] = pos(e); };
    const move = (e) => { if (!drag) return; const [x, y] = pos(e); yaw += (x - lx) * 0.012; pitch = Math.max(-0.6, Math.min(0.9, pitch + (y - ly) * 0.008)); lx = x; ly = y; if (e.cancelable) e.preventDefault(); };
    const up = () => { drag = false; };
    canvas.addEventListener('pointerdown', (e) => { canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId); down(e); });
    canvas.addEventListener('pointermove', move); canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
    canvas.style.touchAction = 'none';
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) { draw(); } else { loop(); }
    return { stop() { alive = false; cancelAnimationFrame(raf); }, name: model.name };
  }
  return { create, has: (k) => !!MODELS[k], MODELS };
})();
