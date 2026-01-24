import React from 'react';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="card bg-custom-surface border-0 shadow-lg text-center" style={{ width: '90%', maxWidth: '420px' }}>
        <div className="card-body p-4 d-flex flex-column">
          <div className="mb-3 d-flex justify-content-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
              <path d="M10 11v6"></path>
              <path d="M14 11v6"></path>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
            </svg>
          </div>

          <h5 className="fw-bold text-white mb-2">{title || 'Confirmar exclusão'}</h5>
          <p className="text-custom-secondary mb-4">{message || 'Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.'}</p>

          <div className="d-flex justify-content-between gap-2 mt-auto">
            <button className="btn btn-secondary w-50" onClick={onClose}>Cancelar</button>
            <button className="btn btn-delete w-50" onClick={onConfirm}>Excluir</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
