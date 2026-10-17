import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { routesList } from '../src/routes-data';
import { renderNavbar } from '../src/components/Navbar';
import { renderFooter } from '../src/components/Footer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');

function escapeAttr(str: string): string {
  return str.replace(/"/g, '&quot;');
}

function generateSitemap(routes: typeof routesList): string {
  const today = new Date().toISOString().split('T')[0];
  const urls = routes.map((r) => {
    const loc = `https://kaleemmolani.com${r.path === '/' ? '' : r.path}`;
    const priority = r.path === '/' ? '1.0' : r.path.startsWith('/learnings/') && r.path.split('/').length > 3 ? '0.8' : '0.9';
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
}

async function prerender() {
  console.log('🚀 Starting SSG pre-rendering pipeline...');

  if (!fs.existsSync(TEMPLATE_PATH)) {
    throw new Error(`Base template not found at ${TEMPLATE_PATH}. Did you run "vite build" first?`);
  }

  const baseHtml = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

  for (const route of routesList) {
    const canonicalUrl = `https://kaleemmolani.com${route.path === '/' ? '' : route.path}`;
    const shareImage = route.image || 'https://kaleemmolani.com/images/portrait.jpg';

    // 1. Render layout shell with content
    const pageHtml = `
    ${renderNavbar(route.path)}
    <main class="flex-grow w-full">
      ${route.render()}
    </main>
    ${renderFooter()}
    `;

    // 2. Inject pre-rendered content into <div id="app">
    let renderedHtml = baseHtml.replace(
      '<div id="app" class="flex flex-col min-h-screen"></div>',
      `<div id="app" class="flex flex-col min-h-screen">${pageHtml}</div>`
    );

    // 3. Inject custom meta, title, OG tags and canonical link
    renderedHtml = renderedHtml.replace(
      /<title>.*?<\/title>/,
      `<title>${route.title}</title>`
    );

    renderedHtml = renderedHtml.replace(
      /<meta name="description" content=".*?" \/>/,
      `<meta name="description" content="${escapeAttr(route.description)}" />`
    );

    // Update Open Graph tags
    renderedHtml = renderedHtml.replace(
      /<meta property="og:title" content=".*?" \/>/,
      `<meta property="og:title" content="${escapeAttr(route.title)}" />`
    );
    renderedHtml = renderedHtml.replace(
      /<meta property="og:description" content=".*?" \/>/,
      `<meta property="og:description" content="${escapeAttr(route.description)}" />`
    );
    renderedHtml = renderedHtml.replace(
      /<meta property="og:url" content=".*?" \/>/,
      `<meta property="og:url" content="${canonicalUrl}" />`
    );
    renderedHtml = renderedHtml.replace(
      /<meta property="og:image" content=".*?" \/>/,
      `<meta property="og:image" content="${shareImage}" />`
    );

    // Update Twitter Card tags
    renderedHtml = renderedHtml.replace(
      /<meta name="twitter:title" content=".*?" \/>/,
      `<meta name="twitter:title" content="${escapeAttr(route.title)}" />`
    );
    renderedHtml = renderedHtml.replace(
      /<meta name="twitter:description" content=".*?" \/>/,
      `<meta name="twitter:description" content="${escapeAttr(route.description)}" />`
    );
    renderedHtml = renderedHtml.replace(
      /<meta name="twitter:image" content=".*?" \/>/,
      `<meta name="twitter:image" content="${shareImage}" />`
    );

    // Inject Canonical URL before </head>
    const canonicalTag = `    <link rel="canonical" href="${canonicalUrl}" />\n  </head>`;
    renderedHtml = renderedHtml.replace('</head>', canonicalTag);

    // 4. Output directory & file resolution
    let targetFile: string;
    if (route.path === '/') {
      targetFile = path.join(DIST_DIR, 'index.html');
    } else {
      const cleanPath = route.path.replace(/^\//, '');
      const targetDir = path.join(DIST_DIR, cleanPath);
      fs.mkdirSync(targetDir, { recursive: true });
      targetFile = path.join(targetDir, 'index.html');
    }

    fs.writeFileSync(targetFile, renderedHtml, 'utf-8');
    console.log(`  ✓ Pre-rendered: ${route.path} -> ${path.relative(DIST_DIR, targetFile)}`);
  }

  // 5. Generate and write sitemap.xml
  const sitemapContent = generateSitemap(routesList);
  const sitemapPath = path.join(DIST_DIR, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapContent, 'utf-8');
  console.log(`  ✓ Generated sitemap: ${path.relative(DIST_DIR, sitemapPath)}`);

  console.log(`\n🎉 SSG pre-rendering completed for all ${routesList.length} routes!`);
}

prerender().catch((err) => {
  console.error('❌ SSG pre-render failed:', err);
  process.exit(1);
});
