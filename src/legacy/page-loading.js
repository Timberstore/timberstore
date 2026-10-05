(function () {
  var root = document.documentElement;
  var timer;
  function showPage() {
    root.classList.remove('timber-page-loading');
    if (timer) window.clearTimeout(timer);
  }
  root.classList.add('timber-page-loading');
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showPage, { once: true });
  } else {
    showPage();
  }
  timer = window.setTimeout(showPage, 1500);
}());