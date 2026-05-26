import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function StoryPage() {
  const galleryImages = [
    'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80', // Cocktail
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', // Steak
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80', // Restaurant interior
    'https://images.unsplash.com/photo-1581349485608-9469926a8e5e?auto=format&fit=crop&w=800&q=80', // Plating
    'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=800&q=80', // Wine
    'https://images.unsplash.com/photo-1582103287241-2762adba6c36?auto=format&fit=crop&w=800&q=80'  // Night view
  ];

  return (
    <div style={{ position: 'relative', minHeight: '100vh', fontFamily: 'var(--font)', color: '#F6F4EE' }}>
      
      {/* Background Image matching home page */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: -1,
        background: 'linear-gradient(to bottom, rgba(15,5,5,0.85) 0%, rgba(5,5,5,0.95) 100%), url("https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover', backgroundPosition: 'center'
      }}></div>

      {/* Reusable Luxury Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div style={{ padding: '100px 48px', textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3.5rem', fontWeight: 400, marginBottom: 24, color: '#F6F4EE' }}>The Dear Ruby Story</h1>
        <p style={{ color: '#C8C4B7', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: 40 }}>
          Born from a passion for culinary excellence and the vibrant energy of Bangkok. Dear Ruby is more than a dining destination; it is a canvas where Mediterranean traditions meet modern artistry, set against the backdrop of the city's breathtaking skyline.
        </p>
        <p style={{ color: '#C8C4B7', fontSize: '1.1rem', lineHeight: 1.8 }}>
          Executive Chef Alessandro crafted a menu that celebrates seasonal, premium ingredients. Every dish is paired perfectly with our award-winning wine selection, carefully curated by our master sommelier.
        </p>
      </div>

      {/* Gallery Section */}
      <div style={{ padding: '0 48px 100px' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 400, textAlign: 'center', marginBottom: 48, color: '#F6F4EE' }}>The Experience</h2>
        
        <div className="experience-gallery">
          {galleryImages.map((src, index) => (
            <div key={index} style={{ position: 'relative', overflow: 'hidden', paddingTop: '100%', borderRadius: 'var(--radius-md)', background: '#222', border: '1px solid rgba(246, 244, 238, 0.1)' }}>
              <img src={src} alt={`Gallery image ${index + 1}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} onMouseOver={e => e.currentTarget.style.transform='scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform='scale(1)'} />
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
