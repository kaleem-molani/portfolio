import { routesList } from './routes-data';
import { renderNavbar, initializeNavbar } from './components/Navbar';
import { renderFooter } from './components/Footer';

let activeTeardown: (() => void) | null = null;

export function navigate(path: string) {
  window.history.pushState(null, '', path);
  handleRoute();
}

// Main routing function
export function handleRoute() {
  // Tear down any active editor listener/instance if navigating away
  if (activeTeardown) {
    try {
      activeTeardown();
    } catch (e) {
      console.error('Error during active editor teardown:', e);
    }
    activeTeardown = null;
  }

  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  // Seamless backward-compatibility: convert legacy hash URLs (e.g. #/about) to clean paths
  if (window.location.hash.startsWith('#/')) {
    const legacyPath = window.location.hash.slice(1);
    window.history.replaceState(null, '', legacyPath);
  }

  // Extract path and normalize trailing slashes
  let pathname = window.location.pathname;
  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }
  if (!pathname) pathname = '/';

  // Handle scroll anchors (e.g. /now -> / with #now, or explicit hash)
  let targetAnchor = '';
  if (pathname === '/now') {
    pathname = '/';
    targetAnchor = 'now';
  } else if (window.location.hash.startsWith('#') && !window.location.hash.startsWith('#/')) {
    targetAnchor = window.location.hash.slice(1);
  }

  const route = routesList.find((r) => r.path === pathname) || routesList.find((r) => r.path === '/')!;

  // Update client document title
  if (route.title) {
    document.title = route.title;
  }

  // Assemble the layout
  appContainer.innerHTML = `
    ${renderNavbar(route.path)}
    <main class="flex-grow w-full">
      ${route.render()}
    </main>
    ${renderFooter()}
  `;

  // Initialize navbar event listeners
  initializeNavbar();

  // Scroll logic for anchors or page top
  if (targetAnchor) {
    setTimeout(() => {
      const element = document.getElementById(targetAnchor);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  } else {
    window.scrollTo({ top: 0 });
  }

  // Mount lab editor if navigating to /lab
  if (route.path === '/lab') {
    const labRoot = document.getElementById('lab-root');
    if (labRoot) {
      import('./lab/diagram-notebook/index')
        .then(({ init }) => {
          activeTeardown = init(labRoot);
        })
        .catch((err) => {
          console.error("Failed to load Diagram Notebook chunk:", err);
          labRoot.innerHTML = `
            <div class="dn-frame p-8 flex flex-col gap-4 text-center">
              <span class="material-symbols-outlined text-primary" style="font-size: 48px;">error</span>
              <h2 class="font-headline-md text-on-surface">Failed to load Editor</h2>
              <p class="font-body-md text-on-surface-variant">There was an issue loading the editor scripts. Please check your network and refresh the page.</p>
            </div>
          `;
        });
    }
  }
}

// Start router
export function initRouter() {
  // Global interceptor for internal links to preserve SPA speed
  document.addEventListener('click', (e) => {
    const anchor = (e.target as HTMLElement).closest('a');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (!href) return;

    // Ignore external links, mailto, tel, target="_blank", or modifier keys (Ctrl/Cmd click)
    if (
      anchor.target === '_blank' ||
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      e.ctrlKey || e.metaKey || e.shiftKey || e.altKey
    ) {
      return;
    }

    // Allow in-page anchor jumps like #now
    if (href.startsWith('#') && !href.startsWith('#/')) {
      return;
    }

    e.preventDefault();
    navigate(href);
  });

  window.addEventListener('popstate', handleRoute);
  window.addEventListener('load', () => {
    // Initial theme check
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    handleRoute();
  });
}
