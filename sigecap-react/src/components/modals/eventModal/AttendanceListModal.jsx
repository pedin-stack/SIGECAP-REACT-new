import React from 'react';
import { 
  ActionButton, 
  CancelButton 
} from '../../buttons/Buttons';

const AttendanceListModal = ({ isOpen, onClose, events, loading, onSelectEvent }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="custom-modal large-modal">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold text-white m-0">Lista de Presença</h3>
          <button className="text-white bg-transparent border-0 fs-3" onClick={onClose}>&times;</button>
        </div>

        <div className="table-responsive mb-3">
          <table className="users-table">
            <thead>
              <tr>
                <th>Evento</th>
                <th>Data</th>
                <th>Horário</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="text-center">Carregando eventos...</td></tr>
              ) : (events && events.length > 0 ? (
                events.map((ev) => (
                  <tr key={ev.id}>
                    <td>{ev.name}</td>
                    <td>{ev.date ? (new Date(ev.date)).toLocaleDateString('pt-BR') : '-'}</td>
                    <td>{ev.startTime ? (new Date(ev.startTime)).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                    <td>
                      <ActionButton onClick={() => onSelectEvent(ev)} label="Ver Lista" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="text-center">Nenhum evento encontrado.</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-end">
          <CancelButton onClick={onClose} label="Fechar" />
        </div>
      </div>
    </div>
  );
};

export default AttendanceListModal;