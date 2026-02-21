import React, { useState, useEffect } from 'react';
import useManualDues from '../../../use/useManualDues';
import SuccessModal from '../successModal';
import ErrorModal from '../errorModal';

const ManualDuesModal = ({ isOpen, onClose }) => {
  const { members, loading, submitting, statusModal, setStatusModal, loadMembers, manualPay } = useManualDues();
  const [selectedMember, setSelectedMember] = useState('');
  const [referenceMonth, setReferenceMonth] = useState('Novembro');
  const [value, setValue] = useState('30.00');

  useEffect(() => {
    if (isOpen) {
      loadMembers();
      setSelectedMember('');
      setReferenceMonth(new Date().toLocaleString('pt-BR', { month: 'long' }).replace(/\b\w/g, c => c.toUpperCase()) || 'Novembro');
      setValue('30.00');
    }
  }, [isOpen, loadMembers]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    const payload = {
      memberId: selectedMember,
      referenceMonth: referenceMonth,
      value: parseFloat(value),
      type: 'DUES'
    };
    await manualPay(payload);
  };

  const closeStatus = () => {
    const wasSuccess = statusModal?.type === 'success';
    setStatusModal({ isOpen: false, type: 'success', message: '' });
    if (wasSuccess) onClose();
  };

  return (
   <div className="modal-overlay" style={{ zIndex: 1060 }}>
      <div className="custom-modal">
         <h4 className="fw-bold text-white mb-3">Inserir Pagamento Manual</h4>

         <div className="form-group mb-3">
            <label className="text-white">Membro</label>
            <select 
              className="form-select-custom form-control"
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
            >
               <option value="">{loading ? 'Carregando...' : 'Selecione...'}</option>
               {members && members.map(member => (
                 <option key={member.id} value={member.id}>
                   {member.name}
                 </option>
               ))}
            </select>
         </div>

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

         <div className="modal-actions d-flex justify-content-end gap-2">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={submitting}>
              Voltar
            </button>
            <button type="button" className="btn-confirm" onClick={handleConfirm} disabled={!selectedMember || submitting}>
              {submitting ? 'Processando...' : 'Confirmar'}
            </button>
         </div>
      </div>

      {statusModal?.isOpen && statusModal.type === 'success' && (
        <SuccessModal isOpen onClose={closeStatus} message={statusModal.message} />
      )}

      {statusModal?.isOpen && statusModal.type === 'error' && (
        <ErrorModal isOpen onClose={closeStatus} message={statusModal.message} />
      )}
   </div>
  );
};

export default ManualDuesModal;