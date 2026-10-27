import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { localText } from '../lib/site'
import CatalogSearch from './CatalogSearch'
export default async function AdminWelcome() {
 const payload = await getPayload({ config })
 const { user } = await payload.auth({ headers: await headers() })
 if (!user) return null
 const options = { overrideAccess: false as const, user, locale: 'all' as const, draft: true, depth: 0, pagination: false, limit: 0 }
 const [products, categories] = await Promise.all([
  payload.find({ collection: 'products', ...options }),
  payload.find({ collection: 'categories', ...options }),
 ])
 const entries = (docs: any[]) => docs.map(doc => ({ id: doc.id, slug: doc.slug, sku: doc.sku,
  name: [localText(doc.name, 'vi'), localText(doc.name, 'en')],
  description: [localText(doc.description, 'vi'), localText(doc.description, 'en')],
  label: [localText(doc.label, 'vi'), localText(doc.label, 'en')], sizes: (doc.sizes || []).map((entry: { size: string }) => entry.size),
  type: categories.docs.find(category => category.id === doc.category)?.slug || '' }))

 return <section className="cms-welcome"><span className="cms-eyebrow">TRUNG BÉO LUXURY · KHÔNG GIAN QUẢN TRỊ</span><h1>Chăm chút cửa hàng của bạn.</h1><p>Thêm sản phẩm, chỉnh nội dung, xem trước rồi đăng khi đã sẵn sàng. Bản nháp được lưu riêng với nội dung đang hiển thị.</p><div className="cms-shortcuts"><a href="/admin/collections/products/create">＋ Thêm sản phẩm</a><a href="/admin/collections/categories">Album & Giới thiệu danh mục</a><a href="/admin/globals/website">Sửa trang chủ</a><a href="/admin/collections/media">Ảnh & Video</a><a href="/" target="_blank" rel="noopener noreferrer">Xem website ↗</a></div><div className="cms-catalog-search"><CatalogSearch products={entries(products.docs)} categories={entries(categories.docs)} lang={0} preview={false} admin /></div></section>
}
