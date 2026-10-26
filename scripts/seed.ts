export {}
const { getPayload }=await import('payload')
const {default:config}=await import('../src/payload.config')
const {default:copy}=await import('../src/lib/copy-defaults.json')
const payload=await getPayload({config})
try{
 const existing=await payload.count({collection:'categories'})
 if(existing.totalDocs){console.log('Seed skipped: store already contains content.');process.exit(0)}
 const categoryNames=[['huong-van-sa','Sản Phẩm Hương Vân Sa Cao Cấp','Premium Huong Van Sa Products'],['jinzhaocheng','Sản Phẩm Jinzhaocheng','Jinzhaocheng Products'],['tourou','Sản Phẩm Tourou','Tourou Products'],['other-silk','Các Sản Phẩm Tơ Lụa Cao Cấp Khác','Other Premium Silk Products']]
 const cats=[]
 for(const [i,[slug,vi,en]] of categoryNames.entries()){
  const cat=await payload.create({collection:'categories',locale:'vi',data:{name:vi,slug,order:i,_status:'draft'}})
  await payload.update({collection:'categories',id:cat.id,locale:'en',data:{name:en,_status:'published'}});cats.push(cat.id)
 }
 const images=['photo-1539008835657-9e8e9680c956','photo-1595777457583-95e059d581b8','photo-1534528741775-53994a69daeb','photo-1483985988355-763728e1935b']
 const english=['An Nhien Dress','Moc Mien Dress','Thanh Van Top','Tinh Lang Set']
 for(let i=0;i<4;i++){
  const p=await payload.create({collection:'products',locale:'vi',data:{name:categoryNames[i][1],slug:categoryNames[i][0],sku:'TB-00'+(i+1),category:cats[i],label:['ĐẦM DÁNG DÀI','ĐẦM THANH LỊCH','ÁO & PHỐI LỚP','BỘ PHỐI ĐỒ'][i],description:'Mẫu ý tưởng để khám phá phong cách. Hình ảnh chưa đại diện cho sản phẩm đang bán.',illustrative:true,availability:'unconfirmed',legacyImage:`https://images.unsplash.com/${images[i]}?auto=format&fit=crop&w=1100&q=85`,sizes:['S','M','L','XL'].map(size=>({size})),sizeGuide:'S/M/L/XL hiện chỉ là lựa chọn minh họa. Bảng số đo cần được xác nhận theo từng mẫu.',color:['#958668','#522f2e','#33352c','#b4a38b'][i],order:i,_status:'draft'}})
  await payload.update({collection:'products',id:p.id,locale:'en',data:{name:english[i],label:['LONG DRESS','ELEGANT DRESS','TOPS & LAYERS','COORDINATED SET'][i],description:'A concept for exploring your style. Images do not represent an available product.',sizeGuide:'S/M/L/XL are illustrative options. Measurements must be confirmed for each style.',_status:'published'}})
 }
 for(const lang of ['vi','en'] as const){
  const fields=Object.fromEntries(copy.map(c=>[c.key,c[lang]]))
  await payload.updateGlobal({slug:'website',locale:lang,data:{...fields,_status:'published'}})
 }
 await payload.updateGlobal({slug:'store',locale:'vi',data:{name:'Trung Béo Luxury',address:'103 Giang Văn Minh, Đội Cấn, Ba Đình, Hà Nội',phone:'0912 067 155',phoneLink:'+84912067155',zalo:'https://zalo.me/84912067155',facebook:'https://facebook.com/mesa.tere',seoTitle:'Trung Béo Luxury — Lụa & phong cách',seoDescription:'Không gian thời trang Trung Béo Luxury.',_status:'published'}})
 const policyKeys={ordering:'Xác nhận chiều cao, cân nặng và kích cỡ trước khi đặt hàng. Liên hệ shop qua Zalo hoặc điện thoại để được tư vấn.',exchanges:'Khách mua tại cửa hàng được hỗ trợ đổi một lần trong ngày. Shop không hoàn lại tiền.',shipping:'Khách ở xa: giá đơn hàng + 30.000 VNĐ phí ship. Phí ship nếu hoàn hàng: 50.000 VNĐ.',shippingNote:'Phí hoàn hàng không đồng nghĩa với chính sách hoàn tiền. Phương thức thanh toán và thời gian giao: chờ shop xác nhận.'}
 for(const lang of ['vi','en'] as const){
 const pol=Object.fromEntries(Object.entries(policyKeys).map(([key,vi])=>[key,lang==='vi'?vi:copy.find(c=>c.vi===vi)?.en||vi]))
 const privacy=lang==='vi'?'Website không yêu cầu thông tin thanh toán. Mẫu yêu thích lưu trên trình duyệt. Ảnh minh họa và phông chữ có thể được tải từ Unsplash và Google Fonts. Khu quản trị sử dụng cookie để đăng nhập.':'The website does not request payment details. Saved styles are stored in your browser. Illustrations and fonts may load from Unsplash and Google Fonts. The admin area uses cookies for authentication.'
 await payload.updateGlobal({slug:'policies',locale:lang,data:{...pol,privacy,_status:'published'}})
 }
 for(const [i,vi,en,cat] of [[0,'Nhẹ nhàng xuống phố','An effortless day',2],[1,'Một chút kiêu sa','A little radiance',0]] as const){
 const p=await payload.create({collection:'inspirations',locale:'vi',data:{title:vi,eyebrow:i===0?'01 / EVERYDAY POETRY':'02 / AN EVENING TO REMEMBER',legacyImage:`https://images.unsplash.com/${images[i===0?3:1]}?auto=format&fit=crop&w=1100&q=85`,category:cats[cat],order:i,_status:'draft'}})
 await payload.update({collection:'inspirations',id:p.id,locale:'en',data:{title:en,_status:'published'}})
 }
 console.log('Imported existing website: 4 categories, 4 illustrative products, 2 inspirations and website settings. No accounts or passwords created.')
}catch{console.error('Seed failed. Check server configuration; secret values are intentionally omitted.');process.exitCode=1}
await payload.destroy()

process.exit(process.exitCode || 0)
