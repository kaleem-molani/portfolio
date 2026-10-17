export function renderNavbar(currentPath: string): string {
  // Helpers to determine active styling classes
  const isActive = (path: string) => currentPath === path;
  
  const linkClass = (path: string) => 
    isActive(path) 
      ? 'text-primary border-b-2 border-primary pb-1 font-bold' 
      : 'text-on-surface-variant hover:text-primary transition-colors duration-200';

  return `
    <nav class="bg-background border-b border-outline-variant top-0 z-50 sticky transition-all duration-300 w-full">
      <div class="w-full px-margin-mobile md:px-margin-desktop flex justify-between items-center py-stack-sm relative">
        <!-- Logo and Tagline -->
        <div class="flex flex-col">
          <a class="font-headline-md text-headline-md font-semibold text-on-surface" href="/">
            Build · Break · Learn
          </a>
          <span class="font-label-caps text-label-caps text-on-surface-variant opacity-80" style="font-size: 11px; margin-top: 2px;">
            A systems builder's open notebook
          </span>
        </div>

        <!-- Desktop Navigation & Mode Control -->
        <div class="hidden md:flex gap-gutter items-center font-label-caps text-label-caps">
          <a class="${linkClass('/learnings')}" href="/learnings">Learnings</a>
          <a class="${linkClass('/lab')}" href="/lab">Lab</a>
          <a class="${linkClass('/about')}" href="/about">About</a>
          <a class="${linkClass('/now')}" href="/#now">Now</a>
          
          <!-- Theme Toggle Switch -->
          <button id="theme-toggle" class="theme-toggle-btn" aria-label="Toggle dark mode">
            <span class="material-symbols-outlined" id="theme-toggle-icon">dark_mode</span>
          </button>
        </div>

        <!-- Mobile controls (Hamburger + Theme Toggle) -->
        <div class="flex items-center gap-4 md:hidden">
          <button id="theme-toggle-mobile" class="theme-toggle-btn" aria-label="Toggle dark mode">
            <span class="material-symbols-outlined" id="theme-toggle-icon-mobile">dark_mode</span>
          </button>
          
          <button id="mobile-menu-toggle" class="theme-toggle-btn text-on-surface" aria-label="Toggle menu">
            <span class="material-symbols-outlined" id="menu-icon">menu</span>
          </button>
        </div>

        <!-- Collapsible Mobile Menu Drawer -->
        <div id="mobile-menu" class="absolute top-full left-0 w-full bg-background border-b border-outline-variant flex flex-col p-6 gap-4 z-40 hidden md:hidden shadow-lg">
          <a class="mobile-nav-link ${isActive('/learnings') ? 'active' : ''}" href="/learnings">Learnings</a>
          <a class="mobile-nav-link ${isActive('/lab') ? 'active' : ''}" href="/lab">Lab</a>
          <a class="mobile-nav-link ${isActive('/about') ? 'active' : ''}" href="/about">About</a>
          <a class="mobile-nav-link" href="/#now">Now</a>
        </div>
      </div>
    </nav>
  `;
}

export function initializeNavbar() {
  // Mobile menu toggle logic
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');

  if (mobileToggle && mobileMenu && menuIcon) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = mobileMenu.classList.toggle('active');
      mobileMenu.classList.toggle('hidden', !isActive);
      menuIcon.textContent = isActive ? 'close' : 'menu';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target as Node) && !mobileToggle.contains(e.target as Node)) {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('active');
        menuIcon.textContent = 'menu';
      }
    });

    // Close menu when clicking a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('active');
        menuIcon.textContent = 'menu';
      });
    });
  }

  // Theme toggle logic (both desktop and mobile buttons)
  const setupThemeToggle = (btnId: string, iconId: string) => {
    const toggleBtn = document.getElementById(btnId);
    const toggleIcon = document.getElementById(iconId);

    if (toggleBtn && toggleIcon) {
      // Sync initial icon state
      const updateIcon = () => {
        const isDark = document.documentElement.classList.contains('dark');
        toggleIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
      };
      
      updateIcon();

      toggleBtn.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Sync both toggles
        const desktopIcon = document.getElementById('theme-toggle-icon');
        const mobileIcon = document.getElementById('theme-toggle-icon-mobile');
        if (desktopIcon) desktopIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
        if (mobileIcon) mobileIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
      });
    }
  };

  setupThemeToggle('theme-toggle', 'theme-toggle-icon');
  setupThemeToggle('theme-toggle-mobile', 'theme-toggle-icon-mobile');
}
