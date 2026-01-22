import React from 'react';

const DuesModal = ({ isOpen, onClose, onOpenManualEntry }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="custom-modal modal-xl"> 
        <div className="d-flex justify-content-between align-items-center mb-4">
           <h3 className="fw-bold text-white m-0">Mensalidades 2025</h3>
           <button className="btn-cancel" onClick={onClose}>Fechar</button>
        </div>
        <div className="table-responsive mb-4">
           {/* ... Tabela Estática ou Dinâmica aqui (mantive simplificado para brevidade) ... */}
           <table className="table-custom">
              <thead><tr><th>Membro</th><th>Status Jan</th></tr></thead>
              <tbody>
                 <tr><td>Exemplo Membro</td><td><span className="status-badge status-paid">Pago</span></td></tr>
              </tbody>
           </table>
        </div>
        <div className="d-flex justify-content-end">
          <button className="btn-confirm" onClick={onOpenManualEntry}>+ Inserir Manualmente</button>
        </div>
      </div>
    </div>
  );
};

export default DuesModal;