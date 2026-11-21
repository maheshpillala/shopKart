import type { Product } from '../../types/api.types'
import { ProductCard } from './ProductCard'
import { Spinner } from '../ui/Spinner'
import { ErrorMessage } from '../ui/ErrorMessage'
import './ProductGrid.scss'

interface ProductGridProps {
  products: Product[]
  loading: boolean
  error: Error | null
}

export function ProductGrid({ products, loading, error }: ProductGridProps) {
  if (loading) return <Spinner />
  if (error) return <ErrorMessage message={error.message} />
  if (products.length === 0) {
    return (
      <p className="product-grid__empty">No products found.</p>
    )
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
