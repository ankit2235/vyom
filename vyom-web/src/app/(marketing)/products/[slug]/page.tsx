import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ProductSlug } from '@/content/products';
import { products } from '@/content/products';
import { ProductPage } from '@/components/product/ProductPage';

type Params = { readonly slug: string };

export function generateStaticParams(): Params[] {
  return products.map((product) => ({ slug: product.slug }));
}

function find(slug: string) {
  return products.find((product) => product.slug === (slug as ProductSlug)) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = find(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = find(slug);
  if (!product) notFound();

  return <ProductPage product={product} />;
}
