import { Link } from 'react-router-dom'
import type { Product } from '../../types/api.types'
import { Badge } from '../ui/Badge'
import './ProductDetail.scss'

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const stars = Math.round(product.rating.rate)

  return (
    <div className="product-detail">
      <div className="product-detail__layout">
        <div className="product-detail__image-panel">
          <img
            src={product.image}
            alt={product.title}
            className="product-detail__image"
          />
        </div>
        <div className="product-detail__info">
          <Badge label={product.category} />
          <h1 className="product-detail__title">{product.title}</h1>
          <div className="product-detail__rating">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`product-detail__star${i < stars ? ' product-detail__star--active' : ''}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="product-detail__rating-text">
              {product.rating.rate} ({product.rating.count} reviews)
            </span>
          </div>
          <p className="product-detail__price">${product.price.toFixed(2)}</p>
          <p className="product-detail__description">{product.description}</p>
          <Link
            to={`/products/${product.id}/enquiry`}
            className="product-detail__cta"
          >
            Make an Enquiry
          </Link>
        </div>
      </div>
    </div>
  )
}
