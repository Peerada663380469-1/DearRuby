import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

export default function AdminDashboard() {
  const [adminKey, setAdminKey] = useState(sessionStorage.getItem('ruby_admin_key') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [reservations, setReservations] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('reservations');

  useEffect(() => {
    if (adminKey && isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resData, inqData] = await Promise.all([
        api.get('/reservations', { headers: { 'x-admin-key': adminKey } }),
        api.get('/events/inquiries', { headers: { 'x-admin-key': adminKey } })
      ]);
      setReservations(resData.data);
      setInquiries(inqData.data);
    } catch (err) {
      console.error(err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setIsAuthenticated(false);
        sessionStorage.removeItem('ruby_admin_key');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePinSubmit = async (enteredPin) => {
    setLoading(true);
    setError('');
    const attemptKey = enteredPin === '2026' ? 'supersecret-ruby-key-2026' : enteredPin;
    try {
      const res = await api.get('/reservations', { headers: { 'x-admin-key': attemptKey } });
      setReservations(res.data);
      setIsAuthenticated(true);
      sessionStorage.setItem('ruby_admin_key', attemptKey);
      setAdminKey(attemptKey);
      
      const inqRes = await api.get('/events/inquiries', { headers: { 'x-admin-key': attemptKey } });
      setInquiries(inqRes.data);
    } catch (err) {
      setError('Invalid PIN');
      setAdminKey('');
      setIsAuthenticated(false);
      sessionStorage.removeItem('ruby_admin_key');
    } finally {
      setLoading(false);
    }
  };

  const handlePinClick = (num) => {
    if (adminKey.length < 4) {
      const newPin = adminKey + num;
      setAdminKey(newPin);
      setError('');
    }
  };

  const handlePinClear = () => {
    setAdminKey('');
    setError('');
  };

  if (!isAuthenticated) {
    return (
      <div className="login-page">
        <div className="login-orb-1"></div>
        <div className="login-orb-2"></div>
        <div className="login-card">
          <h2 style={{ textAlign: 'center', fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: 8 }}>Restricted Access</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Enter Administrative PIN</p>
          
          <div className="pin-display">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`pin-dot ${i < adminKey.length ? 'filled' : ''}`}></div>
            ))}
          </div>

          {error && <div className="login-error">{error}</div>}

          <div className="pin-pad" style={{ marginTop: 32 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button key={num} type="button" className="pin-key" onClick={() => handlePinClick(num.toString())}>
                {num}
              </button>
            ))}
            <button type="button" className="pin-key action" onClick={handlePinClear}>C</button>
            <button type="button" className="pin-key" onClick={() => handlePinClick('0')}>0</button>
            <button type="button" className="pin-key enter" onClick={() => handlePinSubmit(adminKey)} disabled={loading || adminKey.length < 4}>
              OK
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminKey('');
    sessionStorage.removeItem('ruby_admin_key');
  };

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content" style={{ background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 0' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem' }}>Admin Dashboard</h1>
              <button onClick={handleLogout} className="btn btn-ghost">Logout</button>
            </div>
            
            {/* Tabs */}
              <div style={{ display: 'flex', gap: 16, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
                <button 
                  onClick={() => setActiveTab('reservations')}
                  style={{ 
                    padding: '8px 16px', background: 'none', border: 'none', 
                    fontSize: '1.1rem', fontWeight: activeTab === 'reservations' ? 700 : 400,
                    color: activeTab === 'reservations' ? 'var(--brand-red)' : 'var(--text-secondary)',
                    cursor: 'pointer', borderBottom: activeTab === 'reservations' ? '2px solid var(--brand-red)' : '2px solid transparent'
                  }}
                >
                  Table Reservations ({reservations.length})
                </button>
                <button 
                  onClick={() => setActiveTab('inquiries')}
                  style={{ 
                    padding: '8px 16px', background: 'none', border: 'none', 
                    fontSize: '1.1rem', fontWeight: activeTab === 'inquiries' ? 700 : 400,
                    color: activeTab === 'inquiries' ? 'var(--brand-red)' : 'var(--text-secondary)',
                    cursor: 'pointer', borderBottom: activeTab === 'inquiries' ? '2px solid var(--brand-red)' : '2px solid transparent'
                  }}
                >
                  Private Event Inquiries ({inquiries.length})
                </button>
              </div>

              {/* Content */}
              <div className="card" style={{ overflowX: 'auto' }}>
                {loading ? (
                  <p style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>Loading data...</p>
                ) : (
                  <>
                    {activeTab === 'reservations' && (
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Date & Time</th>
                            <th>Name</th>
                            <th>Contact</th>
                            <th>Guests</th>
                            <th>Service</th>
                            <th>Status</th>
                            <th>Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reservations.length === 0 ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center' }}>No reservations found.</td></tr>
                          ) : (
                            reservations.map(r => (
                              <tr key={r.id}>
                                <td style={{ fontWeight: 600 }}>{r.date} <br/><span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{r.time}</span></td>
                                <td>{r.firstName} {r.lastName}</td>
                                <td>{r.phone}<br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.email}</span></td>
                                <td>{r.guests} pax</td>
                                <td>{r.serviceType || 'Standard'}</td>
                                <td>
                                  <span className={`badge ${r.status === 'confirmed' ? 'badge-green' : 'badge-amber'}`}>
                                    {r.status.toUpperCase()}
                                  </span>
                                </td>
                                <td style={{ maxWidth: 300 }}>
                                  {r.specialRequests && <div style={{fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 4}}><strong>Occasion:</strong> {r.specialRequests}</div>}
                                  {r.dietary && <div style={{fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 4}}><strong>Dietary:</strong> {r.dietary}</div>}
                                  {r.preOrderJson && (() => {
                                    try {
                                      const preOrders = JSON.parse(r.preOrderJson);
                                      if (preOrders && preOrders.length > 0) {
                                        return (
                                          <div style={{fontSize: '0.85rem', color: 'var(--brand-red)'}}>
                                            <strong>Pre-order:</strong> {preOrders.map(item => `${item.qty}x ${item.name}`).join(', ')}
                                          </div>
                                        )
                                      }
                                    } catch(e) {}
                                    return null;
                                  })()}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    )}

                    {activeTab === 'inquiries' && (
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Requested Date</th>
                            <th>Name</th>
                            <th>Contact</th>
                            <th>Guests</th>
                            <th>Details</th>
                            <th>Submitted At</th>
                          </tr>
                        </thead>
                        <tbody>
                          {inquiries.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center' }}>No event inquiries found.</td></tr>
                          ) : (
                            inquiries.map(i => (
                              <tr key={i.id}>
                                <td style={{ fontWeight: 600 }}>{i.eventDate}</td>
                                <td>{i.firstName} {i.lastName}</td>
                                <td>{i.phone}<br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{i.email}</span></td>
                                <td>{i.guestCount} pax</td>
                                <td style={{ maxWidth: 300 }}>{i.eventDetails}</td>
                                <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(i.createdAt).toLocaleString()}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    )}
                  </>
                )}
              </div>

            </div>
          )}
          
        </div>
      </main>
      <Footer />
    </div>
  );
}
