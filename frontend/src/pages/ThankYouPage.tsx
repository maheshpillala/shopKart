import { Link } from 'react-router-dom'
import './ThankYouPage.scss'

export function ThankYouPage() {
  return (
    <div className="thank-you">
      <div className="thank-you__icon-wrap">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="thank-you__title">Thank you for your enquiry!</h1>
      <p className="thank-you__subtitle">We'll be in touch soon.</p>
      <Link to="/" className="thank-you__btn">
        Back to Home
      </Link>
    </div>
  )
}
