import type { APIRoute } from 'astro';
import { projects } from '../data/projects';

const siteOrigin = 'https://amansharma-it5.github.io';

export const GET: APIRoute = () => {
  const routes = ['/', '/projects/', ...projects.map((project) => `/projects/${project.slug}/`)].sort();
  const urls = routes.map((route) => `  <url><loc>${siteOrigin}${route}</loc></url>`).join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
};
