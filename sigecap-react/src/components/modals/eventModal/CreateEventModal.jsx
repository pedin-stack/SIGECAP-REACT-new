import React from 'react';

const CreateEventModal = ({ isOpen, onClose, data, setData, onSave }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="custom-modal">
        <h3 className="fw-bold text-white mb-4">Novo Evento</h3>

        <div className="form-group">
          <label>Nome do evento</label>
          <input
            type="text"
            placeholder="Ex: Iniciação"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Data</label>
          <input
            type="date"
            value={data.date}
            onChange={(e) => setData({ ...data, date: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            value={data.eventRole}
            onChange={(e) => setData({ ...data, eventRole: e.target.value })}
          >
            <option value="">Selecione...</option>
            <option value="SCHEDULED">Agendado</option>
            <option value="IN_COURSE">Acontecendo</option>
            <option value="FINISHED">Finalizado</option>
          </select>
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

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="btn-confirm" onClick={onSave}>Criar</button>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;