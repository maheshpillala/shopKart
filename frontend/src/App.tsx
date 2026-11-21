import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { CategoryPage } from './pages/CategoryPage'
import { SearchPage } from './pages/SearchPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { EnquiryPage } from './pages/EnquiryPage'
import { ThankYouPage } from './pages/ThankYouPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/categories/:name" element={<CategoryPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/products/:id/enquiry" element={<EnquiryPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
      </Route>
    </Routes>
  )
}
