import { useParams } from 'react-router-dom'
import { useProduct } from '../hooks/useProduct'
import { ProductDetail } from '../components/product/ProductDetail'
import { Spinner } from '../components/ui/Spinner'
import { ErrorMessage } from '../components/ui/ErrorMessage'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: product, isLoading, error } = useProduct(id)

  if (isLoading) return <Spinner />
  if (error) return <ErrorMessage message={error.message} />
  if (!product) return <ErrorMessage message="Product not found." />

  return <ProductDetail product={product} />
}
