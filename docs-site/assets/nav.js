// Sidebar navigation: highlight current page
(function () {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Mobile nav toggle (optional enhancement)
  const nav = document.querySelector('nav');
  if (window.innerWidth <= 768 && nav) {
    nav.style.overflowY = 'visible';
  }
})();
