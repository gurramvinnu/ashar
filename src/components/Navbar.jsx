import React, { useState, useEffect } from 'react';
import { Pill, Activity, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      const sections = ['home', 'products', 'science', 'distributor'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="logo" onClick={() => handleNavClick('home')}>
        <Pill className="logo-icon animate-pulse" size={28} style={{ color: 'var(--primary)' }} />
        <span style={{ letterSpacing: '0.05em' }}>ASHAR PHARMA</span>
      </div>

      <ul className="nav-links">
        <li>
          <a
            href="#home"
            className={activeSection === 'home' ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="#products"
            className={activeSection === 'products' ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('products');
            }}
          >
            Tablet Catalog
          </a>
        </li>
        <li>
          <a
            href="#science"
            className={activeSection === 'science' ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('science');
            }}
          >
            Formulation & Tech
          </a>
        </li>
        <li>
          <a
            href="#distributor"
            className={activeSection === 'distributor' ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('distributor');
            }}
          >
            Distributors
          </a>
        </li>
      </ul>

      <button className="nav-cta" onClick={() => handleNavClick('distributor')}>
        Request Sample Kit
      </button>

      <button 
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          color: '#fff',
          cursor: 'pointer'
        }}
        className="mobile-menu-btn"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <style>{`
        @media (max-width: 992px) {
          .mobile-menu-btn {
            display: block !important;
          }
          .nav-links {
            display: ${mobileMenuOpen ? 'flex' : 'none'} !important;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: rgba(3, 7, 18, 0.95);
            backdrop-filter: blur(16px);
            padding: 2rem;
            gap: 1.5rem;
            border-bottom: 1px solid var(--glass-border);
            text-align: center;
          }
          .nav-cta {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
}
