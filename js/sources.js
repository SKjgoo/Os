/* ============================================================
   مراجع الوجهات: روابط للجهات الرسمية للتحقق والاستزادة.
   هذه المراجع تدلّك على الجهة المعتمدة؛ الأوقات والأسعار تتغير، فتحقّق منها قبل الزيارة.
   لإضافة مرجع جديد: أضفه في REF ثم اربطه بالوجهة في by_id أو by_cat.
   ============================================================ */
const REF = {
  mht:   { t: 'وزارة التراث والسياحة', href: 'https://mht.gov.om' },
  exp:   { t: 'بوابة السياحة العُمانية (Experience Oman)', href: 'https://experienceoman.om' },
  unesco:{ t: 'اليونسكو: مواقع التراث العالمي في عُمان', href: 'https://whc.unesco.org/en/statesparties/om' },
  nm:    { t: 'المتحف الوطني', href: 'https://nationalmuseum.gov.om' },
  roh:   { t: 'دار الأوبرا السلطانية مسقط', href: 'https://rohmuscat.org.om' },
  ea:    { t: 'هيئة البيئة', href: 'https://ea.gov.om' },
  met:   { t: 'الأرصاد الجوية العُمانية', href: 'https://met.gov.om' },
  ona:   { t: 'وكالة الأنباء العُمانية', href: 'https://omannews.gov.om' }
};
const REF_BY_ID = {
  'bahla': ['unesco'], 'bat-al-khutm': ['unesco'], 'land-of-frankincense': ['unesco'],
  'al-baleed': ['unesco'], 'khor-rori': ['unesco'], 'nizwa': ['unesco'],
  'national-museum': ['nm'], 'royal-opera': ['roh'],
  'ras-al-jinz': ['ea'], 'wadi-darbat': ['ea'], 'masirah': ['ea'], 'musandam-fjords': ['ea']
};
const REF_BY_CAT = { nature: ['met'], mountain: ['met'], desert: ['met'], sea: ['met'] };

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page !== 'dest' || typeof destById !== 'function') return;
  const d = destById(qs('id'));
  const host = document.querySelector('.dest-layout > div');
  if (!d || !host) return;
  const keys = [...new Set(['mht', 'exp'].concat(REF_BY_ID[d.id] || [], REF_BY_CAT[d.cat] || []))];
  const p = document.createElement('div');
  p.className = 'panel';
  p.innerHTML = '<h2>مراجع رسمية للتحقق</h2>' +
    '<p class="muted">المعلومات هنا ملخّصة للتعريف بالوجهة. للتأكد من المواعيد والأسعار وشروط الدخول راجع الجهات الرسمية:</p>' +
    '<ul class="check-list">' + keys.map(k => `<li><a href="${REF[k].href}" target="_blank" rel="noopener">${REF[k].t}</a></li>`).join('') + '</ul>';
  host.appendChild(p);
});
