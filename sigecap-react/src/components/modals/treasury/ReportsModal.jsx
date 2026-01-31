import React, { useState } from 'react';
import { 
  CreateButton,  
  ExcludeButton, 
  CancelButton,
  EditButton,
  ActionButton
} from '../../buttons/Buttons';

const ReportsModal = ({ isOpen, onClose, onGenerate }) => {
  // Estados locais para controlar os inputs de data
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!startDate || !endDate) {
        alert("Por favor, selecione as datas de início e fim.");
        return;
    }
    // Envia os dados para o hook processar
    onGenerate({ startDate, endDate });
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1060 }}>
       <div className="custom-modal">
          <h3 className="fw-bold text-white mb-4">Gerar Relatório</h3>
          
          <div className="row">
             <div className="col-6">
                <div className="form-group">
                   <label className="text-white">Data Início</label>
                   <input 
                     type="date" 
                     className="form-control form-control-custom"
                     value={startDate}
                     onChange={(e) => setStartDate(e.target.value)}
                   />
                </div>
             </div>
             <div className="col-6">
                <div className="form-group">
                   <label className="text-white">Data Fim</label>
                   <input 
                     type="date" 
                     className="form-control form-control-custom" 
                     value={endDate}
                     onChange={(e) => setEndDate(e.target.value)}
                   />
                </div>
             </div>
          </div>

          <div className="modal-actions mt-4 d-flex justify-content-end gap-2">
             {/* CORREÇÃO: Usar onClose recebido via props */}
             <CancelButton onClick={onClose} label="Cancelar" />
             
             <ActionButton onClick={handleConfirm} label="Gerar Relatório" />
          </div>
       </div>
    </div>
  );
};

export default ReportsModal;