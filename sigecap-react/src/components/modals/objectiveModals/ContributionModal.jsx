import React, { useState, useEffect } from 'react';
import { 
  CreateButton,   
  CancelButton,
} from '../../buttons/Buttons';

const ContributionModal = ({ isOpen, onClose, onSave, loading }) => {
  const [description, setDescription] = useState('DATAMOCK');
  const [value, setValue] = useState('');
  const [date, setDate] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setDescription('DATAMOCK');
      setValue('');
      setDate(new Date().toISOString().split('T')[0]);
      setFile(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClickSave = () => {
    onSave({ 
      value, 
      description, 
      date, 
      file 
    });
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000
    }}>
      <div className="custom-modal bg-custom-surface border border-secondary rounded p-4 text-white" style={{ width: '100%', maxWidth: '500px', zIndex: 3001 }}>
        
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold text-white m-0">Nova Contribuição</h4>

        </div>

        <form>
          {/* Valor */}
          <div className="form-group mb-3">
            <label className="text-custom-secondary mb-1">Valor (R$)</label>
            <input 
              type="number" 
              className="form-control form-control-custom fw-bold"
                step="0.01" 
                placeholder="0,00"
                value={value} 
                onChange={(e) => setValue(e.target.value)} 
                autoFocus
            />
          </div>

          {/* Descrição */}
          
          
          {/* Documento */}
          <div className="form-group mb-4">
            <label className="text-custom-secondary mb-1">Comprovante</label>
            <input 
              type="file" 
              className="form-control form-control-sm form-control-custom" 
                onChange={(e) => setFile(e.target.files[0])} 
            />
          </div>

          <div className="d-flex justify-content-end gap-2 pt-3 border-top border-secondary">
            <CancelButton onClick={onClose} label="Cancelar" />
            <CreateButton onClick={handleClickSave} label={loading ? "Salvando..." : "Salvar Contribuição"} disabled={loading} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContributionModal;