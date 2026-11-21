import { useFeaturedProducts } from '../hooks/useFeaturedProducts'
import { ProductGrid } from '../components/product/ProductGrid'
import './HomePage.scss'

export function HomePage() {
  const { data: products = [], isLoading, error } = useFeaturedProducts()

  return (
    <div>
      {/* Hero */}
      <div className="home-hero">
        <h1 className="home-hero__title">Welcome to shopKart</h1>
        <p className="home-hero__subtitle">Discover our hand-picked selection of products</p>
      </div>

      <section className="featured-section">
        <h2 className="featured-section__title">Featured Products</h2>
        <ProductGrid
          products={products}
          loading={isLoading}
          error={error}
        />
      </section>
    </div>
  )
}
