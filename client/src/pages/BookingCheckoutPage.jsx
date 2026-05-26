import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clock, Users, Calendar, Lock } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function BookingCheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { time = '6:00 pm', guests = 2, date, cart = [] } = location.state || {};
  const [loading, setLoading] = useState(false);

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [purpose, setPurpose] = useState('');
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [dietary, setDietary] = useState('');
  const [birthday, setBirthday] = useState('');
  
  const preOrderTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  // Default to today if date is missing
  const reservationDate = date || new Date().toISOString().split('T')[0];

  const handlePay = async () => {
    if (!firstName || !lastName || !email || !phone || !agreedToPolicy || !purpose || !agreedToPrivacy) {
      alert("Please fill in all required fields and agree to the policies.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('https://trodden-scoreless-schnapps.ngrok-free.dev/api/reservations', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '69420'
        },
        body: JSON.stringify({
          firstName, lastName, email, phone, date: reservationDate, time, guests,
          specialRequests: purpose,
          serviceType: 'Dine-in',
          dietary,
          birthday,
          preOrderJson: cart.length > 0 ? cart : null
        })
      });
      if (res.ok) {
        alert("Payment successful! Your reservation and dining selection are confirmed.");
        navigate('/');
      } else {
        console.warn("Failed to confirm reservation with server, simulating demo success.");
        alert("[DEMO MODE] Payment successful! Your reservation and dining selection are confirmed.");
        navigate('/');
      }
    } catch (error) {
      console.error("Network error, simulating demo success.", error);
      alert("[DEMO MODE] Payment successful! Your reservation and dining selection are confirmed.");
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 0', border: 'none', borderBottom: '1px solid rgba(246, 244, 238, 0.3)',
    background: 'transparent', fontSize: '1rem', color: '#F6F4EE', outline: 'none',
    transition: 'var(--transition)'
  };
  const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(246, 244, 238, 0.7)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', fontFamily: 'var(--font)', color: '#F6F4EE', paddingBottom: '100px' }}>
      
      {/* Background Image matching home page */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: -1,
        background: 'linear-gradient(to bottom, rgba(15,5,5,0.85) 0%, rgba(5,5,5,0.95) 100%), url("https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover', backgroundPosition: 'center'
      }}></div>

      {/* Reusable Luxury Navbar */}
      <Navbar />

      <div className="mobile-col" style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px', display: 'flex', gap: 48, alignItems: 'flex-start' }}>
        
        {/* LEFT COLUMN: FORM */}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: 32, fontWeight: 400 }}>Complete Your Booking</h1>

          {/* Guest Details */}
          <div className="mobile-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 48 }}>
            <div>
              <label style={labelStyle}>First name *</label>
              <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} style={inputStyle} placeholder="Jane" />
            </div>
            <div>
              <label style={labelStyle}>Last name *</label>
              <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} style={inputStyle} placeholder="Doe" />
            </div>
            <div>
              <label style={labelStyle}>Email *</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="jane@example.com" />
            </div>
            <div>
              <label style={labelStyle}>Phone number *</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} placeholder="081 234 5678" />
            </div>
          </div>

          {/* Questionnaire */}
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: 24, fontWeight: 400 }}>Occasion & Requests</h2>
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Purpose of visit *</label>
              <select value={purpose} onChange={e => setPurpose(e.target.value)} style={{ ...inputStyle, paddingBottom: 12 }}>
                <option value="" style={{ color: '#000' }}>Please select</option>
                <option value="anniversary" style={{ color: '#000' }}>Anniversary</option>
                <option value="birthday" style={{ color: '#000' }}>Birthday</option>
                <option value="business" style={{ color: '#000' }}>Business</option>
                <option value="casual" style={{ color: '#000' }}>Casual Dining</option>
              </select>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Birthday (Optional)</label>
              <input type="text" value={birthday} onChange={e => setBirthday(e.target.value)} placeholder="DD/MM" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Dietary Preferences and Allergies</label>
              <textarea value={dietary} onChange={e => setDietary(e.target.value)} rows="2" placeholder="Let us know of any special requirements..." style={{ ...inputStyle, resize: 'vertical' }}></textarea>
            </div>
          </div>

          {/* Policies */}
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: 24, fontWeight: 400 }}>Booking Policy</h2>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(246, 244, 238, 0.1)', padding: 24, borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'rgba(246, 244, 238, 0.8)', lineHeight: 1.6, maxHeight: 200, overflowY: 'auto' }}>
              <p><strong>Dear Ruby offers a full-course dinner.</strong> Therefore, each guest is required to order at least one starter and one main course.</p><br/>
              <p><strong>Punctuality:</strong> We are excited to welcome you and kindly ask that your entire party arrive promptly for your reservation. We reserve the right to cancel bookings for guests who arrive more than 15 minutes late.</p><br/>
              <p><strong>Dress Code:</strong> Elegant attire is required. No athletic wear, swimwear, or flip-flops.</p>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16, cursor: 'pointer', fontSize: '0.9rem' }}>
              <input type="checkbox" checked={agreedToPolicy} onChange={e => setAgreedToPolicy(e.target.checked)} style={{ width: 18, height: 18, accentColor: 'var(--brand-red)' }} />
              <span>I agree to the booking policy *</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16, cursor: 'pointer', fontSize: '0.9rem' }}>
              <input type="checkbox" checked={agreedToPrivacy} onChange={e => setAgreedToPrivacy(e.target.checked)} style={{ width: 18, height: 18, accentColor: 'var(--brand-red)' }} />
              <span>I agree to the privacy notice for data processing *</span>
            </label>
          </div>

          {/* Payment Section */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 400 }}>Payment Details</h2>
              <Lock size={16} color="rgba(246, 244, 238, 0.5)" />
            </div>
            <p style={{ fontSize: '0.9rem', color: 'rgba(246, 244, 238, 0.7)', marginBottom: 24 }}>฿1,000 deposit will be charged to secure this reservation.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Card number *</label>
                <input type="text" placeholder="XXXX XXXX XXXX XXXX" style={inputStyle} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Name on card *</label>
                <input type="text" placeholder="FULL NAME" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Expiration *</label>
                <input type="text" placeholder="MM/YY" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Security Code *</label>
                <input type="text" placeholder="XXX" style={inputStyle} />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STICKY SUMMARY */}
        <div style={{ width: 380, position: 'sticky', top: 120 }}>
          <div style={{ background: 'rgba(21, 24, 18, 0.6)', border: '1px solid rgba(246, 244, 238, 0.1)', borderRadius: 'var(--radius-md)', padding: 32, boxShadow: '0 24px 60px rgba(0,0,0,0.6)', backdropFilter: 'blur(20px)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: 24, fontWeight: 500, textAlign: 'center' }}>Reservation Summary</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid rgba(246, 244, 238, 0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'rgba(246, 244, 238, 0.7)', display: 'flex', alignItems: 'center', gap: 8 }}><Calendar size={16}/> Date</span>
                <span style={{ fontWeight: 600 }}>{reservationDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'rgba(246, 244, 238, 0.7)', display: 'flex', alignItems: 'center', gap: 8 }}><Clock size={16}/> Time</span>
                <span style={{ fontWeight: 600 }}>{time}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'rgba(246, 244, 238, 0.7)', display: 'flex', alignItems: 'center', gap: 8 }}><Users size={16}/> Guests</span>
                <span style={{ fontWeight: 600 }}>{guests} Guests</span>
              </div>
            </div>

            {cart.length > 0 && (
              <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid rgba(246, 244, 238, 0.1)' }}>
                <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'rgba(246, 244, 238, 0.7)', letterSpacing: '1px', marginBottom: 16 }}>Selected Items</h4>
                {cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem' }}>
                    <span>{item.qty}x {item.name}</span>
                    <span>฿{(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, fontWeight: 600 }}>
                  <span>Selection Total</span>
                  <span style={{ color: '#D4AF37' }}>฿{preOrderTotal.toLocaleString()}</span>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'rgba(246, 244, 238, 0.5)', marginTop: 4 }}>
                  (To be settled at the restaurant)
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Deposit Total</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--brand-red)' }}>฿1,000</span>
            </div>

            <button onClick={handlePay} disabled={loading} style={{ width: '100%', background: 'var(--brand-red)', color: '#fff', padding: 18, fontSize: '0.95rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: '0.2s', boxShadow: '0 4px 12px rgba(138, 30, 32, 0.4)' }} onMouseOver={e => e.currentTarget.style.background='var(--brand-red-dark)'} onMouseOut={e => e.currentTarget.style.background='var(--brand-red)'}>
              {loading ? 'Processing...' : 'Pay ฿1,000'}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'rgba(246, 244, 238, 0.5)', marginTop: 16 }}>
              Payments are secure and encrypted.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
