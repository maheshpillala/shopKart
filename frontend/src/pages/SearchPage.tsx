import { useSearchParams } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { ProductGrid } from '../components/product/ProductGrid'
import './SearchPage.scss'

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const { data: products = [], isLoading, error } = useProducts(q || undefined)

  if (!q) {
    return (
      <div className="search-empty">
        <p className="search-empty__text">Enter a search term to find products.</p>
      </div>
    )
  }

  return (
    <div className="search-page">
      <h1 className="search-page__heading">
        Results for &ldquo;{q}&rdquo;
      </h1>
      <ProductGrid products={products} loading={isLoading} error={error} />
    </div>
  )
}
