import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { X, KeyRound, Users, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import ConfirmDialog from './ConfirmDialog';

const navItems = [
  { path: '/admin/dashboard', labelKey: 'dashboard', requireManager: true },
  { path: '/admin/pos', labelKey: 'pos', requireManager: false },
  { path: '/admin/tables', labelKey: 'tables', requireManager: false },
  { path: '/admin/orders', labelKey: 'orders', requireManager: true },
  { path: '/admin/menu', labelKey: 'menu', requireManager: true },
  { path: '/admin/accounting', labelKey: 'accounting', requireManager: true },
];

export default function TopNav({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isManager, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const toast = useToast();
  
  const [showStaff, setShowStaff] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [newName, setNewName] = useState('');
  const [newPin, setNewPin] = useState('');
  const [newRole, setNewRole] = useState('staff');
  const [editId, setEditId] = useState(null);
  const [editPin, setEditPin] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleLogout = () => { logout(); navigate('/login'); };

  const handleNav = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const openStaffModal = async () => {
    try {
      const res = await api.get('/auth/users');
      setStaffList(res.data);
    } catch {
      toast.error('Failed to load staff list');
    }
    setShowStaff(true);
  };

  const addStaff = async () => {
    if (!newName.trim() || newPin.length < 4) {
      toast.warning('Please enter name and PIN (at least 4 digits)');
      return;
    }
    try {
      await api.post('/auth/users', { name: newName, pin: newPin, role: newRole });
      const res = await api.get('/auth/users');
      setStaffList(res.data);
      setNewName(''); setNewPin(''); setNewRole('staff');
      toast.success('Staff member added');
    } catch (err) { toast.error(err.response?.data?.error || 'An error occurred'); }
  };

  const changePin = async (id) => {
    if (editPin.length < 4) {
      toast.warning('PIN must be at least 4 digits');
      return;
    }
    try {
      await api.patch(`/auth/users/${id}/pin`, { pin: editPin });
      setEditId(null); setEditPin('');
      toast.success('PIN changed successfully');
    } catch (err) { toast.error(err.response?.data?.error || 'An error occurred'); }
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    try {
      await api.delete(`/auth/users/${confirmDelete}`);
      const res = await api.get('/auth/users');
      setStaffList(res.data);
      toast.success('Staff member deleted');
    } catch (err) { toast.error(err.response?.data?.error || 'An error occurred'); }
    setConfirmDelete(null);
  };

  return (
    <>
      <header className="top-nav">
        <div className="top-nav-left">
          <div className="top-nav-brand">
            <img src="/images/logo.png" alt="Logo" />
          </div>
          <nav className="top-nav-links">
            {navItems.filter(item => isManager || !item.requireManager).map(item => (
              <button 
                key={item.path} 
                className={`top-nav-link ${location.pathname === item.path ? 'active' : ''}`} 
                onClick={() => handleNav(item.path)}
              >
                {t(item.labelKey)}
              </button>
            ))}
            {isManager && (
              <button className="top-nav-link" onClick={openStaffModal}>
                {t('staff')}
              </button>
            )}
          </nav>
        </div>
        
        <div className="top-nav-right">
          <div className="top-nav-user">
            <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', marginRight: '8px', borderRadius: '4px' }} onClick={() => setLang(lang === 'en' ? 'th' : 'en')}>
              {lang === 'en' ? 'TH' : 'EN'}
            </button>
            <div className="top-nav-avatar">{user?.name?.[0] || 'U'}</div>
            <button className="btn btn-ghost btn-sm" style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--border)' }} onClick={handleLogout}>
              {t('logout')}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
      {showStaff && (
        <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowStaff(false)}>
          <motion.div className="modal" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }} onClick={e => e.stopPropagation()} style={{ maxWidth: 460 }}>
            <div className="modal-header">
              <h2 className="modal-title" style={{ fontFamily: 'var(--font)' }}><KeyRound size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />{t('staff')}</h2>
              <button className="modal-close" onClick={() => setShowStaff(false)}><X size={20} /></button>
            </div>
            <div className="staff-list">
              {staffList.map(s => (
                <div className="staff-item" key={s.id}>
                  <span className="staff-name">{s.name}</span>
                  <div className="staff-actions">
                    {editId === s.id ? (
                      <>
                        <input className="form-input" style={{ width: 100, padding: '4px 8px', fontSize: '0.8rem' }} type="password" placeholder="New PIN" value={editPin} onChange={e => setEditPin(e.target.value)} />
                        <button className="btn btn-success btn-sm" onClick={() => changePin(s.id)}>Save</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => { setEditId(null); setEditPin(''); }}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-ghost btn-sm" onClick={() => setEditId(s.id)}>Change PIN</button>
                        <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(s.id)}>Delete</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'end' }}>
              <div style={{ flex: 1 }}>
                <label className="form-label">Name</label>
                <input className="form-input" placeholder="Staff Name" value={newName} onChange={e => setNewName(e.target.value)} />
              </div>
              <div style={{ width: 100 }}>
                <label className="form-label">Role</label>
                <select className="form-input" value={newRole} onChange={e => setNewRole(e.target.value)}>
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              <div style={{ width: 100 }}>
                <label className="form-label">PIN</label>
                <input className="form-input" type="password" placeholder="≥4 digits" value={newPin} onChange={e => setNewPin(e.target.value)} />
              </div>
              <button className="btn btn-primary btn-sm" onClick={addStaff} style={{ marginBottom: 0, height: 38 }}>Add</button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this staff member?"
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete(null)}
      />
    </>
  );
}
