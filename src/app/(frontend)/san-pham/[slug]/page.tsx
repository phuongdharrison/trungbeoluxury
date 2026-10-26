import Storefront from '@/components/Storefront'
import { siteData } from '@/lib/site'
import { notFound } from 'next/navigation'
export const dynamic='force-dynamic'
export default async function Page({params,searchParams}:{params:Promise<{slug:string}>,searchParams:Promise<{preview?:string}>}){const {slug}=await params;const q=await searchParams;const data=await siteData(q.preview==='1');if(!data.products.some(p=>p.slug===slug))notFound();return <Storefront data={data} initialSlug={slug}/>}
