import type { Field, GlobalConfig } from 'payload'
import copy from '../lib/copy-defaults.json'
import { staff, globalPublishGuard, published } from '../access/index'
const groups = [
 {label:'Banner & Giới thiệu',test:(s:string)=> /Một nét|Một khí|THE SILK|Dành cho|VẺ ĐẸP|Video đầu|TINH GIẢN|TỰ DO|THANH LỊCH|Thanh lịch,|Một tủ|Hương Vân Sa là|KẾT NỐI/.test(s)},
 {label:'Tiêu đề & Nút',test:(s:string)=>/KHÁM PHÁ|Chọn nét|GỢI Ý|Từ ngày|Nhẹ nhàng|Một chút|Bảo chứng|Tìm một|Tư vấn tại|TRUNG BÉO LUXURY/.test(s)},
 {label:'Liên hệ & Chân trang',test:(s:string)=>/Điện thoại|TƯ VẤN|GỌI CHO|KHÁM PHÁ|CHĂM SÓC|Liên hệ|Câu chuyện|Cảm hứng|HÀ NỘI|Một nét lụa. Một khí/.test(s)},
 {label:'Nhãn giao diện',test:()=>true},
]
const assigned = new Set<string>()
export const Website: GlobalConfig = {
 slug:'website',label:'Trang chủ & Nội dung giao diện', admin:{group:'Website',description:'Chọn tab nội dung rồi sửa tiếng Việt hoặc tiếng Anh ở bộ chọn ngôn ngữ. Xem trước trước khi đăng.'},
 access:{read:published,update:staff,readVersions:staff},versions:{max:30,drafts:{autosave:{interval:1500}}},hooks:{beforeChange:[globalPublishGuard]},
 fields:[{type:'tabs',tabs:groups.map(g=>({label:g.label,fields:copy.filter(c=>{if(assigned.has(c.key)||!g.test(c.vi))return false;assigned.add(c.key);return true}).map(c=>({name:c.key,label:c.vi.length>90?c.vi.slice(0,87)+'…':c.vi,type:c.vi.length>100?'textarea':'text',localized:true,admin:{description:c.vi.length>90?'Nội dung gốc: '+c.vi:undefined}} as Field))}))}],
}
