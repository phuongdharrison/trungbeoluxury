import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import Storefront from '../src/components/Storefront'
const categories = ['huong-van-sa', 'jinzhaocheng', 'tourou', 'other-silk'].map((slug, id) => ({
 id, slug, name: [slug, slug], description: ['Giới thiệu\nDòng thứ hai', 'Introduction'],
 gallery: [{ id: 'photo', url: '/api/media/file/photo.jpg', alt: 'Ảnh lụa', caption: ['Chú thích <ảnh>', 'Caption'] }],
}))
const data = { products: [], store: {}, copy: {}, categories, inspirations: [] }
test('all four collection categories link to their own album page', () => {
 const markup = renderToStaticMarkup(React.createElement(Storefront, { data }))
 for (const category of categories) assert.equal(markup.split(`href="/bo-suu-tap/${category.slug}"`).length - 1, 2)
})
test('category album renders introduction, uploaded image and escaped caption', () => {
 const markup = renderToStaticMarkup(React.createElement(Storefront, { data, initialCategorySlug: 'tourou' }))
 assert.ok(markup.includes('Giới thiệu\nDòng thứ hai'))
 assert.ok(markup.includes('src="/api/media/file/photo.jpg"'))
 assert.ok(markup.includes('Chú thích &lt;ảnh&gt;'))
 assert.ok(!markup.includes('class="hero"'))
})
test('empty album has a useful message and preview links retain preview mode', () => {
 const markup = renderToStaticMarkup(React.createElement(Storefront, {
  data: { ...data, preview: true, categories: categories.map(c => ({ ...c, gallery: [] })) }, initialCategorySlug: 'tourou',
 }))
 assert.ok(markup.includes('Album đang được cập nhật'))
 assert.ok(markup.includes('/bo-suu-tap/jinzhaocheng?preview=1'))
})
