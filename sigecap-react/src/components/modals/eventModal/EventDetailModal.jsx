import React from 'react';

const EventDetailModal = ({ 
  isOpen, 
  onClose, 
  event, 
  onEdit, 
  onDelete, 
  attendees, 
  attendeesLoading, 
  userConfirmed, 
  attendanceLoading, 
  onToggleAttendance 
}) => {
  if (!isOpen || !event) return null;

  return (
    <div className="modal-overlay">
      <div className="custom-modal">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h2 className="fw-bold text-white m-0">{event.title}</h2>
          <button className="text-white bg-transparent border-0 fs-4" onClick={onClose}>&times;</button>
        </div>

        <div className="text-white mb-4">
          <p>
            <strong>Data:</strong>{' '}
            {event.start ? event.start.toLocaleDateString('pt-BR') : ''}
          </p>
          {!event.allDay && event.start && (
            <p>
              <strong>Horário:</strong>{' '}
              {event.start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              {event.end && ` - ${event.end.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`}
            </p>
          )}

          <hr className="border-secondary" />

          <h5 className="text-custom-accent">Membros Confirmados</h5>
          {attendeesLoading ? (
            <div className="text-custom-secondary small">Carregando lista...</div>
          ) : (
            <ul className="text-custom-secondary small">
              {attendees && attendees.length > 0 ? (
                attendees.map((u) => <li key={u.attendanceId}>{u.memberName}</li>)
              ) : (
                <li>Nenhum membro confirmado ainda.</li>
              )}
            </ul>
          )}
        </div>

        <div className="modal-actions justify-content-between w-100">
          <div>
            <button className="btn-edit" onClick={onEdit}>Editar</button>
            <button className="btn-delete ms-2" onClick={onDelete}>Deletar</button>
          </div>
          <div className="d-flex align-items-center gap-2">
            
            {/* Botão de Presença Embutido */}
            <button
              className={`btn-confirm ${userConfirmed ? 'btn-confirm-desmarcar' : ''}`}
              onClick={onToggleAttendance}
              disabled={attendanceLoading}
            >
              {attendanceLoading 
                ? (userConfirmed ? 'Processando...' : 'Confirmando...') 
                : (userConfirmed ? 'Desmarcar presença' : 'Confirmar Presença')
              }
            </button>

            <button className="btn-cancel" onClick={onClose}>Fechar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;