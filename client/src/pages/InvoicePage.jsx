import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Calendar, Clock, Users, User, Phone, Mail } from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function InvoicePage() {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('customer_token');
    if (!token) { navigate('/customer/login'); return; }
    fetchInvoice(token);
  }, [reservationId, navigate]);

  const fetchInvoice = async (token) => {
    try {
      // [IDOR VULNERABILITY] This endpoint returns ANY invoice by reservation ID
      // without checking if the reservation belongs to the logged-in customer.
      const res = await api.get(`/customer/invoices/${reservationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvoice(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Invoice not found.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0, zIndex: -1,
        background: 'linear-gradient(to bottom, rgba(15,5,5,0.7) 0%, rgba(5,5,5,0.95) 100%), url("https://images.unsplash.com/photo-1560624052-449f5ddf0c31?auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover', backgroundPosition: 'center'
      }} />

      <Navbar />

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px', minHeight: 'calc(100vh - 200px)' }}>
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
            Loading invoice...
          </div>
        ) : error ? (
          <div style={{
            textAlign: 'center', padding: '60px 40px',
            background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '12px'
          }}>
            <p style={{ color: '#EF4444', fontSize: '1.1rem' }}>{error}</p>
          </div>
        ) : invoice && (
          <div style={{
            background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(138,30,32,0.3)', borderRadius: '16px',
            padding: '48px 40px', boxShadow: '0 24px 64px rgba(0,0,0,0.5)'
          }}>
            {/* Invoice Header */}
            <div style={{ textAlign: 'center', marginBottom: '36px', borderBottom: '1px solid rgba(246,244,238,0.1)', paddingBottom: '28px' }}>
              <FileText size={36} style={{ color: 'var(--gold)', marginBottom: '12px' }} />
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: '#F6F4EE', marginBottom: '4px' }}>
                {invoice.invoiceNumber}
              </h1>
              <p style={{ color: '#8F8282', fontSize: '0.85rem' }}>
                Issued: {new Date(invoice.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Customer & Reservation Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '20px' }}>
                <h4 style={{ color: '#8F8282', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>Guest</h4>
                <p style={{ color: '#F6F4EE', fontWeight: 500, marginBottom: '4px' }}>
                  {invoice.reservation.firstName} {invoice.reservation.lastName}
                </p>
                <p style={{ color: '#C8C4B7', fontSize: '0.85rem' }}>{invoice.reservation.email}</p>
                <p style={{ color: '#C8C4B7', fontSize: '0.85rem' }}>{invoice.reservation.phone}</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '20px' }}>
                <h4 style={{ color: '#8F8282', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>Reservation</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Calendar size={14} style={{ color: 'var(--brand-red)' }} />
                  <span style={{ color: '#F6F4EE', fontSize: '0.9rem' }}>{invoice.reservation.date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Clock size={14} style={{ color: 'var(--gold)' }} />
                  <span style={{ color: '#C8C4B7', fontSize: '0.9rem' }}>{invoice.reservation.time}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={14} style={{ color: '#8F8282' }} />
                  <span style={{ color: '#C8C4B7', fontSize: '0.9rem' }}>{invoice.reservation.guests} guests</span>
                </div>
              </div>
            </div>

            {/* Pre-order Items */}
            {invoice.preOrderItems && invoice.preOrderItems.length > 0 ? (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', color: '#F6F4EE', marginBottom: '16px', fontSize: '1.1rem' }}>
                  Pre-ordered Items
                </h3>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', overflow: 'hidden' }}>
                  {/* Table Header */}
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '12px 20px', borderBottom: '1px solid rgba(246,244,238,0.1)' }}>
                    {['Item', 'Price', 'Qty', 'Total'].map(h => (
                      <span key={h} style={{ color: '#8F8282', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase' }}>{h}</span>
                    ))}
                  </div>
                  {/* Table Rows */}
                  {invoice.preOrderItems.map((item, i) => (
                    <div key={i} style={{
                      display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '14px 20px',
                      borderBottom: i < invoice.preOrderItems.length - 1 ? '1px solid rgba(246,244,238,0.06)' : 'none'
                    }}>
                      <span style={{ color: '#F6F4EE', fontSize: '0.9rem' }}>{item.name}</span>
                      <span style={{ color: '#C8C4B7', fontSize: '0.9rem' }}>฿{item.price?.toLocaleString()}</span>
                      <span style={{ color: '#C8C4B7', fontSize: '0.9rem' }}>{item.quantity || 1}</span>
                      <span style={{ color: 'var(--gold)', fontSize: '0.9rem', fontWeight: 500 }}>฿{(item.price * (item.quantity || 1)).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{
                textAlign: 'center', padding: '32px', marginBottom: '32px',
                background: 'rgba(255,255,255,0.03)', borderRadius: '10px', color: '#8F8282'
              }}>
                No pre-ordered items
              </div>
            )}

            {/* Totals */}
            <div style={{
              background: 'rgba(138,30,32,0.08)', borderRadius: '10px', padding: '24px',
              border: '1px solid rgba(138,30,32,0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#C8C4B7' }}>Subtotal</span>
                <span style={{ color: '#F6F4EE' }}>฿{invoice.subtotal?.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#C8C4B7' }}>VAT (7%)</span>
                <span style={{ color: '#F6F4EE' }}>฿{invoice.vat?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between', paddingTop: '12px',
                borderTop: '1px solid rgba(246,244,238,0.15)'
              }}>
                <span style={{ color: '#F6F4EE', fontWeight: 700, fontSize: '1.1rem' }}>Total</span>
                <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '1.3rem', fontFamily: 'var(--font-heading)' }}>
                  ฿{invoice.total?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
