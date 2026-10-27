'use client';
import React, { useMemo, useState } from 'react';
import { searchCatalog, normalizeSearch } from '../lib/search';

export default function CatalogSearch({ products, categories, lang, preview, admin = false }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const results = useMemo(() => searchCatalog(products, categories, query), [products, categories, query]);
  const t = (vi, en) => lang ? en : vi;
  const href = result => admin ? `/admin/collections/${result.kind === 'product' ? 'products' : 'categories'}/${encodeURIComponent(result.item.id)}` : `${result.kind === 'product' ? '/san-pham/' : '/bo-suu-tap/'}${encodeURIComponent(result.item.slug)}${preview ? '?preview=1' : ''}`;
  return <>
    <h2>{t('Tìm sản phẩm & danh mục', 'Find products & collections')}</h2>
    <form role="search" onSubmit={event => {
      event.preventDefault();
      if (results[active]) window.location.assign(href(results[active]));
    }}>
      <input className="searchinput" autoFocus type="search" value={query}
        placeholder={t('Nhập tên, chữ hoặc số…', 'Type a name, letters or numbers…')}
        aria-label={t('Tìm sản phẩm và danh mục', 'Search products and collections')}
        aria-describedby="catalog-search-status"
        onChange={event => { setQuery(event.target.value); setActive(0); }}
        onKeyDown={event => {
          if (event.nativeEvent.isComposing || event.keyCode === 229) {
            if (event.key === 'Enter') event.preventDefault();
            return;
          }
          if (results.length && ['ArrowDown', 'ArrowUp'].includes(event.key)) {
            event.preventDefault();
            setActive(index => (index + (event.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length);
          }
        }} />
      <button type="submit" className="textlink" disabled={!results.length}>{t('Mở kết quả đã chọn ↗', 'Open selected result ↗')}</button>
    </form>
    <p id="catalog-search-status" role="status">{!normalizeSearch(query)
      ? t('Nhập từ khóa để tìm kiếm.', 'Type to search.')
      : results.length ? `${results.length} ${t('kết quả. Dùng ↑ ↓ để chọn, Enter để mở.', 'results. Use ↑ ↓ to select, Enter to open.')}`
      : t('Không tìm thấy sản phẩm hoặc danh mục phù hợp.', 'No matching products or collections.')}</p>
    <ul className="search-results">{results.map((result, index) => <li key={`${result.kind}-${result.item.id}`}>
      <a className={`searchresult${active === index ? ' search-active' : ''}`} href={href(result)}
        aria-current={active === index ? 'true' : undefined}>
        {result.item.name[lang] || result.item.name[0]} <small>· {result.kind === 'product' ? t('Sản phẩm', 'Product') : t('Danh mục', 'Collection')}</small> ↗
      </a>
    </li>)}</ul>
  </>;
}
