import type { CollectionConfig } from 'payload'
import { staff, owner, isOwner } from '../access/index'
export const Media: CollectionConfig = {
 slug:'media', labels:{singular:'Ảnh / Video',plural:'Ảnh & Video'}, admin:{useAsTitle:'alt',group:'Nội dung cửa hàng',description:'Kho tệp riêng tư. Chỉ bật “Cho phép hiển thị công khai” cho ảnh/video bạn muốn đưa lên website.'},
 access:{read:({req})=>req.user?true:{public:{equals:true}},create:staff,update:staff,delete:owner},
 upload:{disableLocalStorage:true,mimeTypes:['image/jpeg','image/png','image/webp','video/mp4'], imageSizes:[{name:'card',width:800},{name:'thumbnail',width:180}],adminThumbnail:'thumbnail',filesRequiredOnCreate:true},
 fields:[{name:'alt',label:'Mô tả ảnh / Tên video',type:'text',required:true},{name:'public',label:'Cho phép hiển thị công khai trên website',type:'checkbox',defaultValue:false,access:{create:({req})=>isOwner(req.user),update:({req})=>isOwner(req.user)},admin:{description:'Chỉ chủ cửa hàng có thể bật. Không tải hồ sơ hoặc tài liệu nhạy cảm vào đây.'}},{name:'credit',label:'Nguồn ảnh / Quyền sử dụng',type:'text'},{name:'illustrative',label:'Ảnh minh họa',type:'checkbox',defaultValue:false}],
 hooks:{beforeOperation:[({operation,req,args})=>{if(['create','update'].includes(operation)&&req.file&&req.file.size>4*1024*1024)throw new Error('Tệp tối đa 4 MB ở phiên bản này. Hãy nén ảnh/video trước khi tải lên.');return args}]}
}
