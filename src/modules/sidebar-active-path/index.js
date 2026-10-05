import { SEL } from '../../core/selectors.js';

let delayedRefreshScheduled = false;

function normalizePath(url) {
  try {
    const path = new URL(url, window.location.origin).pathname.replace(/\/+$/, '').toLowerCase();
    return path || '/';
  } catch {
    return '';
  }
}

function markSidebarPath() {
  const root = document.querySelector(SEL.categoryTree);
  if (!root) return;

  root.querySelectorAll('.timber-parent-link, .timber-current-link').forEach((link) => {
    link.classList.remove('timber-parent-link', 'timber-current-link');
  });

  const currentPath = normalizePath(window.location.href);
  const parentPaths = new Set();

  document.querySelectorAll(SEL.breadcrumbLinks).forEach((link) => {
    const path = normalizePath(link.href);
    if (path && path !== '/' && path !== currentPath) parentPaths.add(path);
  });

  root.querySelectorAll('a[href]').forEach((link) => {
    const path = normalizePath(link.href);
    if (!path) return;

    if (path === currentPath) {
      link.classList.add('timber-current-link');
    } else if (parentPaths.has(path)) {
      link.classList.add('timber-parent-link');
    }
  });
}

export default {
  name: 'sidebar-active-path',
  pages: ['category'],
  init() {
    markSidebarPath();

    // Apollo can finish its category tree shortly after DOMContentLoaded.
    if (!delayedRefreshScheduled) {
      delayedRefreshScheduled = true;
      setTimeout(markSidebarPath, 100);
      setTimeout(markSidebarPath, 500);
    }
  },
};
