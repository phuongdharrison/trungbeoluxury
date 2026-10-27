import React from 'react'
import type { ListViewServerProps } from 'payload'

/** Keep the album list server-rendered: the upstream sortable table crashes
 * during authenticated rendering when its list-query context is absent. */
export default function CategoryAlbumList({ data, hasCreatePermission, newDocumentURL, searchParams, locale }: ListViewServerProps) {
 const params = new URLSearchParams()
 for (const [key, value] of Object.entries(searchParams || {})) {
  if (typeof value === 'string') params.set(key, value)
 }
 const href = (changes: Record<string, string>) => {
  const next = new URLSearchParams(params)
  for (const [key, value] of Object.entries(changes)) next.set(key, value)
  return '?' + next.toString()
 }
 const text = (value: unknown) => {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object') {
   const translations = value as Record<string, unknown>
   const translated = translations[locale?.code || 'vi'] || translations.vi
   return typeof translated === 'string' ? translated : ''
  }
  return ''
 }
 return <section className="album-admin-list">
  <div className="album-admin-heading"><div><h1>Album & Giới thiệu danh mục</h1><p>Chọn danh mục để thêm ảnh, sắp xếp album và viết phần giới thiệu.</p></div>
   {hasCreatePermission && <a className="album-admin-button" href={newDocumentURL}>＋ Thêm danh mục</a>}
  </div>
  <form method="get" className="album-admin-search">
   <label htmlFor="album-search">Tìm danh mục</label>
   <input id="album-search" type="search" name="search" defaultValue={params.get('search') || ''} />
   {Array.from(params).filter(([key]) => !['search', 'page'].includes(key)).map(([key, value]) => <input key={key} type="hidden" name={key} value={value} />)}
   <button type="submit">Tìm kiếm</button>
  </form>
  <nav className="album-admin-sort" aria-label="Sắp xếp danh mục"><span>Sắp xếp:</span><a href={href({sort:'order', page:'1'})}>Thứ tự hiển thị</a><a href={href({sort:'name', page:'1'})}>Tên danh mục</a></nav>
  <p>{data.totalDocs} danh mục</p>
  <div className="album-admin-rows">
   {data.docs.map((doc: { id: number | string; name?: unknown; slug?: string; order?: number; _status?: string }) => <article key={doc.id}>
    <div><h2><a href={`/admin/collections/categories/${encodeURIComponent(doc.id)}`}>{text(doc.name) || doc.slug}</a></h2>
     <p>{doc._status === 'published' ? 'Đã đăng' : 'Bản nháp'} · Thứ tự: {doc.order ?? 0}</p>
    </div>
    <a className="album-admin-button" href={`/admin/collections/categories/${encodeURIComponent(doc.id)}`}>Sửa album & giới thiệu →</a>
   </article>)}
   {!data.docs.length && <p>Không tìm thấy danh mục phù hợp.</p>}
  </div>
  {(data.hasPrevPage || data.hasNextPage) && <nav className="album-admin-sort" aria-label="Phân trang">
   {data.hasPrevPage && <a href={href({page: String(data.prevPage)})}>← Trang trước</a>}
   <span>Trang {data.page} / {data.totalPages}</span>
   {data.hasNextPage && <a href={href({page: String(data.nextPage)})}>Trang tiếp →</a>}
  </nav>}
 </section>
}
