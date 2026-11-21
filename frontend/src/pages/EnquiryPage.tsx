import { useParams, Link } from 'react-router-dom'
import { useProduct } from '../hooks/useProduct'
import { EnquiryForm } from '../components/forms/EnquiryForm'
import { Spinner } from '../components/ui/Spinner'
import { ErrorMessage } from '../components/ui/ErrorMessage'
import './EnquiryPage.scss'

export function EnquiryPage() {
  const { id } = useParams<{ id: string }>()
  const { data: product, isLoading, error } = useProduct(id)

  if (isLoading) return <Spinner />
  if (error) return <ErrorMessage message={error.message} />
  if (!product) return <ErrorMessage message="Product not found." />

  return (
    <div className="enquiry-page">
      <Link to={`/products/${product.id}`} className="enquiry-page__back">
        ← Back to product
      </Link>

      {/* Product summary */}
      <div className="product-summary">
        <img src={product.image} alt={product.title} className="product-summary__image" />
        <div>
          <p className="product-summary__title">{product.title}</p>
          <p className="product-summary__price">${product.price.toFixed(2)}</p>
        </div>
      </div>

      <h1 className="enquiry-page__heading">Make an Enquiry</h1>
      <EnquiryForm productId={product.id} />
    </div>
  )
}
