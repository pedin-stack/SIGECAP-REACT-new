import React from 'react';
import { 
  CreateButton,  
  ExcludeButton, 
  CancelButton 
} from '../../buttons/Buttons';

const AttendanceDetailsModal = ({ isOpen, onClose, event, attendees, loading, onStatusChange }) => {
  if (!isOpen || !event) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 1060 }}>
      <div className="custom-modal">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold text-white m-0">Membros - {event.name}</h4>
          <button className="text-white bg-transparent border-0 fs-3" onClick={onClose}>&times;</button>
        </div>

        <div className="mb-3" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {loading ? (
            <div className="text-white text-center">Carregando lista...</div>
          ) : (
            <ul className="list-group bg-transparent">
              {attendees && attendees.length > 0 ? (
                attendees.map((m) => (
                  <li key={m.attendanceId} className="list-group-item bg-transparent border-secondary text-white d-flex justify-content-between align-items-center">
                    <span style={{ color: m.status === 'PRESENT' ? '#28a745' : (m.status === 'ABSENT' ? '#dc3545' : '#ff9800') }}>
                      {m.memberName}
                    </span>
                    <div>
                      {m.status === 'PRESENT' ? (
                        <ExcludeButton onClick={() => onStatusChange(m.attendanceId, event.id, m.memberId, 'ABSENT')} label="Marcar ausente" />
                      ) : (
                        <CreateButton onClick={() => onStatusChange(m.attendanceId, event.id, m.memberId, 'PRESENT')} label="Marcar presente" />
                      )}
                    </div>
                  </li>
                ))
              ) : (
                <div className="text-white text-center">Nenhum membro vinculado a este evento.</div>
              )}
            </ul>
          )}
        </div>

        <div className="d-flex justify-content-end">
          <CancelButton onClick={onClose} label="Fechar" />
        </div>
      </div>
    </div>
  );
};

export default AttendanceDetailsModal;