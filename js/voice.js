/* ============================================================
   المرشد الصوتي: يقرأ النص المعروض بصوت الجهاز وبلغة الصفحة الحالية.
   يعتمد على Web Speech API المدمج في المتصفح (مجاني، بلا خادم).
   توفّر الأصوات يختلف بحسب الجهاز واللغة؛ إن لم يوجد صوت للغة نخبر المستخدم.
   ============================================================ */
const Voice = (() => {
  const ok = 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
  let current = null, timer = null;

  const clean = (t) => String(t || '').replace(/[•◆✦🌿🌴🔊⏹]/g, ' ').replace(/\s+/g, ' ').trim();
  function chunks(text) {                       // iOS يقطع النص الطويل، فنقسّمه لجمل قصيرة
    const parts = clean(text).split(/(?<=[.!?؟،۔。！？])\s+/), out = [];
    let cur = '';
    parts.forEach((p) => {
      if ((cur + ' ' + p).length > 170 && cur) { out.push(cur); cur = p; } else cur = (cur + ' ' + p).trim();
    });
    if (cur) out.push(cur);
    return out.flatMap((c) => c.length > 220 ? c.match(/.{1,200}(\s|$)/g) : [c]);
  }
  function pickVoice(lang) {
    const vs = speechSynthesis.getVoices();
    const base = lang.split('-')[0];
    return vs.find((v) => v.lang === lang) || vs.find((v) => v.lang.replace('_', '-').startsWith(base)) || null;
  }
  function stop() {
    if (!ok) return;
    clearInterval(timer); speechSynthesis.cancel();
    if (current) { current.classList.remove('speaking'); current.setAttribute('aria-pressed', 'false'); current.querySelector('.sp-t').textContent = current.dataset.label; }
    current = null;
  }
  function speak(text, btn, onNoVoice) {
    if (!ok) { if (onNoVoice) onNoVoice('متصفحك لا يدعم القراءة الصوتية.'); return; }
    const was = current === btn;
    stop();
    if (was) return;
    const lang = (typeof speechLang === 'function') ? speechLang() : 'ar-SA';
    const run = () => {
      const voice = pickVoice(lang);
      if (!voice && speechSynthesis.getVoices().length && onNoVoice) onNoVoice('لا يوجد في جهازك صوت لهذه اللغة. غيّر لغة الموقع أو ثبّت صوتًا من إعدادات الجهاز.');
      const list = chunks(text);
      if (!list.length) return;
      current = btn; btn.classList.add('speaking'); btn.setAttribute('aria-pressed', 'true'); btn.querySelector('.sp-t').textContent = btn.dataset.stop;
      list.forEach((c, i) => {
        const u = new SpeechSynthesisUtterance(c);
        u.lang = lang; if (voice) u.voice = voice; u.rate = 0.95;
        if (i === list.length - 1) { u.onend = u.onerror = () => { if (current === btn) stop(); }; }
        speechSynthesis.speak(u);
      });
      // حيلة لمتصفح كروم: تجنّب توقّف القراءة الطويلة
      clearInterval(timer);
      timer = setInterval(() => { if (!speechSynthesis.speaking) clearInterval(timer); else { speechSynthesis.pause(); speechSynthesis.resume(); } }, 12000);
    };
    if (speechSynthesis.getVoices().length) run();
    else { let done = false; const go = () => { if (!done) { done = true; run(); } }; speechSynthesis.onvoiceschanged = go; setTimeout(go, 600); }
  }
  /* ينشئ زر «استمع» يقرأ ما يُرجعه getText عند الضغط */
  function button(getText, opts) {
    opts = opts || {};
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'speak-btn notranslate' + (opts.cls ? ' ' + opts.cls : '');
    b.translate = false;
    b.dataset.label = opts.label || 'استمع'; b.dataset.stop = opts.stopLabel || 'إيقاف';
    b.setAttribute('aria-pressed', 'false'); b.setAttribute('aria-label', 'القراءة الصوتية');
    b.innerHTML = '<span aria-hidden="true">🔊</span> <span class="sp-t">' + b.dataset.label + '</span>';
    b.addEventListener('click', () => {
      speak(getText(), b, (m) => {
        let n = b.parentNode.querySelector('.speak-note');
        if (!n) { n = document.createElement('small'); n.className = 'speak-note'; b.insertAdjacentElement('afterend', n); }
        n.textContent = m;
      });
    });
    return b;
  }
  window.addEventListener('pagehide', stop);
  return { ok, speak, stop, button };
})();

/* صفحة الوجهة: زر استمع في الواجهة العلوية */
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page !== 'dest' || !Voice.ok) return;
  const row = document.querySelector('.dest-hero .btn-row');
  if (!row) return;
  const b = Voice.button(() => {
    const h1 = document.querySelector('.dest-hero h1'), lead = document.querySelector('.dest-hero p');
    const panel = document.querySelector('.dest-layout .panel');
    const items = panel ? [...panel.querySelectorAll('p, li, h3')].map((n) => n.textContent) : [];
    return [h1 && h1.textContent, lead && lead.textContent].concat(items).join('. ');
  }, { cls: 'btn ghost' });
  row.insertBefore(b, row.firstChild);
});
