import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDialog({ open, title, message, confirmText, cancelText, variant, onConfirm, onCancel }) {
  if (!open) return null;

  const btnClass = variant === 'danger' ? 'btn btn-danger' : 'btn btn-primary';

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal confirm-modal" onClick={e => e.stopPropagation()}>
        <div className="confirm-icon">
          <AlertTriangle size={32} />
        </div>
        <h3 className="confirm-title">{title || 'Confirm Action'}</h3>
        <p className="confirm-message">{message}</p>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancel}>{cancelText || 'Cancel'}</button>
          <button className={btnClass} onClick={onConfirm}>{confirmText || 'Confirm'}</button>
        </div>
      </div>
    </div>
  );
}
