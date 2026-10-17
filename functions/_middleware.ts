// Cloudflare Pages Edge Middleware
// Intercepts automated vulnerability scanners, exploit probes, and botnets
// Returns immediate 404/403 to halt scanners and prevent SPA index.html fallback loops

interface EventContext {
  request: Request;
  next: () => Promise<Response>;
}

// Patterns frequently targeted by automated vulnerability scanners
const BLOCKED_PATTERNS = [
  // 1. Dotfiles & hidden dirs (.env, .env.local, .git, .vscode, etc.)
  // Note: explicitly allows .well-known for SSL verification/ACME challenges
  /^\/\.(?!well-known\/)/i,

  // 2. Vite dev server file-system traversal and source map exploit probes
  /^\/@fs\b/i,
  /^\/__vite\b/i,
  /^\/__source\b/i,

  // 3. WordPress, PHP, and CMS exploit probes
  /\.php(\?.*)?$/i,
  /^\/wp-(admin|content|includes|login|json)\b/i,
  /^\/xmlrpc\.php/i,

  // 4. Exposed userfiles, cgi-bin, and database managers
  /^\/userfiles\b/i,
  /^\/cgi-bin\b/i,
  /^\/phpmyadmin\b/i,
  /^\/pma\b/i,

  // 5. Database dumps, archives, and backup files
  /\.(sql|bak|backup|old|save|tar|gz|zip|config|ini)(\?.*)?$/i,
];

export const onRequest = async (context: EventContext): Promise<Response> => {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(pathname)) {
      return new Response('404 Not Found', {
        status: 404,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Robots-Tag': 'noindex, nofollow',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      });
    }
  }

  return context.next();
};
