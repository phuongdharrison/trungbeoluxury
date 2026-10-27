import Storefront from '@/components/Storefront'
import { siteData } from '@/lib/site'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
export default async function Page({ params, searchParams }: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ preview?: string }>
}) {
  const { slug } = await params
  const query = await searchParams
  const data = await siteData(query.preview === '1')
  if (!data.categories.some(category => category.slug === slug)) notFound()
  return <Storefront data={data} initialCategorySlug={slug} />
}
