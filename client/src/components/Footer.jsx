import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer style={{ background: '#0a0a0a', color: '#C8C4B7', padding: '80px 48px 40px', borderTop: '1px solid rgba(138, 30, 32, 0.3)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '48px', marginBottom: '64px' }}>
        
        {/* Brand & Concept */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 500, marginBottom: '24px', letterSpacing: '1px' }}>About Dear Ruby</h4>
          <p style={{ color: '#a3a3a3', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: '24px' }}>
            Elevating the Mediterranean dining experience above the Bangkok skyline. An intersection of culinary art, fine wine, and sophisticated ambiance.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="https://instagram.com/modtanxyz" target="_blank" rel="noopener noreferrer" style={{ color: '#C8C4B7', transition: '0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.color='var(--brand-red)'} onMouseOut={e => e.currentTarget.style.color='#C8C4B7'}><Instagram size={20} /></a>
            <a href="https://facebook.com/search/top/?q=Peerada%20Mod" target="_blank" rel="noopener noreferrer" style={{ color: '#C8C4B7', transition: '0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.color='var(--brand-red)'} onMouseOut={e => e.currentTarget.style.color='#C8C4B7'}><Facebook size={20} /></a>
            <a href="https://www.youtube.com/watch?v=SHE8rk0l73Y" target="_blank" rel="noopener noreferrer" style={{ color: '#C8C4B7', transition: '0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.color='var(--brand-red)'} onMouseOut={e => e.currentTarget.style.color='#C8C4B7'}><Youtube size={20} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 500, marginBottom: '24px', letterSpacing: '1px' }}>Explore</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><Link to="/menu" style={{ color: '#a3a3a3', textDecoration: 'none', transition: '0.2s', fontSize: '0.9rem' }} onMouseOver={e => e.currentTarget.style.color='var(--brand-red)'} onMouseOut={e => e.currentTarget.style.color='#a3a3a3'}>Food & Beverage Menu</Link></li>
            <li><Link to="/story" style={{ color: '#a3a3a3', textDecoration: 'none', transition: '0.2s', fontSize: '0.9rem' }} onMouseOver={e => e.currentTarget.style.color='var(--brand-red)'} onMouseOut={e => e.currentTarget.style.color='#a3a3a3'}>Our Story & Gallery</Link></li>
            <li><Link to="/events" style={{ color: '#a3a3a3', textDecoration: 'none', transition: '0.2s', fontSize: '0.9rem' }} onMouseOver={e => e.currentTarget.style.color='var(--brand-red)'} onMouseOut={e => e.currentTarget.style.color='#a3a3a3'}>Private Events</Link></li>
            <li><Link to="/" style={{ color: '#a3a3a3', textDecoration: 'none', transition: '0.2s', fontSize: '0.9rem' }} onMouseOver={e => e.currentTarget.style.color='var(--brand-red)'} onMouseOut={e => e.currentTarget.style.color='#a3a3a3'}>Reservations</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 500, marginBottom: '24px', letterSpacing: '1px' }}>Contact Us</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: '#a3a3a3', fontSize: '0.9rem', lineHeight: 1.6 }}>
              <MapPin size={18} style={{ color: 'var(--brand-red)', flexShrink: 0, marginTop: 2 }} />
              <span>45th Floor, The Horizon Tower<br/>Sukhumvit Road, Bangkok 10110</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#a3a3a3', fontSize: '0.9rem' }}>
              <Phone size={18} style={{ color: 'var(--brand-red)', flexShrink: 0 }} />
              <span>+66 (0) 2 123 4567</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#a3a3a3', fontSize: '0.9rem' }}>
              <Mail size={18} style={{ color: 'var(--brand-red)', flexShrink: 0 }} />
              <span>reservations@dearruby.com</span>
            </li>
          </ul>
        </div>

        {/* Hours & Policy */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 500, marginBottom: '24px', letterSpacing: '1px' }}>Hours & Policy</h4>
          <div style={{ color: '#a3a3a3', fontSize: '0.9rem', lineHeight: 1.8 }}>
            <p style={{ marginBottom: '16px' }}>
              <strong style={{ color: 'var(--gold)' }}>Dinner Service:</strong><br/>
              Tuesday - Sunday<br/>
              17:00 - Midnight (Last order 23:00)
            </p>
            <p>
              <strong style={{ color: 'var(--gold)' }}>Dress Code:</strong><br/>
              Smart Casual. Gentlemen are requested to wear closed shoes and long trousers.
            </p>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div style={{ maxWidth: 1200, margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <p style={{ color: '#737373', fontSize: '0.8rem', margin: 0 }}>&copy; {new Date().getFullYear()} Dear Ruby Restaurant & Bar. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="/privacy" style={{ color: '#737373', fontSize: '0.8rem', textDecoration: 'none', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.color='#fff'} onMouseOut={e => e.currentTarget.style.color='#737373'}>Privacy Policy</a>
          <a href="/terms" style={{ color: '#737373', fontSize: '0.8rem', textDecoration: 'none', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.color='#fff'} onMouseOut={e => e.currentTarget.style.color='#737373'}>Terms of Service</a>
          <a href="/admin/login" style={{ color: '#737373', fontSize: '0.8rem', textDecoration: 'none', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.color='#fff'} onMouseOut={e => e.currentTarget.style.color='#737373'}>Staff Login</a>
        </div>
      </div>
    </footer>
  );
}
