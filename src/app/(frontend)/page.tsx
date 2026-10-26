import Storefront from '@/components/Storefront'
import { siteData } from '@/lib/site'
export const dynamic='force-dynamic'
export const metadata={title:'Trung Béo Luxury — Lụa & phong cách',description:'Không gian thời trang Trung Béo Luxury.'}
export default async function Page({searchParams}:{searchParams:Promise<{preview?:string}>}){const q=await searchParams;const data=await siteData(q.preview==='1');return <Storefront data={data}/>}
