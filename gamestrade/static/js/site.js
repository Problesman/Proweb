// JavaScript สำหรับพฤติกรรมทั่วไปของหน้าเว็บ; Alpine.js จัดการสถานะเมนูและตัวกรองใน template
document.addEventListener('htmx:responseError', () => {
  window.alert('ไม่สามารถโหลดรายการได้ กรุณาลองใหม่อีกครั้ง');
});

function updateThemeButton() {
  const dark = document.documentElement.dataset.theme === 'dark';
  document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
    button.setAttribute('aria-pressed', String(dark));
    button.setAttribute('aria-label', dark ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด');
    button.querySelector('[data-theme-icon]').setAttribute('href', dark ? '#icon-sun' : '#icon-moon');
    button.querySelector('[data-theme-label]').textContent = dark ? 'Light' : 'Dark';
  });
}

document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
  button.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('gametrade-theme', next); } catch (_) { /* Browsing without storage still works. */ }
    updateThemeButton();
  });
});
updateThemeButton();
