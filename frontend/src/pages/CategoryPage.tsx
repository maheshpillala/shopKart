import { useParams } from 'react-router-dom'
import { useCategoryProducts } from '../hooks/useCategoryProducts'
import { ProductGrid } from '../components/product/ProductGrid'
import './CategoryPage.scss'

export function CategoryPage() {
  const { name = '' } = useParams<{ name: string }>()
  const { data: products = [], isLoading, error } = useCategoryProducts(name)

  return (
    <div className="category-page">
      <h1 className="category-page__heading">{decodeURIComponent(name)}</h1>
      <ProductGrid products={products} loading={isLoading} error={error} />
    </div>
  )
}
