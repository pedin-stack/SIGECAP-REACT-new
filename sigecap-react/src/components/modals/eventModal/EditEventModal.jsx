import React from 'react';

const EditEventModal = ({ isOpen, onClose, data, setData, onSave }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="custom-modal large-modal">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold text-white m-0">Editar Evento</h3>
          <button className="text-white bg-transparent border-0 fs-3" onClick={onClose}>&times;</button>
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

          <div className="form-group">
            <label>Status</label>
            <select
              value={data.eventRole}
              onChange={(e) => setData({ ...data, eventRole: e.target.value })}
              required
            >
              <option value="">Selecione...</option>
              <option value="SCHEDULED">Agendado</option>
              <option value="IN_COURSE">Acontecendo</option>
              <option value="FINISHED">Finalizado</option>
            </select>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button type="button" className="btn btn-outline-secondary text-white" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-custom fw-bold">Salvar Alterações</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;