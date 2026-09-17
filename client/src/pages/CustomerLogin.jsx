import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight } from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function CustomerLogin() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('customer_token', res.data.token || 'session_auth');
        localStorage.setItem('customer_data', JSON.stringify(res.data));
        navigate('/customer/dashboard');
      } else {
        const res = await api.post('/auth/register', { email, password, firstName, lastName, phone });
        localStorage.setItem('customer_token', res.data.token || 'session_auth');
        localStorage.setItem('customer_data', JSON.stringify(res.data));
        navigate('/customer/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '14px 16px 14px 48px', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(246,244,238,0.15)', borderRadius: '8px', color: '#F6F4EE',
    fontSize: '0.95rem', fontFamily: 'var(--font)', outline: 'none', transition: '0.2s'
  };

  const labelStyle = {
    display: 'block', color: '#C8C4B7', fontSize: '0.8rem', fontWeight: 600,
    letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px'
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: -1,
        background: 'linear-gradient(to bottom, rgba(15,5,5,0.7) 0%, rgba(5,5,5,0.95) 100%), url("https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover', backgroundPosition: 'center'
      }} />

      <Navbar />

      {/* Login/Register Form */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: 'calc(100vh - 200px)', padding: '40px 20px'
      }}>
        <div style={{
          width: '100%', maxWidth: '460px',
          background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(138,30,32,0.3)', borderRadius: '16px',
          padding: '48px 40px', boxShadow: '0 32px 64px rgba(0,0,0,0.6)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h1 style={{
              fontFamily: 'var(--font-heading)', fontSize: '2.2rem', color: '#F6F4EE',
              fontWeight: 600, marginBottom: '8px'
            }}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p style={{ color: '#8F8282', fontSize: '0.9rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
              {isLogin ? 'Sign in to manage your reservations' : 'Join Dear Ruby for a personalized experience'}
            </p>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '8px', padding: '12px 16px', marginBottom: '24px',
              color: '#EF4444', fontSize: '0.85rem', textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Register-only fields */}
            {!isLogin && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={labelStyle}>First Name</label>
                    <div style={{ position: 'relative' }}>
                      <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#8F8282' }} />
                      <input
                        type="text" placeholder="First name" value={firstName}
                        onChange={e => setFirstName(e.target.value)} required
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Last Name</label>
                    <div style={{ position: 'relative' }}>
                      <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#8F8282' }} />
                      <input
                        type="text" placeholder="Last name" value={lastName}
                        onChange={e => setLastName(e.target.value)} required
                        style={inputStyle}
                      />
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Phone</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#8F8282' }} />
                    <input
                      type="tel" placeholder="+66 xxx xxx xxxx" value={phone}
                      onChange={e => setPhone(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#8F8282' }} />
                <input
                  type="email" placeholder="your@email.com" value={email}
                  onChange={e => setEmail(e.target.value)} required
                  autoComplete="off"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '32px' }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#8F8282' }} />
                <input
                  type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password}
                  onChange={e => setPassword(e.target.value)} required minLength={4}
                  autoComplete="new-password"
                  style={inputStyle}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#8F8282', cursor: 'pointer' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '16px', background: 'var(--brand-red)', color: '#fff',
              border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600,
              letterSpacing: '2px', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
              transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              opacity: loading ? 0.7 : 1, boxShadow: '0 8px 24px rgba(138,30,32,0.4)'
            }}>
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div style={{ textAlign: 'center', marginTop: '28px' }}>
            <p style={{ color: '#8F8282', fontSize: '0.9rem' }}>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                style={{
                  background: 'none', border: 'none', color: 'var(--gold)',
                  fontWeight: 600, cursor: 'pointer', marginLeft: '8px', fontSize: '0.9rem', fontFamily: 'var(--font)'
                }}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
