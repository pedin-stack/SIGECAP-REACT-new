import React, { useState } from 'react';

const ManualDuesModal = ({ isOpen, onClose, members, onSave }) => {
  const [selectedMember, setSelectedMember] = useState('');
  const [referenceMonth, setReferenceMonth] = useState('Novembro'); // Idealmente dinâmico
  const [value, setValue] = useState('30.00');

  if (!isOpen) return null;

  const handleConfirm = () => {
    // Monta o objeto para enviar ao Hook -> API
    const payload = {
      memberId: selectedMember,
      month: referenceMonth,
      value: parseFloat(value),
      type: 'INCOMING' // ou 'DUES' dependendo do seu backend
    };
    onSave(payload);
  };
  
  return (
   <div className="modal-overlay" style={{ zIndex: 1060 }}>
      <div className="custom-modal">
         <h4 className="fw-bold text-white mb-3">Inserir Pagamento</h4>
         
         {/* Seleção de Membro */}
         <div className="form-group mb-3">
            <label className="text-white">Membro</label>
            <select 
              className="form-select-custom form-control"
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
            >
               <option value="">Selecione...</option>
               {members && members.map(member => (
                 <option key={member.id} value={member.id}>
                   {member.name}
                 </option>
               ))}
            </select>
         </div>

         {/* Mês de Referência */}
         <div className="form-group mb-3">
            <label className="text-white">Mês de Referência</label>
            <select 
              className="form-select-custom form-control"
              value={referenceMonth}
              onChange={(e) => setReferenceMonth(e.target.value)}
            >
               <option value="Janeiro">Janeiro</option>
               <option value="Fevereiro">Fevereiro</option>
               <option value="Março">Março</option>
               <option value="Abril">Abril</option>
               <option value="Maio">Maio</option>
               <option value="Junho">Junho</option>
               <option value="Julho">Julho</option>
               <option value="Agosto">Agosto</option>
               <option value="Setembro">Setembro</option>
               <option value="Outubro">Outubro</option>
               <option value="Novembro">Novembro</option>
               <option value="Dezembro">Dezembro</option>
            </select>
         </div>

         {/* Valor */}
         <div className="form-group mb-4">
            <label className="text-white">Valor (R$)</label>
            <input 
              type="number" 
              className="form-control"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              step="0.01"
            />
         </div>

         {/* Ações */}
         <div className="modal-actions d-flex justify-content-end gap-2">
            {/* CORREÇÃO: Usar onClose ao invés de setShowManualDuesModal que não existe aqui */}
            <button type="button" className="btn-cancel" onClick={onClose}>
              Voltar
            </button>
            <button type="button" className="btn-confirm" onClick={handleConfirm}>
              Confirmar
            </button>
         </div>
      </div>
   </div>
  );
};

export default ManualDuesModal;