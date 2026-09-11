import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, Users, Eye, FileText, User, LogOut, ChevronRight } from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customerData, setCustomerData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('customer_token');
    const data = localStorage.getItem('customer_data');
    if (!token) {
      navigate('/customer/login');
      return;
    }
    if (data) setCustomerData(JSON.parse(data));
    fetchReservations(token);
  }, [navigate]);

  const fetchReservations = async (token) => {
    try {
      const res = await api.get('/customer/reservations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservations(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('customer_token');
        localStorage.removeItem('customer_data');
        navigate('/customer/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_data');
    navigate('/customer/login');
  };

  const statusColors = {
    pending: { bg: 'rgba(212,175,55,0.15)', color: '#D4AF37', label: 'Pending' },
    confirmed: { bg: 'rgba(34,197,94,0.15)', color: '#22C55E', label: 'Confirmed' },
    cancelled: { bg: 'rgba(239,68,68,0.15)', color: '#EF4444', label: 'Cancelled' }
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0, zIndex: -1,
        background: 'linear-gradient(to bottom, rgba(15,5,5,0.7) 0%, rgba(5,5,5,0.95) 100%), url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover', backgroundPosition: 'center'
      }} />

      <Navbar />

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px', minHeight: 'calc(100vh - 200px)' }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '40px', flexWrap: 'wrap', gap: '16px'
        }}>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-heading)', fontSize: '2.4rem', color: '#F6F4EE',
              fontWeight: 600, marginBottom: '4px'
            }}>
              My Reservations
            </h1>
            {customerData && (
              <p style={{ color: '#8F8282', fontSize: '0.9rem' }}>
                Welcome, <span style={{ color: 'var(--gold)' }}>{customerData.firstName} {customerData.lastName}</span>
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to={`/customer/profile/${customerData?.id}`} style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(246,244,238,0.15)',
              borderRadius: '8px', color: '#C8C4B7', fontSize: '0.85rem', fontWeight: 500,
              textDecoration: 'none', transition: '0.2s'
            }}>
              <User size={16} /> My Profile
            </Link>
            <button onClick={handleLogout} style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '8px', color: '#EF4444', fontSize: '0.85rem', fontWeight: 500,
              cursor: 'pointer', transition: '0.2s'
            }}>
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#8F8282' }}>
            <div style={{
              width: '40px', height: '40px', border: '3px solid rgba(138,30,32,0.2)',
              borderTopColor: 'var(--brand-red)', borderRadius: '50%',
              animation: 'spin 1s linear infinite', margin: '0 auto 16px'
            }} />
            Loading...
          </div>
        ) : reservations.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 40px',
            background: 'rgba(10,10,10,0.6)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(246,244,238,0.1)', borderRadius: '16px'
          }}>
            <Calendar size={48} style={{ color: '#8F8282', marginBottom: '16px' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', color: '#F6F4EE', fontSize: '1.4rem', marginBottom: '8px' }}>
              No Reservations Yet
            </h3>
            <p style={{ color: '#8F8282', marginBottom: '24px' }}>
              You haven't made any reservations. Book your table now!
            </p>
            <Link to="/" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 32px', background: 'var(--brand-red)', color: '#fff',
              borderRadius: '8px', fontWeight: 600, letterSpacing: '1px',
              textTransform: 'uppercase', textDecoration: 'none', fontSize: '0.9rem'
            }}>
              Make a Reservation <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {reservations.map((r) => {
              const status = statusColors[r.status] || statusColors.pending;
              return (
                <div key={r.id} style={{
                  background: 'rgba(10,10,10,0.7)', backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(246,244,238,0.1)', borderRadius: '12px',
                  padding: '24px 28px', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', gap: '20px', transition: '0.2s',
                  cursor: 'pointer'
                }}
                  onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(138,30,32,0.4)'}
                  onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(246,244,238,0.1)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flex: 1, flexWrap: 'wrap' }}>
                    {/* Date */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '140px' }}>
                      <Calendar size={18} style={{ color: 'var(--brand-red)' }} />
                      <span style={{ color: '#F6F4EE', fontWeight: 500 }}>{r.date}</span>
                    </div>
                    {/* Time */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '100px' }}>
                      <Clock size={18} style={{ color: 'var(--gold)' }} />
                      <span style={{ color: '#C8C4B7' }}>{r.time}</span>
                    </div>
                    {/* Guests */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Users size={18} style={{ color: '#8F8282' }} />
                      <span style={{ color: '#C8C4B7' }}>{r.guests} guests</span>
                    </div>
                    {/* Status */}
                    <span style={{
                      padding: '4px 14px', borderRadius: '20px', fontSize: '0.75rem',
                      fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px',
                      background: status.bg, color: status.color
                    }}>
                      {status.label}
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <Link to={`/customer/reservation/${r.id}`} style={{
                      display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(246,244,238,0.15)',
                      borderRadius: '6px', color: '#C8C4B7', fontSize: '0.8rem', fontWeight: 500,
                      textDecoration: 'none', transition: '0.2s'
                    }}>
                      <Eye size={14} /> View
                    </Link>
                    <Link to={`/customer/invoice/${r.id}`} style={{
                      display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
                      background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)',
                      borderRadius: '6px', color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 500,
                      textDecoration: 'none', transition: '0.2s'
                    }}>
                      <FileText size={14} /> Invoice
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
