/* صفحة عن المشروع */
/* أضف أسماء الفريق هنا لتظهر في الصفحة، مثال: { name: 'الاسم', role: 'الدور' } */
const TEAM = [];

document.addEventListener('DOMContentLoaded', () => {
  const st = document.getElementById('about-stats');
  const items = [
    [DESTINATIONS.length, 'وجهة سياحية'], [GOVERNORATES.length, 'محافظة'],
    [DESTINATIONS.filter(d => d.vr).length, 'جولة افتراضية 360°'],
    [(typeof ADVENTURES !== 'undefined' ? ADVENTURES.length : 0), 'نشاط مغامرات'],
    [(typeof CRAFTS !== 'undefined' ? CRAFTS.length : 0), 'حرفة عُمانية'], [17, 'لغة ترجمة']
  ];
  st.innerHTML = items.map(([n, l]) => `<li><b>${n}</b> ${l}</li>`).join('');
  if (TEAM.length) {
    document.getElementById('team-list').innerHTML = TEAM.map(m => `<li><b>${m.name}</b>${m.role ? ' — ' + m.role : ''}</li>`).join('');
    document.getElementById('team-panel').hidden = false;
  }
});
