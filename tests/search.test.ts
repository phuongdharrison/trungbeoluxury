import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeSearch, searchCatalog } from '../src/lib/search'
const products = [
  { id: 1, slug: 'dam-lua-2026', name: ['Đầm Lụa 2026', 'Silk Dress 2026'], sku: 'TBL-001', sizes: ['38'], description: ['Màu xanh'] },
  { id: 2, slug: 'ao-lua', name: ['Áo lụa', 'Silk shirt'] },
]
const categories = [{ id: 1, slug: 'dam', name: ['Đầm', 'Dresses'] }]
test('normalizes uppercase Đ, accents, decomposed Unicode, whitespace and punctuation', () => {
  assert.equal(normalizeSearch('  ĐẦM--LỤA  2026 '), 'dam lua 2026')
})
test('matches every typed prefix, digits, both languages and categories', () => {
  for (const query of ['Đ', 'DA', 'dam l', 'đầm lụa 20', '2026', 'silk dress', '38', 'xanh', 'tbl-001'])
    assert.equal(searchCatalog(products, categories, query).some(r => r.item.id === 1 && r.kind === 'product'), true, query)
  assert.equal(searchCatalog(products, categories, 'dresses')[0].kind, 'category')
})
test('ranks exact names first and accepts reordered words', () => {
  assert.equal(searchCatalog(products, categories, 'dam')[0].kind, 'category')
  assert.equal(searchCatalog(products, categories, '2026 lua')[0].item.id, 1)
})
test('empty, punctuation-only and unmatched searches have no results', () => {
  for (const query of ['', '   ', '---', 'khong co', '2027']) assert.deepEqual(searchCatalog(products, categories, query), [])
})
