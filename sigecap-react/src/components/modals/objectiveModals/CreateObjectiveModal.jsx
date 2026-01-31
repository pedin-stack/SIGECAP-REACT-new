import React, { useEffect, useState } from 'react';

const CreateObjectiveModal = ({ isOpen, onClose, initialData, createObjective, updateObjective }) => {
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [financialGoal, setFinancialGoal] = useState('');

  useEffect(() => {
    if (initialData) {
      setDescription(initialData.description || '');
      setDeadline(initialData.deadline ? initialData.deadline.split('T')[0] : '');
      setFinancialGoal(initialData.financialGoal ?? initialData.valor ?? '');
    } else {
      setDescription('');
      setDeadline('');
      setFinancialGoal('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      description,
      deadline,
      financialGoal: parseFloat(financialGoal)
    };
    try {
      if (initialData && updateObjective) {
        await updateObjective(initialData.id, payload);
      } else if (createObjective) {
        await createObjective(payload);
      }
    } catch (err) {
      console.error('Erro no submit do CreateObjectiveModal', err);
    }
  };
  return (
    <div className="modal-overlay animate-fade-in" style={{ zIndex: 1055 }}>
      <div className="card bg-custom-surface text-white p-3" style={{ width: '95%', maxWidth: '540px' }}>
        <div className="modal-header bg-transparent border-0 d-flex align-items-start justify-content-between">
          <h5 className="modal-title text-white">{initialData ? 'Editar objetivo' : 'Definir novo objetivo'}</h5>
          <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={onClose}></button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label fw-bold text-custom-secondary">Descrição</label>
              <input className="form-control form-control-custom" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold text-custom-secondary">Data de encerramento</label>
              <input type="date" className="form-control form-control-custom" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label  fw-bold text-custom-secondary">Valor visado</label>
              <input type="number" step="0.01" className="form-control form-control-custom" value={financialGoal} onChange={(e) => setFinancialGoal(e.target.value)} required />
            </div>
          </div>
          <div className="modal-footer bg-transparent border-0 d-flex justify-content-end">
            <button type="button" className="btn btn-secondary fw-bold me-2" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-custom fw-bold">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateObjectiveModal;
