import type { MetadataRoute } from 'next';
import { siteConfig } from '~/site.config';

export const dynamic = 'force-static';

/** While indexable is false, disallow everything. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: siteConfig.indexable
      ? { userAgent: '*', allow: '/' }
      : { userAgent: '*', disallow: '/' },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
