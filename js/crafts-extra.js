/* ===== الحرف: القصة + عرض 3D + رمز QR + بطاقة المنتج الذكية + السوق التجريبي ===== */
const CRAFT_STORY = {
  khanjar: { story: 'الخنجر العُماني من أشهر رموز الهوية في السلطنة، ويظهر مع السيفين المتقاطعين في شعار الدولة. يتكوّن من مقبض وغمد منحنٍ مزخرف بالفضة، ويُحزَّم على الخصر بحزام منسوج في المناسبات الرسمية والأعراس.',
    steps: ['صناعة النصل من الحديد وتشكيله.', 'نحت المقبض من القرن أو الخشب.', 'تغليف الغمد بالجلد وتزيينه بخيوط وزخارف الفضة.', 'صنع الحزام المنسوج وتركيب الحلقات.'] },
  silver: { story: 'الحُليّ الفضية جزء من الزينة والتراث في كل منطقة عُمانية، وتختلف أشكالها وزخارفها من محافظة لأخرى. تُصنع القلائد والأساور والخلاخيل وعلب الحرز بطرق الطَّرق والنقش والتشبيك.',
    steps: ['صهر الفضة وسكبها في قوالب.', 'الطَّرق والتشكيل بحسب القطعة.', 'النقش والزخرفة بأدوات دقيقة.', 'التلميع والتشطيب.'] },
  pottery: { story: 'اشتهرت بهلاء بصناعة الفخار من الطين المحلي، وتُشكَّل الجِرار والمباخر والأواني على الدولاب ثم تُحرق في أفران تقليدية. يمكن أن تزور ورشة فخار قريبة وترى المراحل بنفسك.',
    steps: ['تجهيز الطين وتنقيته وعجنه.', 'التشكيل على الدولاب.', 'التجفيف في الظل.', 'الحرق في الفرن ثم التزيين.'] },
  weaving: { story: 'النسيج البدوي (السدو) حرفة نسائية في الأصل، تُغزل فيها خيوط الصوف وشعر الماعز والإبل وتُنسج على النَّول اليدوي بزخارف هندسية. تُصنع منه الخيام والسجاد والوسائد والحقائب.',
    steps: ['جزّ الصوف أو الوبر وتنظيفه.', 'غزل الخيوط وصبغها.', 'شدّ السداة على النول.', 'النسج بحسب التصميم.'] },
  palm: { story: 'يشكّل سعف النخيل مادة بيئية عريقة في عُمان، فتُجدل منه السلال والحُصر والمراوح وأغطية الطعام. هي حرفة متوارثة ومنتجاتها قابلة للتحلل.',
    steps: ['قطع السعف وتجفيفه.', 'تقسيمه إلى شرائح (خوص).', 'صبغ بعضه بالألوان.', 'الجدل بحسب الشكل المطلوب.'] },
  dhow: { story: 'ارتبط تاريخ عُمان بالبحر، وكانت السفن الخشبية (الداو) وسيلتها في التجارة والملاحة. ما زال في صور وصحار حرفيون يبنون السفن بمهارة يدوية متوارثة.',
    steps: ['اختيار الأخشاب.', 'تثبيت الهيكل (القاعدة والأضلاع).', 'تغطية الجسم بالألواح.', 'التقفيل والطلاء والتجهيز.'] },
  incense: { story: 'اللبان من أشهر منتجات ظفار، ويُستخرج كصمغ من شجرة اللبان ثم يُجفَّف ويُصنَّف بحسب لونه. ويُحرق على المباخر للعطر والضيافة، وارتبطت به طرق تجارة قديمة (أرض اللبان).',
    steps: ['خدش لحاء الشجرة ليخرج الصمغ.', 'ترك الصمغ ليجفّ.', 'جمعه وتصنيفه.', 'حرقه على الفحم في المبخرة.'] },
  perfume: { story: 'يُقطَّر ماء الورد من الورد الجبلي في الجبل الأخضر في موسم القطف (غالبًا أبريل)، ويُحفظ في قوارير. وللعُمانيين كذلك تقليد عريق في العود والعطور المركّبة.',
    steps: ['قطف الورد في الصباح الباكر.', 'وضعه في القدر مع الماء.', 'التقطير على نار هادئة.', 'التعبئة في القوارير.'] },
  copper: { story: 'النحاس مرتبط بتاريخ عُمان القديم، ويُصنع منه الدلال (أواني القهوة العُمانية) والصواني. تُطرق القطع يدويًا وتُزيَّن بالنقش.',
    steps: ['قصّ الصفائح النحاسية.', 'الطَّرق والتشكيل.', 'اللحام والتركيب.', 'النقش والتلميع.'] },
  halwa: { story: 'الحلوى العُمانية رمز الضيافة؛ تُطهى لساعات على نار هادئة مع التحريك المستمر، وتُقدَّم مع القهوة في المناسبات والأعياد.',
    steps: ['إذابة السكر وتحضير الشراب.', 'إضافة النشا والسمن.', 'التحريك لساعات حتى القوام المطلوب.', 'إضافة الهيل والزعفران والمكسرات والتبريد.'] },
  embroidery: { story: 'الكمة قبعة مطرّزة تُلبس مع الزي العُماني، وتختلف زخارفها وألوانها بين المناطق. يُطرَّز بعضها يدويًا بخيوط دقيقة وقد يستغرق العمل أيامًا.',
    steps: ['تجهيز القماش والقالب.', 'رسم التصميم.', 'التطريز بالخيط.', 'الخياطة النهائية والكي.'] },
  wood: { story: 'الأبواب والنوافذ والصناديق المنقوشة جزء من العمارة والتجارة العُمانية، وتتميّز بزخارف نباتية وهندسية وتأثّرت بالتجارة مع شرق أفريقيا والهند.',
    steps: ['اختيار الخشب وتجفيفه.', 'القص والتشكيل.', 'النقش اليدوي.', 'التثبيت والتشطيب.'] }
};
const CRAFT_MODEL = { pottery: 'pottery', incense: 'incense', copper: 'copper', perfume: 'perfume', khanjar: 'khanjar' };

