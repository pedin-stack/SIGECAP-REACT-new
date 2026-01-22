import React, { useState } from 'react';

const MovementModal = ({ isOpen, onClose, onSave, loading }) => {
  const [type, setType] = useState('entrada');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [date, setDate] = useState('');
  const [file, setFile] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSave({ type, description, value, date, file });
    setDescription(''); setValue(''); setFile(null);
  };

  return (
    <div className="modal-overlay">
      <div className="custom-modal">
        <h3 className="fw-bold text-white mb-4">Nova Movimentação</h3>
        <form>
          <div className="form-group">
            <label>Descrição</label>
            <input
              type="text"
              placeholder="Ex: Velas para iniciação"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Tipo</label>
            <div className="d-flex gap-2">
              <button type="button" 
                className={`btn w-50 ${type === 'entrada' ? 'btn-custom' : 'btn-outline-secondary text-white'}`}
                onClick={() => setType('entrada')}
              >Entrada</button>
              <button type="button" 
                className={`btn w-50 ${type === 'saida' ? 'btn-custom' : 'btn-outline-secondary text-white'}`}
                onClick={() => setType('saida')}
              >Saída</button>
            </div>
          </div>

          <div className="row">
            <div className="col-6">
              <div className="form-group">
                <label>Valor (R$)</label>
                <input type="number" step="0.01" value={value} onChange={(e) => setValue(e.target.value)} />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label>Documento</label>
                <input type="file" className="form-control form-control-custom" onChange={(e) => setFile(e.target.files[0])} />
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="button" className="btn-confirm" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovementModal;