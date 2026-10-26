import type { GlobalConfig } from 'payload'
import { staff, globalPublishGuard, safeLink, published } from '../access/index'
const common = { access:{read:published,update:staff,readVersions:staff}, versions:{max:30,drafts:{autosave:{interval:1500}}}, hooks:{beforeChange:[globalPublishGuard]} }
export const Store: GlobalConfig = {
 slug:'store',label:'Thông tin cửa hàng',...common,admin:{group:'Website'},fields:[
 {name:'name',label:'Tên cửa hàng',type:'text',required:true,defaultValue:'Trung Béo Luxury'},
 {name:'address',label:'Địa chỉ cửa hàng',type:'text',required:true},
 {name:'phone',label:'Số điện thoại hiển thị',type:'text',required:true},
 {name:'phoneLink',label:'Số điện thoại gọi nhanh — có mã quốc gia',type:'text',required:true,validate:(v:unknown)=>/^\+[0-9]{8,15}$/.test(String(v))||'Ví dụ: +84912067155'},
 {name:'zalo',label:'Đường dẫn Zalo',type:'text',validate:safeLink},
 {name:'facebook',label:'Đường dẫn Facebook',type:'text',validate:safeLink},
 {name:'logo',label:'Logo',type:'upload',relationTo:'media'},
 {name:'heroVideo',label:'Video đầu trang',type:'upload',relationTo:'media'},
 {name:'heroPoster',label:'Ảnh chờ video',type:'upload',relationTo:'media'},
 {name:'seoTitle',label:'Tiêu đề website',type:'text',localized:true},
 {name:'seoDescription',label:'Mô tả tìm kiếm',type:'textarea',localized:true}
 ]
}
export const Policies: GlobalConfig = {
 slug:'policies',label:'Chính sách cửa hàng',...common,admin:{group:'Website'},fields:[
 {name:'ordering',label:'Hướng dẫn đặt hàng & chọn cỡ',type:'textarea',localized:true,required:true},
 {name:'exchanges',label:'Đổi hàng & hoàn tiền',type:'textarea',localized:true,required:true},
 {name:'shipping',label:'Giao hàng & phí vận chuyển',type:'textarea',localized:true,required:true},
 {name:'shippingNote',label:'Lưu ý vận chuyển',type:'textarea',localized:true},
 {name:'privacy',label:'Quyền riêng tư',type:'textarea',localized:true,required:true}
 ]
}
