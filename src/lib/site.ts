import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import defaults from './copy-defaults.json'
type Doc=Record<string,any>
export function localText(value: any, lang: 'vi'|'en', fallback=''):string {return typeof value==='string'?value: typeof value?.[lang]==='string'?value[lang]:fallback}
export function fileURL(value:any,fallback=''):string{return value&&typeof value==='object'&&value.public&&value.url?value.url:fallback}
export async function siteData(preview=false){
 const payload=await getPayload({config})
 const user=preview?(await payload.auth({headers:await headers()})).user:null
 if(preview&&!user)redirect('/admin/login')
 const opts={overrideAccess:false,locale:'all' as const,draft:!!user,depth:2,user:user||undefined}
 const [products,categories,inspirations,store,website,policies]=await Promise.all([
 payload.find({collection:'products',limit:200,sort:'order',...opts}),
 payload.find({collection:'categories',limit:100,sort:'order',...opts}),
 payload.find({collection:'inspirations',limit:50,sort:'order',...opts}),
 payload.findGlobal({slug:'store',...opts}),payload.findGlobal({slug:'website',...opts}),payload.findGlobal({slug:'policies',...opts})
 ])
 const textMap:Record<string,[string,string]>={}
 for(const c of defaults){const v=(website as Doc)[c.key];textMap[c.vi]=[localText(v,'vi',c.vi),localText(v,'en',c.en)]}
 const policy=(key:string,vi:string,en:string)=>{textMap[vi]=[localText((policies as Doc)[key],'vi',vi),localText((policies as Doc)[key],'en',en)]}
 const matches=[['ordering','Xác nhận chiều cao, cân nặng và kích cỡ trước khi đặt hàng. Liên hệ shop qua Zalo hoặc điện thoại để được tư vấn.'],['exchanges','Khách mua tại cửa hàng được hỗ trợ đổi một lần trong ngày. Shop không hoàn lại tiền.'],['shipping','Khách ở xa: giá đơn hàng + 30.000 VNĐ phí ship. Phí ship nếu hoàn hàng: 50.000 VNĐ.'],['shippingNote','Phí hoàn hàng không đồng nghĩa với chính sách hoàn tiền. Phương thức thanh toán và thời gian giao: chờ shop xác nhận.']]
 for(const [key,vi] of matches){const en=defaults.find(c=>c.vi===vi)?.en||vi;policy(key,vi,en)}
 const privacy=defaults.find(c=>c.vi.startsWith('Bản mẫu không yêu cầu'));if(privacy)policy('privacy',privacy.vi,privacy.en)
 const detailPolicy=defaults.find(c=>c.vi.startsWith('Phục vụ Hà Nội và toàn Việt Nam.'))
 if(detailPolicy)textMap[detailPolicy.vi]=(['vi','en'] as const).map(lang=>[localText((policies as Doc).shipping,lang),localText((policies as Doc).exchanges,lang),localText((policies as Doc).shippingNote,lang)].filter(Boolean).join(' ')) as [string,string]
 const cats=categories.docs as Doc[]
 return {preview:!!user,copy:textMap,store:{...store,logo:fileURL((store as Doc).logo,'/assets/brand.jpg'),heroVideo:fileURL((store as Doc).heroVideo,'/assets/home-fashion.mp4'),heroPoster:fileURL((store as Doc).heroPoster)},categories:cats.map(c=>({id:c.id,slug:c.slug,name:[localText(c.name,'vi'),localText(c.name,'en')]})),products:(products.docs as Doc[]).map(p=>({id:p.id,slug:p.slug,name:[localText(p.name,'vi'),localText(p.name,'en')],type:cats.find(c=>c.id===(p.category?.id||p.category))?.slug||'',label:[localText(p.label,'vi'),localText(p.label,'en')],description:[localText(p.description,'vi'),localText(p.description,'en')],composition:[localText(p.composition,'vi'),localText(p.composition,'en')],origin:[localText(p.origin,'vi'),localText(p.origin,'en')],sizeGuide:[localText(p.sizeGuide,'vi'),localText(p.sizeGuide,'en')],care:[localText(p.care,'vi'),localText(p.care,'en')],sizes:p.sizes?.map((s:Doc)=>s.size)||[],price:p.price,illustrative:p.illustrative,availability:p.availability,image:fileURL(p.cover,p.legacyImage||'/assets/brand.jpg'),gallery:p.gallery?.map((x:Doc)=>fileURL(x.image)).filter(Boolean)||[],color:p.color||'#958668'})),inspirations:(inspirations.docs as Doc[]).map(p=>({id:p.id,title:[localText(p.title,'vi'),localText(p.title,'en')],eyebrow:[localText(p.eyebrow,'vi'),localText(p.eyebrow,'en')],image:fileURL(p.image,p.legacyImage),category:cats.find(c=>c.id===(p.category?.id||p.category))?.slug||'all'}))}
}
