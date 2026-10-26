import type { CollectionBeforeChangeHook } from 'payload'
export const validatePublishing: CollectionBeforeChangeHook = async ({ data, req, originalDoc, collection }) => {
 if(data._status !== 'published')return data
 let names:Record<string,string>={}
 if(originalDoc?.id){const previous=await req.payload.findByID({collection:collection.slug,id:originalDoc.id,locale:'all',draft:true,depth:0,overrideAccess:true,req});const translated=previous as unknown as {name?:Record<string,string>};names=typeof translated.name==='object'&&translated.name?{...translated.name} as Record<string,string>:{}}
 if(typeof data.name==='string')names[req.locale||'vi']=data.name
 else if(data.name&&typeof data.name==='object')names={...names,...data.name}
 if(!names.vi?.trim()||!names.en?.trim())throw new Error('Hãy bổ sung tên tiếng Việt và tiếng Anh trước khi đăng. Bạn vẫn có thể lưu nháp.')
 if(collection.slug==='products'&&data.illustrative===false&&!data.cover&&!originalDoc?.cover)throw new Error('Hãy chọn ảnh sản phẩm thật trước khi đăng. Nếu đây là ảnh mẫu, bật nhãn minh họa.')
 return data
}