document.addEventListener('DOMContentLoaded', () => {
  const $ = (id) => document.getElementById(id);
  const esc = (t) => String(t == null ? '' : t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const craftUrl = (id) => {
    let base = 'https://skjgoo.github.io/Tourism-in-the-Sultanate-of-Oman/crafts.html';
    const path = location.pathname.replace(/[^/]*$/, 'crafts.html');
    if (typeof onProxy === 'function' && onProxy()) base = 'https://' + origHost() + path;
    else if (/^https?:$/.test(location.protocol) && !/^(localhost|127\.)/.test(location.hostname)) base = location.origin + path;
    return base + '?craft=' + id;
  };

  /* ---------- نافذة القصة ---------- */
  const ov = document.createElement('div');
  ov.className = 'craft-modal'; ov.hidden = true; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true');
  ov.innerHTML = '<div class="cm-box"><button type="button" class="cm-x" aria-label="إغلاق">✕</button><div class="cm-body"></div></div>';
  document.body.appendChild(ov);
  let viewer = null;
  function close() { ov.hidden = true; if (viewer) { viewer.stop(); viewer = null; } if (typeof Voice !== 'undefined') Voice.stop(); document.body.classList.remove('cm-open'); }
  ov.addEventListener('click', (e) => { if (e.target === ov || e.target.closest('.cm-x')) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !ov.hidden) close(); });

  function open(id) {
    const c = CRAFTS.find((x) => x.id === id); if (!c) return;
    const st = CRAFT_STORY[id] || { story: c.desc, steps: [] };
    const link = craftUrl(id);
    const body = ov.querySelector('.cm-body');
    const has3d = Craft3D.has(CRAFT_MODEL[id]);
    let qr = ''; try { qr = QR.svg(link, 150); } catch (e) { qr = ''; }
    body.innerHTML = `
      <h2>${esc(c.name)}</h2>
      <div class="cm-grid">
        <div class="cm-3d">${has3d ? '<canvas width="520" height="520" aria-label="مجسّم ثلاثي الأبعاد"></canvas><small class="muted">اسحب لتدوير المجسّم. نموذج مبسّط للتعريف بالشكل.</small>' : '<div class="cm-no3d"><p class="muted">لا يتوفر مجسّم ثلاثي الأبعاد لهذه الحرفة بعد.</p></div>'}</div>
        <div class="cm-text">
          <div class="tag-row"><span class="tag">${esc(c.cat)}</span><span class="tag">${esc(c.material)}</span></div>
          <h3>قصة الحرفة</h3><p class="cm-story">${esc(st.story)}</p>
          ${st.steps.length ? '<h3>كيف تُصنع (باختصار)</h3><ol class="cm-steps">' + st.steps.map((s) => '<li>' + esc(s) + '</li>').join('') + '</ol>' : ''}
          <p><b>أين تجدها:</b> ${esc(c.where.join('، '))}</p>
          <div class="cm-actions"></div>
          <div class="cm-qr"><div>${qr}</div><div><b>رمز QR لهذه الحرفة</b><br><small class="muted">يفتح هذه القصة. يصلح كبطاقة تعريف على المنتج.</small><br><button type="button" class="btn small light" id="cm-copy">انسخ الرابط</button></div></div>
        </div>
      </div>`;
    if (typeof Voice !== 'undefined' && Voice.ok) body.querySelector('.cm-actions').appendChild(Voice.button(() => c.name + '. ' + st.story + ' ' + st.steps.join('. ')));
    $('cm-copy').addEventListener('click', async (e) => { try { await navigator.clipboard.writeText(link); e.target.textContent = 'تم النسخ'; } catch (x) { e.target.textContent = link; } });
    ov.hidden = false; document.body.classList.add('cm-open');
    const cv = body.querySelector('canvas'); if (cv) viewer = Craft3D.create(cv, CRAFT_MODEL[id]);
    ov.querySelector('.cm-x').focus();
  }

  /* أزرار على بطاقات الحرف (تُرسم من crafts.js) */
  document.querySelectorAll('#crafts .item-card').forEach((card, i) => {
    const c = CRAFTS[i]; if (!c) return;
    const row = card.querySelector('.row-actions'); if (!row) return;
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'btn small'; b.textContent = Craft3D.has(CRAFT_MODEL[c.id]) ? 'القصة و3D' : 'القصة';
    b.addEventListener('click', () => { open(c.id); history.replaceState(null, '', '?craft=' + c.id); });
    row.insertBefore(b, row.firstChild);
  });
  const want = new URLSearchParams(location.search).get('craft');
  if (want) open(want);

  /* ---------- السوق الرقمي التجريبي ---------- */
  const mk = $('market-grid');
  if (mk) {
    mk.innerHTML = CRAFTS.map((c) => `
      <article class="item-card mk-card">
        <h3>${esc(c.name)}</h3>
        <div class="tag-row"><span class="tag">${esc(c.cat)}</span><span class="tag">${esc(c.where[0])}</span></div>
        <p>${esc(c.buy)}</p>
        <div class="row-actions"><button type="button" class="btn small" data-order="${c.id}">جهّز رسالة طلب</button></div>
      </article>`).join('');
    mk.addEventListener('click', async (e) => {
      const b = e.target.closest('[data-order]'); if (!b) return;
      const c = CRAFTS.find((x) => x.id === b.dataset.order);
      const msg = `السلام عليكم، أرغب بالاستفسار عن (${c.name}). هل هي متوفرة؟ أرجو إخباري بالسعر والمقاسات وطريقة التوصيل. شكرًا.`;
      try { await navigator.clipboard.writeText(msg); b.textContent = 'تم النسخ، الصقها في واتساب'; } catch (x) { b.textContent = 'انسخ يدويًا'; alert(msg); }
      const d = $('directory'); if (d) d.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ---------- بطاقة المنتج الذكية (QR) ---------- */
  const f = $('tag-form');
  if (f) {
    $('tag-craft').innerHTML = CRAFTS.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join('');
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const d = new FormData(f), c = CRAFTS.find((x) => x.id === d.get('craft'));
      let qr = ''; try { qr = QR.svg(craftUrl(c.id), 140); } catch (x) { /* */ }
      const out = $('tag-card');
      out.hidden = false;
      out.innerHTML = `<div class="tag-inner"><div class="tag-info"><small>بطاقة منتج</small><h3>${esc(d.get('name') || c.name)}</h3>
        <p><b>الحرفة:</b> ${esc(c.name)}</p>${d.get('artisan') ? `<p><b>الحرفي:</b> ${esc(d.get('artisan'))}</p>` : ''}${d.get('place') ? `<p><b>المكان:</b> ${esc(d.get('place'))}</p>` : ''}
        ${d.get('story') ? `<p>${esc(d.get('story'))}</p>` : ''}<small>امسح الرمز لقراءة قصة الحرفة</small></div><div class="tag-qr">${qr}</div></div>`;
      $('tag-print').hidden = false;
    });
    $('tag-print').addEventListener('click', () => window.print());
  }
});
