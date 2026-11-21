import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCategories } from '../../hooks/useCategories'
import './Header.scss'

export function Header() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { data: categories = [] } = useCategories()

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`)
      setQuery('')
    }
  }

  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__row">
          {/* Logo */}
          <Link to="/" className="header__logo">
            shopKart
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="header__search-form">
            <div className="header__search-wrap">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="header__search-input"
              />
              <button
                type="submit"
                className="header__search-btn"
                aria-label="Search"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </button>
            </div>
          </form>
        </div>

        {/* Category nav */}
        {categories.length > 0 && (
          <nav className="header__nav">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/categories/${encodeURIComponent(cat)}`}
                className="header__nav-link"
              >
                {cat}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
