import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer, loadEnv } from 'vite';

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(projectDir, 'dist');
const fileEnv = loadEnv('production', projectDir, '');
const productionHost = process.env.SITE_URL || fileEnv.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) || 'https://gst-hsn-sac-api.vercel.app';
const siteUrl = new URL(productionHost);

const escapeXml = (value) => value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const template = await fs.readFile(path.join(distDir, 'index.html'), 'utf8');
const vite = await createServer({ root: projectDir, server: { middlewareMode: true }, appType: 'custom', mode: 'production' });

try {
  const { AppContent } = await vite.ssrLoadModule('/src/App.jsx');
  const { GUIDES } = await vite.ssrLoadModule('/src/content/guidesData.js');

  const mainPages = [
    {
      route: '/',
      file: path.join(distDir, 'index.html'),
      title: 'India GST HSN & SAC Code Lookup API — Free, Keyless Developer REST API',
      description: 'Free, keyless search across 16,825 HSN goods records and 568 SAC service records in a community-maintained classification dataset. Tax rates are not supplied.'
    },
    {
      route: '/chapters',
      file: path.join(distDir, 'chapters', 'index.html'),
      title: 'GST Tariff Chapters Directory — India GST HSN & SAC API',
      description: 'Browse 98 HSN chapter records and paginated goods classifications from a community-maintained dataset.'
    },
    {
      route: '/docs',
      file: path.join(distDir, 'docs', 'index.html'),
      title: 'API Documentation & Endpoints — India GST HSN & SAC API',
      description: 'Developer reference for HSN/SAC classification search, exact lookup, and chapter browsing.'
    },
    {
      route: '/guides',
      file: path.join(distDir, 'guides', 'index.html'),
      title: 'Classification Guides — India GST HSN & SAC API',
      description: 'Practical HSN/SAC dataset search, code structure, and goods-versus-services routing guides.'
    },
    {
      route: '/status',
      file: path.join(distDir, 'status', 'index.html'),
      title: 'Service Status & Health — India GST HSN & SAC API',
      description: 'Live uptime and operational status of India GST HSN and SAC Code Lookup API endpoints.'
    }
  ];

  const guidePages = GUIDES.map((g) => ({
    route: `/guides/${g.id}`,
    file: path.join(distDir, 'guides', g.id, 'index.html'),
    title: `${g.title} — India GST API`,
    description: g.summary
  }));

  const allPages = [...mainPages, ...guidePages];

  for (const page of allPages) {
    const body = renderToString(React.createElement(MemoryRouter, { initialEntries: [page.route] }, React.createElement(AppContent)));
    const canonical = new URL(page.route, siteUrl).href;
    const html = template
      .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
      .replace(/<title>[^<]*<\/title>/, `<title>${escapeXml(page.title)}</title>`)
      .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeXml(page.description)}" />`)
      .replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${escapeXml(canonical)}" />`)
      .replace(/<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${escapeXml(canonical)}" />`);

    await fs.mkdir(path.dirname(page.file), { recursive: true });
    await fs.writeFile(page.file, html);
  }

  // 404.html: Vercel serves it with status 404 for any path no file or rewrite matches.
  // noindex, no canonical, and kept out of allPages so it never reaches the sitemap.
  const notFoundBody = renderToString(React.createElement(MemoryRouter, { initialEntries: ['/__not-found__'] }, React.createElement(AppContent)));
  const notFoundHtml = template
    .replace('<div id="root"></div>', `<div id="root">${notFoundBody}</div>`)
    .replace(/<title>[^<]*<\/title>/, '<title>Page not found — GST HSN/SAC Classification API</title>')
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, '<meta name="description" content="This page does not exist." />')
    .replace(/\s*<link rel="canonical" href="[^"]*"\s*\/?>/, '')
    .replace(/\s*<meta property="og:url" content="[^"]*"\s*\/?>/, '')
    .replace('</head>', '  <meta name="robots" content="noindex" />\n  </head>');
  await fs.writeFile(path.join(distDir, '404.html'), notFoundHtml);

  // Generate sitemap.xml with all canonical pages
  const sitemapEntries = allPages.map((page) => {
    const loc = new URL(page.route, siteUrl).href;
    const priority = page.route === '/' ? '1.0' : page.route.startsWith('/guides/') ? '0.8' : '0.9';
    return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>2026-09-27</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  }).join('\n');

  await fs.writeFile(
    path.join(distDir, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`
  );

  // Generate robots.txt
  await fs.writeFile(
    path.join(distDir, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl.href}sitemap.xml\n`
  );

  console.log(`Prerendered ${allPages.length} routes into static HTML and generated sitemap.xml.`);
} finally {
  await vite.close();
}
