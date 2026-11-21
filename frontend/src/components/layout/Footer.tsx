import './Footer.scss'

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        © {new Date().getFullYear()} shopKart. All rights reserved.
      </div>
    </footer>
  )
}
