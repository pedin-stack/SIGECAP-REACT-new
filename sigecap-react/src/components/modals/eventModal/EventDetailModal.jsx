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
      {/* AQUI: Aumentei a largura para 650px para caber os botões */}
      <div className="custom-modal" style={{ width: '650px', maxWidth: '95vw' }}>
        
        {/* Cabeçalho */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h2 className="fw-bold text-white m-0">{event.title}</h2>
          <button className="btn-close btn-close-white" onClick={onClose}></button>
        </div>

        {/* Conteúdo */}
        <div className="text-white mb-4">
          <p className="mb-2">
            <strong>Data:</strong>{' '}
            {event.start ? event.start.toLocaleDateString('pt-BR') : ''}
          </p>
          {!event.allDay && event.start && (
            <p className="mb-2">
              <strong>Horário:</strong>{' '}
              {event.start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              {event.end && ` - ${event.end.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`}
            </p>
          )}

          <hr className="border-secondary my-3" />

          <h5 className="text-info mb-3">Membros Confirmados</h5>
          {attendeesLoading ? (
            <div className="text-secondary small">Carregando lista...</div>
          ) : (
            <ul className="list-unstyled text-secondary small mb-0" style={{ maxHeight: '150px', overflowY: 'auto' }}>
              {attendees && attendees.length > 0 ? (
                attendees.map((u) => <li key={u.attendanceId} className="mb-1">• {u.memberName}</li>)
              ) : (
                <li>Nenhum membro confirmado ainda.</li>
              )}
            </ul>
          )}
        </div>

        {/* Ações (Rodapé) */}
        <div className="d-flex justify-content-between align-items-center w-100 mt-4">
          
          {/* Grupo Esquerda: Editar/Deletar */}
          <div className="d-flex gap-2">
            <button 
                className="btn btn-warning fw-bold px-4 text-nowrap" 
                onClick={onEdit}
            >
                Editar
            </button>
            <button 
                className="btn btn-danger px-4 text-nowrap" 
                onClick={onDelete}
            >
                Deletar
            </button>
          </div>

          {/* Grupo Direita: Presença/Fechar */}
          <div className="d-flex gap-2 align-items-center">
            
            <button
              // Adicionei 'text-nowrap' para forçar linha única
              className={`btn ${userConfirmed ? 'btn-danger' : 'btn-success'} text-nowrap`}
              onClick={onToggleAttendance}
              disabled={attendanceLoading}
              style={{ minWidth: '180px' }} // Garante um tamanho mínimo visualmente agradável
            >
              {attendanceLoading 
                ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processando...
                    </>
                  ) 
                : (userConfirmed ? 'Desmarcar Presença' : 'Confirmar Presença')
              }
            </button>

            <button className="btn btn-secondary text-nowrap" onClick={onClose}>
                Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;