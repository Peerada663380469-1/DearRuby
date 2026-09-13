import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Calendar } from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function CustomerProfile() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('customer_token');
    if (!token) { navigate('/customer/login'); return; }
    fetchProfile(token);
  }, [customerId, navigate]);

  const fetchProfile = async (token) => {
    try {
      // [IDOR VULNERABILITY] This endpoint returns ANY customer's profile by ID
      // without checking if the requesting customer is viewing their own profile.
      const res = await api.get(`/profile?user_id=${customerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Profile not found.');
    } finally {
      setLoading(false);
    }
  };

  const InfoRow = ({ icon: Icon, label, value, iconColor = '#8F8282' }) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '18px 0', borderBottom: '1px solid rgba(246,244,238,0.06)' }}>
      <Icon size={20} style={{ color: iconColor, flexShrink: 0, marginTop: '2px' }} />
      <div>
        <div style={{ color: '#8F8282', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px' }}>{label}</div>
        <div style={{ color: '#F6F4EE', fontSize: '1rem' }}>{value || '—'}</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0, zIndex: -1,
        background: 'linear-gradient(to bottom, rgba(15,5,5,0.7) 0%, rgba(5,5,5,0.95) 100%), url("https://images.unsplash.com/photo-1559329007-40df8a9345d8?auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover', backgroundPosition: 'center'
      }} />

      <Navbar />

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px', minHeight: 'calc(100vh - 200px)' }}>
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
            Loading profile...
          </div>
        ) : error ? (
          <div style={{
            textAlign: 'center', padding: '60px 40px',
            background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '12px'
          }}>
            <p style={{ color: '#EF4444', fontSize: '1.1rem' }}>{error}</p>
          </div>
        ) : profile && (
          <div style={{
            background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(138,30,32,0.3)', borderRadius: '16px',
            padding: '48px 40px', boxShadow: '0 24px 64px rgba(0,0,0,0.5)'
          }}>
            {/* Avatar & Name */}
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--brand-red), var(--brand-red-dark))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px', fontSize: '2rem', fontWeight: 700, color: '#fff',
                fontFamily: 'var(--font-heading)', boxShadow: '0 8px 24px rgba(138,30,32,0.4)'
              }}>
                {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
              </div>
              <h1 style={{
                fontFamily: 'var(--font-heading)', fontSize: '2rem', color: '#F6F4EE',
                fontWeight: 600, marginBottom: '4px'
              }}>
                {profile.firstName} {profile.lastName}
              </h1>
              <p style={{
                color: '#8F8282', fontSize: '0.8rem', fontWeight: 600,
                letterSpacing: '2px', textTransform: 'uppercase'
              }}>
                Customer ID: {profile.id}
              </p>
            </div>

            {/* Profile Details */}
            <div style={{
              background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '8px 24px'
            }}>
              <InfoRow icon={User} label="Full Name" value={`${profile.firstName} ${profile.lastName}`} iconColor="var(--brand-red)" />
              <InfoRow icon={Mail} label="Email Address" value={profile.email} iconColor="var(--gold)" />
              <InfoRow icon={Phone} label="Phone Number" value={profile.phone} />
              <InfoRow icon={Calendar} label="Member Since" value={new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} iconColor="var(--brand-red)" />
            </div>
          </div>
        )}
      </div>

      <Footer />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
