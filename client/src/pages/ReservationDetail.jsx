import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, Users, ArrowLeft, User, Phone, Mail, Utensils, MessageSquare, Heart } from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ReservationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('customer_token');
    if (!token) { navigate('/customer/login'); return; }
    fetchReservation(token);
  }, [id, navigate]);

  const fetchReservation = async (token) => {
    try {
      const res = await api.get(`/reservations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservation(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Reservation not found.');
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    pending: { bg: 'rgba(212,175,55,0.15)', color: '#D4AF37', label: 'Pending' },
    confirmed: { bg: 'rgba(34,197,94,0.15)', color: '#22C55E', label: 'Confirmed' },
    cancelled: { bg: 'rgba(239,68,68,0.15)', color: '#EF4444', label: 'Cancelled' }
  };

  const InfoRow = ({ icon: Icon, label, value, iconColor = '#8F8282' }) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '14px 0', borderBottom: '1px solid rgba(246,244,238,0.06)' }}>
      <Icon size={18} style={{ color: iconColor, flexShrink: 0, marginTop: '2px' }} />
      <div>
        <div style={{ color: '#8F8282', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>{label}</div>
        <div style={{ color: '#F6F4EE', fontSize: '0.95rem' }}>{value || '—'}</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0, zIndex: -1,
        background: 'linear-gradient(to bottom, rgba(15,5,5,0.7) 0%, rgba(5,5,5,0.95) 100%), url("https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover', backgroundPosition: 'center'
      }} />

      <Navbar />

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px', minHeight: 'calc(100vh - 200px)' }}>
        {/* Back Button */}
        <Link to="/customer/dashboard" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#C8C4B7',
          textDecoration: 'none', fontSize: '0.9rem', marginBottom: '24px', transition: '0.2s'
        }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#8F8282' }}>
            <div style={{
              width: '40px', height: '40px', border: '3px solid rgba(138,30,32,0.2)',
              borderTopColor: 'var(--brand-red)', borderRadius: '50%',
              animation: 'spin 1s linear infinite', margin: '0 auto 16px'
            }} />
            Loading reservation...
          </div>
        ) : error ? (
          <div style={{
            textAlign: 'center', padding: '60px 40px',
            background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '12px'
          }}>
            <p style={{ color: '#EF4444', fontSize: '1.1rem', marginBottom: '16px' }}>{error}</p>
            <Link to="/customer/dashboard" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>
              Go back to dashboard
            </Link>
          </div>
        ) : reservation && (() => {
          const status = statusColors[reservation.status] || statusColors.pending;
          return (
            <div style={{
              background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(138,30,32,0.3)', borderRadius: '16px',
              padding: '40px', boxShadow: '0 24px 64px rgba(0,0,0,0.5)'
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: '#F6F4EE', marginBottom: '4px' }}>
                    Reservation #{reservation.id}
                  </h1>
                  <p style={{ color: '#8F8282', fontSize: '0.85rem' }}>
                    Created {new Date(reservation.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <span style={{
                  padding: '6px 18px', borderRadius: '20px', fontSize: '0.8rem',
                  fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px',
                  background: status.bg, color: status.color
                }}>
                  {status.label}
                </span>
              </div>

              {/* Reservation Details */}
              <div style={{
                background: 'rgba(255,255,255,0.03)', borderRadius: '12px',
                padding: '8px 24px', marginBottom: '24px'
              }}>
                <InfoRow icon={User} label="Guest Name" value={`${reservation.firstName} ${reservation.lastName}`} iconColor="var(--brand-red)" />
                <InfoRow icon={Mail} label="Email" value={reservation.email} iconColor="var(--gold)" />
                <InfoRow icon={Phone} label="Phone" value={reservation.phone} iconColor="#8F8282" />
                <InfoRow icon={Calendar} label="Date" value={reservation.date} iconColor="var(--brand-red)" />
                <InfoRow icon={Clock} label="Time" value={reservation.time} iconColor="var(--gold)" />
                <InfoRow icon={Users} label="Guests" value={`${reservation.guests} guests`} iconColor="#8F8282" />
                {reservation.serviceType && <InfoRow icon={Utensils} label="Service Type" value={reservation.serviceType} />}
                {reservation.dietary && <InfoRow icon={Heart} label="Dietary Requirements" value={reservation.dietary} />}
                {reservation.specialRequests && <InfoRow icon={MessageSquare} label="Special Requests" value={reservation.specialRequests} />}
                {reservation.birthday && <InfoRow icon={Heart} label="Birthday" value={reservation.birthday} />}
              </div>

              {/* Pre-order items if any */}
              {reservation.preOrderJson && (() => {
                try {
                  const items = JSON.parse(reservation.preOrderJson);
                  if (items.length === 0) return null;
                  return (
                    <div style={{
                      background: 'rgba(255,255,255,0.03)', borderRadius: '12px',
                      padding: '24px', marginBottom: '24px'
                    }}>
                      <h3 style={{ fontFamily: 'var(--font-heading)', color: '#F6F4EE', marginBottom: '16px', fontSize: '1.1rem' }}>
                        Pre-ordered Items
                      </h3>
                      {items.map((item, i) => (
                        <div key={i} style={{
                          display: 'flex', justifyContent: 'space-between', padding: '8px 0',
                          borderBottom: i < items.length - 1 ? '1px solid rgba(246,244,238,0.06)' : 'none'
                        }}>
                          <span style={{ color: '#C8C4B7' }}>{item.name} × {item.quantity || 1}</span>
                          <span style={{ color: 'var(--gold)', fontWeight: 500 }}>฿{(item.price * (item.quantity || 1)).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  );
                } catch { return null; }
              })()}
            </div>
          );
        })()}
      </div>

      <Footer />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
