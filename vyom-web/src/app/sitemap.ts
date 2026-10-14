import type { MetadataRoute } from 'next';
import { products } from '@/content/products';
import { siteConfig } from '~/site.config';

export const dynamic = 'force-static';

/** Routes live here as they are built. */
const routes = [
  '/',
  '/products',
  ...products.map((product) => `/products/${product.slug}`),
  '/platform',
  '/pricing',
  '/book-demo',
  '/how-we-start',
  '/company',
  '/contact',
  '/privacy',
  '/terms',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((route) => ({
    url: new URL(route, siteConfig.url).toString(),
    lastModified,
  }));
}
