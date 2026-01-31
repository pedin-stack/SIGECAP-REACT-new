import React from 'react';
import { 
  ActionButton, 
  CancelButton,
  CreateButton,
  ExcludeButton
} from '../../buttons/Buttons';

const EditEventModal = ({ isOpen, onClose, data, setData, onSave }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="custom-modal large-modal">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold text-white m-0">Editar Evento</h3> 
        </div>

        <form className="modal-form" onSubmit={(e) => { e.preventDefault(); onSave(); }}>
          <div className="form-group">
            <label>Nome do evento</label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Data</label>
            <input
              type="date"
              value={data.date}
              onChange={(e) => setData({ ...data, date: e.target.value })}
              required
            />
          </div>

          <div className="row">
            <div className="col-6">
              <div className="form-group">
                <label>Início</label>
                <input
                  type="time"
                  value={data.startTime}
                  onChange={(e) => setData({ ...data, startTime: e.target.value })}
                />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label>Encerramento</label>
                <input
                  type="time"
                  value={data.endTime}
                  onChange={(e) => setData({ ...data, endTime: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4">
           <CancelButton onClick={onClose} label="Cancelar" />
            <CreateButton onClick={onSave} label="Salvar Alterações" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;