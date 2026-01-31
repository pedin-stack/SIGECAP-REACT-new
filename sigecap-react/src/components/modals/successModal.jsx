import React from 'react';
import { 
  ActionButton
} from '../buttons/Buttons';

const SuccessModal = ({ isOpen, onClose, message }) => {

  if (!isOpen) return null;

  return (
    <div className="modal-overlay animate-fade-in">

      <div 
        className="card bg-custom-surface border-0 shadow-lg text-center"
        style={{ 
          width: '90%', 
          maxWidth: '400px', 
          minHeight: '300px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div className="card-body d-flex flex-column justify-content-between align-items-center p-4">

          <div className="mt-2">
            <div className="mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          
                <circle cx="12" cy="12" r="10"></circle>
            
                <polyline points="9 11 12 14 16 6"></polyline> 
             
              </svg>
            </div>
            <h4 className="fw-bold text-white mb-1">Sucesso!</h4>
          </div>

          <div className="flex-grow-1 d-flex align-items-center justify-content-center my-3">
            <p className="text-custom-secondary m-0 px-2" style={{ fontSize: '1.1rem' }}>
              {message || "Operação realizada com sucesso!"}
            </p>
          </div>

         <ActionButton onClick={onClose} label="Fechar" />

        </div>
      </div>
    </div>
  );
};

export default SuccessModal;