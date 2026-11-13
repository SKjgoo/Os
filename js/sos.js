/* ===== موقعي والطوارئ: GPS + مشاركة + تسجيل مسار (GPX) ===== */
document.addEventListener('DOMContentLoaded', () => {
  const $ = (id) => document.getElementById(id);
  const esc = (t) => String(t == null ? '' : t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const GEO_ERR = { 1: 'لم تسمح للموقع بالوصول إلى موقعك. فعّل إذن الموقع للمتصفح من إعدادات الجهاز ثم أعد المحاولة.', 2: 'تعذّر تحديد موقعك. اخرج لمكان مكشوف للسماء وحاول مجددًا.', 3: 'انتهت مهلة تحديد الموقع. حاول مجددًا.' };
  if (!navigator.geolocation) { $('loc-btn').disabled = true; $('loc-out').hidden = false; $('loc-out').textContent = 'متصفحك لا يدعم تحديد الموقع.'; }

  /* ---- موقعي الآن ---- */
  let last = null;
  const mapUrl = (p) => `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`;
  const msgFor = (p) => `أحتاج مساعدة. موقعي: ${p.lat.toFixed(5)}, ${p.lng.toFixed(5)} (دقة ±${Math.round(p.acc)} م) ${mapUrl(p)}`;
  function show(p) {
    last = p;
    let near = null;
    DESTINATIONS.forEach((d) => { const km = distKm(p, d); if (!near || km < near.km) near = { d, km }; });
    const out = $('loc-out'); out.hidden = false;
    out.innerHTML = `
      <p><b>خط العرض:</b> <span dir="ltr">${p.lat.toFixed(6)}</span><br><b>خط الطول:</b> <span dir="ltr">${p.lng.toFixed(6)}</span><br><b>الدقة:</b> ±${Math.round(p.acc)} م${p.alt != null ? '<br><b>الارتفاع:</b> ' + Math.round(p.alt) + ' م' : ''}</p>
      ${near ? `<p>أقرب وجهة في الموقع: <b>${esc(near.d.name)}</b> (${near.km < 1 ? 'أقل من 1' : Math.round(near.km)} كم)</p>` : ''}
      <div class="btn-row">
        <a class="btn small dark" href="${mapUrl(p)}" target="_blank" rel="noopener">افتح في الخرائط</a>
        <a class="btn small" href="https://wa.me/?text=${encodeURIComponent(msgFor(p))}" target="_blank" rel="noopener">أرسل عبر واتساب</a>
        <a class="btn small light" href="sms:?&body=${encodeURIComponent(msgFor(p))}">رسالة نصية</a>
        <button class="btn small light" id="loc-copy" type="button">انسخ الإحداثيات</button>
        ${navigator.share ? '<button class="btn small light" id="loc-share" type="button">مشاركة</button>' : ''}
      </div>
      ${p.acc > 100 ? '<p class="muted">الدقة منخفضة حاليًا؛ انتظر قليلًا في مكان مكشوف ثم اضغط «حدّد موقعي» مرة أخرى.</p>' : ''}`;
    $('loc-copy').addEventListener('click', async (e) => { try { await navigator.clipboard.writeText(msgFor(p)); e.target.textContent = 'تم النسخ'; } catch (x) { e.target.textContent = 'انسخ يدويًا: ' + p.lat.toFixed(5) + ',' + p.lng.toFixed(5); } });
    const sh = $('loc-share'); if (sh) sh.addEventListener('click', () => navigator.share({ title: 'موقعي', text: msgFor(p) }).catch(() => {}));
  }
  $('loc-btn').addEventListener('click', () => {
    const out = $('loc-out'); out.hidden = false; out.textContent = 'جارٍ تحديد موقعك…';
    navigator.geolocation.getCurrentPosition(
      (r) => show({ lat: r.coords.latitude, lng: r.coords.longitude, acc: r.coords.accuracy, alt: r.coords.altitude }),
      (e) => { out.textContent = GEO_ERR[e.code] || 'تعذّر تحديد الموقع.'; },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 });
  });

  /* ---- تسجيل المسار ---- */
  let pts = [], wid = null, tStart = 0, dist = 0;
  const tout = $('trk-out');
  function paint() {
    const mins = pts.length ? Math.round((Date.now() - tStart) / 60000) : 0;
    tout.hidden = false;
    tout.innerHTML = `<p><b>النقاط:</b> ${pts.length} · <b>المسافة:</b> ${(dist / 1000).toFixed(2)} كم · <b>المدة:</b> ${mins} د${wid != null ? ' <span class="rec">● يسجّل</span>' : ''}</p>`;
  }
  $('trk-start').addEventListener('click', () => {
    if (!navigator.geolocation) return;
    pts = []; dist = 0; tStart = Date.now();
    wid = navigator.geolocation.watchPosition((r) => {
      const p = { lat: r.coords.latitude, lng: r.coords.longitude, ele: r.coords.altitude, t: new Date().toISOString(), acc: r.coords.accuracy };
      if (p.acc > 60) return;                                    // تجاهل القراءات الضعيفة
      const prev = pts[pts.length - 1];
      if (prev) { const d = distKm(prev, p) * 1000; if (d < 5) return; dist += d; }
      pts.push(p); paint();
    }, (e) => { tout.hidden = false; tout.textContent = GEO_ERR[e.code] || 'خطأ في التتبع.'; }, { enableHighAccuracy: true, maximumAge: 2000, timeout: 30000 });
    $('trk-start').hidden = true; $('trk-stop').hidden = false; $('trk-gpx').hidden = true; paint();
  });
  $('trk-stop').addEventListener('click', () => {
    if (wid != null) navigator.geolocation.clearWatch(wid); wid = null;
    $('trk-stop').hidden = true; $('trk-start').hidden = false; $('trk-start').textContent = 'تسجيل جديد';
    $('trk-gpx').hidden = !pts.length; paint();
  });
  $('trk-gpx').addEventListener('click', () => {
    const gpx = '<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="Discover Oman" xmlns="http://www.topografix.com/GPX/1/1"><trk><name>Oman track</name><trkseg>\n' +
      pts.map((p) => `<trkpt lat="${p.lat}" lon="${p.lng}">${p.ele != null ? '<ele>' + p.ele.toFixed(1) + '</ele>' : ''}<time>${p.t}</time></trkpt>`).join('\n') + '\n</trkseg></trk></gpx>';
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([gpx], { type: 'application/gpx+xml' }));
    a.download = 'oman-track-' + new Date().toISOString().slice(0, 10) + '.gpx';
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  });

  /* ---- التثبيت والاستخدام دون إنترنت ---- */
  const inst = $('pwa-install');
  const showInst = () => { if (typeof deferredInstall !== 'undefined' && deferredInstall) inst.hidden = false; };
  showInst(); document.addEventListener('installready', showInst);
  inst.addEventListener('click', async () => { if (deferredInstall) { deferredInstall.prompt(); await deferredInstall.userChoice; inst.hidden = true; } });
  $('pwa-cache').addEventListener('click', async () => {
    const note = $('pwa-note');
    if (!('serviceWorker' in navigator)) { note.textContent = 'متصفحك لا يدعم العمل دون إنترنت.'; return; }
    const reg = await navigator.serviceWorker.getRegistration();
    if (!reg || !reg.active) { note.textContent = 'التطبيق يتجهّز؛ أعد تحميل الصفحة وحاول بعد لحظات (يعمل على الموقع المنشور فقط).'; return; }
    const urls = DESTINATIONS.map((d) => 'images/' + d.id + '.jpg').concat(['images/customer-service.png']);
    navigator.serviceWorker.addEventListener('message', (e) => {
      if (e.data && e.data.type === 'progress') note.textContent = e.data.done >= e.data.total ? 'تم! الموقع جاهز للاستخدام دون إنترنت.' : 'جارٍ التحميل… ' + e.data.done + '/' + e.data.total;
    });
    note.textContent = 'جارٍ التحميل…'; reg.active.postMessage({ type: 'precache', urls });
  });
});
