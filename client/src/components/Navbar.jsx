import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Menu, X } from 'lucide-react';

export default function Navbar({ onReservationsClick, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleReservations = () => {
    if (onReservationsClick) {
      onReservationsClick();
    } else {
      // If we are on another page, navigate to Home and trigger Reservations modal via state
      navigate('/', { state: { openReservations: true } });
    }
  };

  return (
    <div className="navbar-wrapper">
      {/* The Horizontal Ribbon Line */}
      <nav className="navbar-ribbon">
        
        {/* Logo Intersecting the Ribbon */}
        <div className="navbar-logo-container">
          <Link to="/">
            <img 
              className="navbar-logo-img"
              src="/images/logo-transparent.png" 
              alt="Dear Ruby" 
              onError={(e) => { 
                e.target.style.display = 'none'; 
                if (e.target.nextSibling) e.target.nextSibling.style.display = 'block'; 
              }} 
            />
            <span style={{ display: 'none', fontFamily: 'var(--font-script)', fontSize: '4.5rem', fontWeight: 400, color: 'var(--text-primary)' }}>Dear Ruby</span>
          </Link>
        </div>
        
        {/* Navigation Items inside the Ribbon */}
        <div className="navbar-content">
          
          <div className="desktop-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link 
              to="/" 
              style={{ 
                color: '#F6F4EE', 
                fontWeight: 600, 
                fontSize: '0.85rem', 
                letterSpacing: '2px', 
                textTransform: 'uppercase', 
                transition: '0.2s', 
                textDecoration: 'none' 
              }} 
              onMouseOver={e => e.currentTarget.style.color = 'var(--gold)'} 
              onMouseOut={e => e.currentTarget.style.color = '#F6F4EE'}
            >
              Home
            </Link>
            <span style={{ color: 'var(--brand-red)', fontSize: '1.2rem', opacity: 0.6 }}>•</span>
            <Link 
              to="/menu" 
              style={{ 
                color: '#F6F4EE', 
                fontWeight: 600, 
                fontSize: '0.85rem', 
                letterSpacing: '2px', 
                textTransform: 'uppercase', 
                transition: '0.2s', 
                textDecoration: 'none' 
              }} 
              onMouseOver={e => e.currentTarget.style.color = 'var(--gold)'} 
              onMouseOut={e => e.currentTarget.style.color = '#F6F4EE'}
            >
              Menu
            </Link>
            <span style={{ color: 'var(--brand-red)', fontSize: '1.2rem', opacity: 0.6 }}>•</span>
            <Link 
              to="/story" 
              style={{ 
                color: '#F6F4EE', 
                fontWeight: 600, 
                fontSize: '0.85rem', 
                letterSpacing: '2px', 
                textTransform: 'uppercase', 
                transition: '0.2s', 
                textDecoration: 'none' 
              }} 
              onMouseOver={e => e.currentTarget.style.color = 'var(--gold)'} 
              onMouseOut={e => e.currentTarget.style.color = '#F6F4EE'}
            >
              Our Story
            </Link>
            <span style={{ color: 'var(--brand-red)', fontSize: '1.2rem', opacity: 0.6 }}>•</span>
            <Link 
              to="/events" 
              style={{ 
                color: '#F6F4EE', 
                fontWeight: 600, 
                fontSize: '0.85rem', 
                letterSpacing: '2px', 
                textTransform: 'uppercase', 
                transition: '0.2s', 
                textDecoration: 'none' 
              }} 
              onMouseOver={e => e.currentTarget.style.color = 'var(--gold)'} 
              onMouseOut={e => e.currentTarget.style.color = '#F6F4EE'}
            >
              Private Event
            </Link>
          </div>
          
          {/* Mobile Hamburger Button */}
          <button 
            className="mobile-menu-btn"
            style={{ display: 'none', background: 'none', border: 'none', color: '#F6F4EE', cursor: 'pointer', marginLeft: 'auto' }}
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={28} />
          </button>
          
          <div className="navbar-right-wrapper" style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', gap: '32px' }}>
            <div className="navbar-actions">
              {/* Render any page-specific injection (like Shopping Cart on POSPage) */}
              {children}
            </div>
            
            <div className="desktop-nav-right" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>

            <button 
              onClick={handleReservations} 
              style={{ 
                background: 'var(--brand-red)', 
                color: '#fff', 
                padding: '10px 28px', 
                borderRadius: 'var(--radius-sm)', 
                border: 'none', 
                fontWeight: 600, 
                fontSize: '0.85rem', 
                letterSpacing: '2px', 
                textTransform: 'uppercase', 
                cursor: 'pointer', 
                transition: '0.2s', 
                boxShadow: '0 4px 12px rgba(138,30,32,0.3)' 
              }} 
              onMouseOver={e => { e.currentTarget.style.background = 'var(--brand-red-dark)'; }} 
              onMouseOut={e => { e.currentTarget.style.background = 'var(--brand-red)'; }}
            >
              Reservations
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', borderLeft: '1px solid rgba(246, 244, 238, 0.2)', paddingLeft: '24px' }}>
              <a href="https://www.youtube.com/watch?v=SHE8rk0l73Y" target="_blank" rel="noopener noreferrer" style={{ display: 'flex' }}>
                <Youtube 
                  size={18} 
                  color="#C8C4B7" 
                  style={{ cursor: 'pointer', transition: '0.2s' }} 
                  onMouseOver={e => e.currentTarget.style.color = 'var(--gold)'} 
                  onMouseOut={e => e.currentTarget.style.color = '#C8C4B7'} 
                />
              </a>
              <a href="https://facebook.com/search/top/?q=Peerada%20Mod" target="_blank" rel="noopener noreferrer" style={{ display: 'flex' }}>
                <Facebook 
                  size={18} 
                  color="#C8C4B7" 
                  style={{ cursor: 'pointer', transition: '0.2s' }} 
                  onMouseOver={e => e.currentTarget.style.color = 'var(--gold)'} 
                  onMouseOut={e => e.currentTarget.style.color = '#C8C4B7'} 
                />
              </a>
              <a href="https://instagram.com/modtanxyz" target="_blank" rel="noopener noreferrer" style={{ display: 'flex' }}>
                <Instagram 
                  size={18} 
                  color="#C8C4B7" 
                  style={{ cursor: 'pointer', transition: '0.2s' }} 
                  onMouseOver={e => e.currentTarget.style.color = 'var(--gold)'} 
                  onMouseOut={e => e.currentTarget.style.color = '#C8C4B7'} 
                />
              </a>
            </div>
          </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div 
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: '280px',
          background: 'var(--bg-modal)', backdropFilter: 'blur(10px)',
          zIndex: 200, padding: '32px 24px', display: 'flex', flexDirection: 'column',
          transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-in-out',
          boxShadow: '-10px 0 40px rgba(0,0,0,0.5)'
        }}
      >
        <button onClick={() => setIsMobileMenuOpen(false)} style={{ alignSelf: 'flex-end', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', marginBottom: '32px' }}>
          <X size={28} />
        </button>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase' }}>Home</Link>
          <Link to="/menu" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase' }}>Menu</Link>
          <Link to="/story" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase' }}>Our Story</Link>
          <Link to="/events" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase' }}>Private Event</Link>
          
          <button 
            onClick={() => { setIsMobileMenuOpen(false); handleReservations(); }} 
            style={{ 
              background: 'var(--brand-red)', color: '#fff', padding: '14px', borderRadius: 'var(--radius-sm)', 
              fontWeight: 600, fontSize: '1rem', textTransform: 'uppercase', cursor: 'pointer', marginTop: '16px' 
            }}
          >
            Reservations
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 190 }}
        />
      )}
    </div>
  );
}
