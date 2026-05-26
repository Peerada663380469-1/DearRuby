import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Mail, Calendar, CheckCircle } from 'lucide-react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

import api from '../services/api';

export default function EventsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    guests: '',
    date: '',
    details: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/events/inquiry', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        guestCount: parseInt(formData.guests, 10),
        eventDate: formData.date,
        eventDetails: formData.details
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Failed to submit inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

      {/* Hero */}
      <div className="events-hero" style={{ background: 'url("https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1920&q=80")', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }}></div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto', color: '#F6F4EE' }}>
          <h1 className="hero-title" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, marginBottom: 24 }}>Private Events</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, lineHeight: 1.6, color: '#C8C4B7' }}>
            Host your next corporate gathering, exclusive celebration, or wedding reception with a breathtaking panoramic view of Bangkok.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="events-content mobile-col" style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Info */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 400, marginBottom: 32, color: '#F6F4EE' }}>Bespoke Celebrations</h2>
          <p style={{ color: '#C8C4B7', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: 40 }}>
            Whether it's an intimate gathering in our VIP dining room or a full restaurant buyout for 150 guests, our dedicated events team will ensure every detail is flawless. We offer customizable menus, premium beverage packages, and dedicated staff.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(246, 244, 238, 0.1)', padding: 12, borderRadius: '50%' }}>
                <Users size={24} style={{ color: 'var(--brand-red)' }} />
              </div>
              <div>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 500, marginBottom: 8, color: '#F6F4EE' }}>Capacities</h4>
                <p style={{ color: '#C8C4B7', margin: 0, lineHeight: 1.6 }}>VIP Room: Up to 14 guests<br/>Rooftop Terrace: Up to 40 guests<br/>Full Buyout: Up to 150 guests</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(246, 244, 238, 0.1)', padding: 12, borderRadius: '50%' }}>
                <Calendar size={24} style={{ color: 'var(--brand-red)' }} />
              </div>
              <div>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 500, marginBottom: 8, color: '#F6F4EE' }}>Availability</h4>
                <p style={{ color: '#C8C4B7', margin: 0, lineHeight: 1.6 }}>Events can be booked 7 days a week. Daytime events available upon request.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Inquiry Form Card */}
        <div className="events-form-card" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(246, 244, 238, 0.15)', borderRadius: 'var(--radius-md)', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <CheckCircle size={64} style={{ color: '#10b981', margin: '0 auto 24px' }} />
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 500, marginBottom: 16, color: '#F6F4EE' }}>Inquiry Received</h3>
              <p style={{ color: '#C8C4B7', lineHeight: 1.6 }}>Thank you for your interest in hosting an event at Dear Ruby. Our events manager will contact you within 24 hours.</p>
            </div>
          ) : (
            <>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 500, marginBottom: 32, color: '#F6F4EE' }}>Request a Quote</h3>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="events-form-row">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#C8C4B7', marginBottom: 8, letterSpacing: '0.5px' }}>First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: '#F6F4EE', border: '1px solid rgba(246, 244, 238, 0.15)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#C8C4B7', marginBottom: 8, letterSpacing: '0.5px' }}>Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: '#F6F4EE', border: '1px solid rgba(246, 244, 238, 0.15)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font)' }} />
                  </div>
                </div>
                
                <div className="events-form-row">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#C8C4B7', marginBottom: 8, letterSpacing: '0.5px' }}>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: '#F6F4EE', border: '1px solid rgba(246, 244, 238, 0.15)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#C8C4B7', marginBottom: 8, letterSpacing: '0.5px' }}>Phone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: '#F6F4EE', border: '1px solid rgba(246, 244, 238, 0.15)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font)' }} />
                  </div>
                </div>

                <div className="events-form-row">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#C8C4B7', marginBottom: 8, letterSpacing: '0.5px' }}>Est. Guest Count</label>
                    <input type="number" name="guests" min="1" value={formData.guests} onChange={handleChange} required style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: '#F6F4EE', border: '1px solid rgba(246, 244, 238, 0.15)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#C8C4B7', marginBottom: 8, letterSpacing: '0.5px' }}>Event Date</label>
                    <input type="date" name="date" value={formData.date} onChange={handleChange} required style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: '#F6F4EE', border: '1px solid rgba(246, 244, 238, 0.15)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font)' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#C8C4B7', marginBottom: 8, letterSpacing: '0.5px' }}>Event Details</label>
                  <textarea rows="4" name="details" value={formData.details} onChange={handleChange} required style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: '#F6F4EE', border: '1px solid rgba(246, 244, 238, 0.15)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font)', resize: 'vertical' }} placeholder="Please describe the nature of your event..."></textarea>
                </div>

                <button type="submit" disabled={loading} style={{ background: 'var(--brand-red)', color: '#fff', padding: '16px', borderRadius: 'var(--radius-sm)', border: 'none', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', marginTop: 16, boxShadow: '0 4px 12px rgba(138,30,32,0.3)' }} onMouseOver={e => e.currentTarget.style.background='var(--brand-red-dark)'} onMouseOut={e => e.currentTarget.style.background='var(--brand-red)'}>
                  {loading ? 'Submitting...' : 'Submit Inquiry'}
                </button>
              </form>
            </>
          )}
        </div>

      </div>

      <Footer />
    </div>
  );
}
