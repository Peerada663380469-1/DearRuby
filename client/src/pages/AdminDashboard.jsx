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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Test the key by fetching reservations
      const res = await api.get('/reservations', { headers: { 'x-admin-key': adminKey } });
      setReservations(res.data);
      setIsAuthenticated(true);
      sessionStorage.setItem('ruby_admin_key', adminKey);
      
      // Fetch inquiries too
      const inqRes = await api.get('/events/inquiries', { headers: { 'x-admin-key': adminKey } });
      setInquiries(inqRes.data);
    } catch (err) {
      setError('Invalid Admin Key');
      setIsAuthenticated(false);
      sessionStorage.removeItem('ruby_admin_key');
    } finally {
      setLoading(false);
    }
  };

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
      if (err.response?.status === 401) {
        setIsAuthenticated(false);
        sessionStorage.removeItem('ruby_admin_key');
      }
    } finally {
      setLoading(false);
    }
  };

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
          
          {!isAuthenticated ? (
            <div className="card" style={{ maxWidth: 400, margin: '100px auto', textAlign: 'center' }}>
              <h2 style={{ marginBottom: 24, fontFamily: 'var(--font-heading)' }}>Admin Login</h2>
              {error && <p style={{ color: 'var(--red)', marginBottom: 16 }}>{error}</p>}
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <input 
                  type="password" 
                  value={adminKey} 
                  onChange={(e) => setAdminKey(e.target.value)} 
                  placeholder="Enter Admin Secret Key"
                  className="form-input"
                  required
                />
                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                  {loading ? 'Authenticating...' : 'Login'}
                </button>
              </form>
            </div>
          ) : (
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
                          </tr>
                        </thead>
                        <tbody>
                          {reservations.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center' }}>No reservations found.</td></tr>
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
