import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { ListViewServerProps } from 'payload'
import CategoryAlbumList from '../src/components/CategoryAlbumList'
import { Categories } from '../src/collections/Catalog'
function props(extra = {}) {
 return { data: { docs: [{id: 1, name:'Hương Vân Sa', slug:'huong-van-sa', order:0, _status:'published'}], totalDocs:1, page:1, totalPages:1 }, hasCreatePermission:false, newDocumentURL:'/admin/collections/categories/create', searchParams:{locale:'vi'}, locale:{code:'vi'}, ...extra } as unknown as ListViewServerProps
}
test('authenticated category list does not render the crashing upstream table', () => {
 function BrokenTable(): never { throw new Error('Cannot destructure sort of undefined') }
 const markup=renderToStaticMarkup(React.createElement(CategoryAlbumList,props({Table:React.createElement(BrokenTable)})))
 assert.ok(markup.includes('Hương Vân Sa'))
 assert.ok(markup.includes('/admin/collections/categories/1'))
 assert.ok(markup.includes('Sửa album &amp; giới thiệu'))
 assert.equal(Categories.admin?.components?.views?.list?.Component,'/components/CategoryAlbumList#default')
})
test('list respects create permission and preserves locale in sorting links', () => {
 const denied=renderToStaticMarkup(React.createElement(CategoryAlbumList,props()))
 assert.ok(!denied.includes('＋ Thêm danh mục'))
 assert.ok(denied.includes('?locale=vi&amp;sort=order&amp;page=1'))
 const allowed=renderToStaticMarkup(React.createElement(CategoryAlbumList,props({hasCreatePermission:true})))
 assert.ok(allowed.includes('href="/admin/collections/categories/create"'))
})
test('empty category search renders safely and escapes the search query', () => {
 const markup=renderToStaticMarkup(React.createElement(CategoryAlbumList,props({data:{docs:[],totalDocs:0},searchParams:{search:'<script>test</script>'}})))
 assert.ok(markup.includes('Không tìm thấy danh mục phù hợp'))
 assert.ok(!markup.includes('<script>'))
})
