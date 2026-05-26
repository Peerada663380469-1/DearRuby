import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { X, Plus, Minus, Facebook, Instagram, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function ReservationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'guests', 'date', 'time', 'service'
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [babies, setBabies] = useState(0);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [serviceType, setServiceType] = useState(null);

  const times = ['5:00 pm', '5:30 pm', '6:00 pm', '6:30 pm', '7:00 pm', '7:30 pm', '8:00 pm', '8:30 pm', '9:00 pm', '9:30 pm', '10:00 pm', '10:30 pm', '11:00 pm', '11:30 pm'];

  const closeModals = () => setActiveModal(null);

  const handleBook = (type) => {
    const finalServiceType = type || serviceType;
    if (!finalServiceType) {
      setActiveModal('service');
      return;
    }
    // Proceed to menu page for ordering
    navigate('/menu', { state: { date: selectedDate, time: selectedTime, guests: adults + children, serviceType: finalServiceType } });
  };

  useEffect(() => {
    if (location.state?.openReservations) {
      setActiveModal('guests');
      // Clear location state to prevent modal from reopening on subsequent refreshes
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  return (
    <div className="landing-page" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Background Image */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: -1,
        background: 'linear-gradient(to bottom, rgba(15,5,5,0.6) 0%, rgba(5,5,5,0.9) 100%), url("https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover', backgroundPosition: 'center', filter: 'contrast(1.1) brightness(1.1)'
      }}></div>

      {/* Reusable Luxury Navbar */}
      <Navbar onReservationsClick={() => setActiveModal('guests')} />

      {/* Center Content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 120px)', paddingBottom: '80px' }}>
        
        <p style={{ fontFamily: 'var(--font-serif)', color: '#F6F4EE', fontSize: '1.6rem', fontStyle: 'italic', textShadow: '0 2px 8px rgba(0,0,0,0.8)', marginBottom: 16, textAlign: 'center', letterSpacing: '1px' }}>
          An unforgettable journey of flavors above the city lights
        </p>

        {/* Decorative Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '24px 0 40px', opacity: 0.8 }}>
          <div style={{ width: 80, height: 1, background: 'var(--border)' }}></div>
          <div style={{ width: 6, height: 6, transform: 'rotate(45deg)', background: 'var(--brand-red)' }}></div>
          <div style={{ width: 80, height: 1, background: 'var(--border)' }}></div>
        </div>

        <div className="home-action-buttons">
          <button className="home-btn-primary" onClick={() => setActiveModal('guests')}>
            RESERVATIONS
          </button>
          <button className="home-btn-secondary" onClick={() => navigate('/menu')}>
            VIEW MENU
          </button>
        </div>

        {/* Info Widget */}
        <div className="home-info-widget">
          <div className="info-item">
            <span className="info-label">Opening Hours</span>
            <span>17:00 - Midnight</span>
          </div>
          <div className="info-separator"></div>
          <div className="info-item">
            <span className="info-label">Dress Code</span>
            <span>Smart Elegance</span>
          </div>
          <div className="info-separator"></div>
          <div className="info-item">
            <span className="info-label">Location</span>
            <span>Rooftop, 45th Floor</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {/* GUESTS MODAL */}
        {activeModal === 'guests' && (
          <div className="dark-modal-overlay" onClick={closeModals}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="dark-modal" onClick={e => e.stopPropagation()}>
              <div className="dark-modal-header">
                <h2 className="dark-modal-title">Guests</h2>
                <button className="dark-modal-close" onClick={closeModals}><X size={18} /></button>
              </div>
              <div className="dark-modal-content">
                <div className="guest-row">
                  <div className="guest-info">
                    <h4>Adults</h4>
                  </div>
                  <div className="guest-controls">
                    <button className="guest-btn" onClick={() => setAdults(Math.max(1, adults - 1))}><Minus size={16}/></button>
                    <div className="guest-count">{adults}</div>
                    <button className="guest-btn" onClick={() => setAdults(adults + 1)}><Plus size={16}/></button>
                  </div>
                </div>
                <div className="guest-row">
                  <div className="guest-info">
                    <h4>Children</h4>
                    <p>Age 5-12</p>
                  </div>
                  <div className="guest-controls">
                    <button className="guest-btn" onClick={() => setChildren(Math.max(0, children - 1))} disabled={children === 0}><Minus size={16}/></button>
                    <div className="guest-count">{children}</div>
                    <button className="guest-btn" onClick={() => setChildren(children + 1)}><Plus size={16}/></button>
                  </div>
                </div>
                <div className="guest-row">
                  <div className="guest-info">
                    <h4>Babies</h4>
                    <p>4 and under</p>
                  </div>
                  <div className="guest-controls">
                    <button className="guest-btn" onClick={() => setBabies(Math.max(0, babies - 1))} disabled={babies === 0}><Minus size={16}/></button>
                    <div className="guest-count">{babies}</div>
                    <button className="guest-btn" onClick={() => setBabies(babies + 1)}><Plus size={16}/></button>
                  </div>
                </div>
                <button className="dark-confirm-btn" style={{ marginTop: 16 }} onClick={() => setActiveModal('date')}>Confirm</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* DATE MODAL */}
        {activeModal === 'date' && (
          <div className="dark-modal-overlay" onClick={closeModals}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="dark-modal" onClick={e => e.stopPropagation()}>
              <div className="dark-modal-header">
                <h2 className="dark-modal-title">Select a Date</h2>
                <button className="dark-modal-close" onClick={closeModals}><X size={18} /></button>
              </div>
              <div className="dark-modal-content">
                <div style={{ padding: '24px 0', textAlign: 'center' }}>
                  <input 
                    type="date" 
                    value={selectedDate} 
                    onChange={e => setSelectedDate(e.target.value)} 
                    min={new Date().toISOString().split('T')[0]}
                    style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '12px 24px', borderRadius: 'var(--radius-sm)', fontSize: '1.2rem', fontFamily: 'var(--font)', outline: 'none' }}
                  />
                </div>
                <button className="dark-confirm-btn" style={{ marginTop: 16 }} onClick={() => setActiveModal('time')}>Next</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* TIME MODAL */}
        {activeModal === 'time' && (
          <div className="dark-modal-overlay" onClick={closeModals}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="dark-modal" onClick={e => e.stopPropagation()}>
              <div className="dark-modal-header">
                <h2 className="dark-modal-title">Select a time</h2>
                <button className="dark-modal-close" onClick={closeModals}><X size={18} /></button>
              </div>
              <div className="dark-modal-content">
                <h3 className="dark-modal-subtitle">Dinner</h3>
                <div className="time-grid">
                  {times.map(t => (
                    <div key={t} className={`time-slot ${selectedTime === t ? 'selected' : ''}`} onClick={() => { setSelectedTime(t); setActiveModal('service'); }}>{t}</div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* SERVICE TYPE MODAL */}
        {activeModal === 'service' && (
          <div className="dark-modal-overlay" onClick={closeModals}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="dark-modal" onClick={e => e.stopPropagation()}>
              <div className="dark-modal-header">
                <h2 className="dark-modal-title">Service type</h2>
                <button className="dark-modal-close" onClick={closeModals}><X size={18} /></button>
              </div>
              <div className="dark-modal-content" style={{ padding: '0 24px 24px' }}>
                <div className="service-row" onClick={() => { setServiceType('outdoor'); handleBook('outdoor'); }}>
                  <div className="service-info">
                    <div className="service-title">OUTDOOR ZONE</div>
                    <div className="service-desc" style={{ marginBottom: 12 }}>- Please be advised that during rainfall, your table will automatically relocate to the INDOOR ZONE.</div>
                    <div className="service-desc">- Available for 1 to 6 pax</div>
                    <div className="service-desc">(For more than 6 pax, please contact us directly at 043 100 555)</div>
                    <div className="service-desc" style={{ marginTop: 8 }}>Facebook: Peerada Mod or Email:<br/>reservations@dearruby.co</div>
                  </div>
                  <img className="service-img" src="https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=800&q=80" alt="Outdoor Zone" />
                </div>
                
                <div className="service-row" onClick={() => { setServiceType('indoor'); handleBook('indoor'); }}>
                  <div className="service-info">
                    <div className="service-title">INDOOR ZONE</div>
                    <div className="service-desc" style={{ marginBottom: 12 }}>(Air-conditioned, comfortable seating)</div>
                    <div className="service-desc">- Available for 1 to 6 pax</div>
                    <div className="service-desc">(For more than 6 pax, please contact us directly at 043 100 555)</div>
                    <div className="service-desc" style={{ marginTop: 8 }}>Facebook: Peerada Mod or Email:<br/>reservations@dearruby.co</div>
                  </div>
                  <img className="service-img" src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80" alt="Indoor Zone" />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
}
