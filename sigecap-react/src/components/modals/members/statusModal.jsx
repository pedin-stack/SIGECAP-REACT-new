import React from 'react';

const StatusModal = ({ isOpen, onClose, type, message }) => {
  if (!isOpen) return null;

  const isSuccess = type === 'success';
  
  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div className="custom-modal text-center" style={{ maxWidth: '400px' }}>
        <div className="mb-3">
            {isSuccess ? (
                <div style={{ fontSize: '3rem', color: '#28a745' }}>✓</div>
            ) : (
                <div style={{ fontSize: '3rem', color: '#dc3545' }}>✕</div>
            )}
        </div>
        <h4 className="fw-bold text-white mb-2">{isSuccess ? 'Sucesso!' : 'Erro!'}</h4>
        <p className="text-white mb-4">{message}</p>
        <button className="btn-confirm w-100" onClick={onClose}>
            OK
        </button>
      </div>
    </div>
  );
};

export default StatusModal;