import type { MetadataRoute } from 'next';
import { products } from '@/content/products';
import { siteConfig } from '~/site.config';

// Required by output: 'export' — these are generated once at build time.
export const dynamic = 'force-static';

/** Routes live here as they are built. */
const routes = [
  '/',
  '/products',
  ...products.map((product) => `/products/${product.slug}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((route) => ({
    url: new URL(route, siteConfig.url).toString(),
    lastModified,
  }));
}
