import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/#hero" className="navbar-logo">Arpitha R.</Link>

      <ul className="navbar-links">
        <li><a href="/#about">About</a></li>
        <li><a href="/#skills">Skills</a></li>
        <li><a href="/#experience">Experience</a></li>
        <li><a href="/#projects">Projects</a></li>
        {/* Blog — not live yet, will push later: <li><Link to="/blog">Blog</Link></li> */}
        <li><a href="/#contact" className="navbar-cta">Say Hello</a></li>
      </ul>

      <button 
        className="navbar-hamburger" 
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {menuOpen && (
        <div className="navbar-mobile-menu">
          <a href="/#about" onClick={closeMenu}>About</a>
          <a href="/#skills" onClick={closeMenu}>Skills</a>
          <a href="/#experience" onClick={closeMenu}>Experience</a>
          <a href="/#projects" onClick={closeMenu}>Projects</a>
          {/* Blog — not live yet, will push later: <Link to="/blog" onClick={closeMenu}>Blog</Link> */}
          <a href="/#contact" onClick={closeMenu} className="navbar-cta">Say Hello</a>
        </div>
      )}
    </nav>
  )
}

export default Navbar