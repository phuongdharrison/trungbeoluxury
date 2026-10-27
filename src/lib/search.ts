export function normalizeSearch(value: unknown): string {
  return String(value ?? '').normalize('NFD').toLowerCase()
    .replace(/\p{M}/gu, '').replace(/đ/g, 'd')
    .replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ')
}

type Item = { id: string | number; slug: string; name: string[]; label?: string[]; description?: string[]; type?: string; sizes?: string[]; sku?: string }
export function searchCatalog(products: Item[], categories: Item[], query: string) {
  const term = normalizeSearch(query)
  if (!term) return []
  const tokens = term.split(' ')
  const entries = [
    ...products.map(item => ({ item, kind: 'product' as const })),
    ...categories.map(item => ({ item, kind: 'category' as const })),
  ]
  return entries.map(entry => {
    const { item } = entry
    const names = item.name.map(normalizeSearch)
    const title = normalizeSearch([...item.name, item.slug].join(' '))
    const text = normalizeSearch([title, ...(item.label || []), ...(item.description || []), ...(item.sizes || []), item.type, item.sku].join(' '))
    const score = names.includes(term) ? 0 : names.some(name => name.startsWith(term)) ? 1 : title.includes(term) ? 2 : 3
    return { ...entry, score, matches: tokens.every(token => text.includes(token)) }
  }).filter(entry => entry.matches).sort((a, b) => a.score - b.score)
}
