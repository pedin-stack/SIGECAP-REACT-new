import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Sidebar from '../components/Sidebar';
import '../App.css';
import '../assets/css/Events.css';
import UserButton from '../components/UserButton';

const Events = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  
  // --- ESTADOS DOS MODAIS ---
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // --- ESTADO DOS DADOS ---
  const [events, setEvents] = useState([
    // Exemplo inicial
    { id: '1', title: 'Reunião do Capítulo', start: '2023-12-25' } 
  ]);
  
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Estado do formulário de criação
  const [newEventData, setNewEventData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: ''
  });

  // --- FUNÇÕES DE MANIPULAÇÃO ---

  // Abrir modal de criação
  const handleOpenCreateModal = () => {
    // Limpa o formulário
    setNewEventData({ title: '', date: '', startTime: '', endTime: '' });
    setShowCreateModal(true);
  };

  // Guardar o evento
  const handleCreateEvent = () => {
    if (!newEventData.title || !newEventData.date) {
      alert("Por favor, preencha o título e a data.");
      return;
    }

    // Montar a string de data/hora para o FullCalendar (ISO 8601)
    // Se tiver hora: '2023-10-10T14:00'
    // Se não tiver hora: '2023-10-10' (Dia inteiro)
    let start = newEventData.date;
    let end = newEventData.date;

    if (newEventData.startTime) {
      start = `${newEventData.date}T${newEventData.startTime}`;
    }
    
    if (newEventData.endTime) {
      end = `${newEventData.date}T${newEventData.endTime}`;
    }

    const newEvent = {
      id: Date.now().toString(), // ID único simples
      title: newEventData.title,
      start: start,
      end: newEventData.endTime ? end : undefined, // Só envia end se tiver hora de fim
      allDay: !newEventData.startTime // Se não tem hora, é o dia todo
    };

    setEvents([...events, newEvent]);
    setShowCreateModal(false);
  };

  // Clicar num evento existente
  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setShowDetailModal(true);
  };

  // Excluir evento
  const handleDeleteEvent = () => {
    if (selectedEvent) {
        if(window.confirm(`Tem certeza que deseja apagar "${selectedEvent.title}"?`)){
            setEvents(events.filter(e => e.id !== selectedEvent.id));
            setShowDetailModal(false);
            setSelectedEvent(null);
        }
    }
  };

  return (
    <div className="d-flex bg-custom-main" style={{ minHeight: '100vh' }}>
      
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />

      <main className="main-content p-4 flex-grow-1" style={{ overflowY: 'auto' }}>
        
        {/* Cabeçalho */}
        <header className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold text-white">Eventos</h1>
          <div>
           <UserButton />
          </div>
        </header>

        {/* Área do Calendário */}
        <div className="calendar-wrapper">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="pt-br"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'customAddButton' // Nosso botão customizado
            }}
            customButtons={{
              customAddButton: {
                text: 'Criar Evento',
                click: handleOpenCreateModal
              }
            }}
            events={events}
            eventClick={handleEventClick}
            height="auto"
            minHeight="800px"
          />
        </div>

        {/* --- MODAL DE CRIAÇÃO --- */}
        {showCreateModal && (
          <div className="modal-overlay">
            <div className="custom-modal">
              <h3 className="fw-bold text-white mb-4">Novo Evento</h3>
              
              <div className="form-group">
                <label>Nome do evento</label>
                <input 
                  type="text" 
                  placeholder="Ex: Iniciação" 
                  value={newEventData.title}
                  onChange={(e) => setNewEventData({...newEventData, title: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Data</label>
                <input 
                  type="date" 
                  value={newEventData.date}
                  onChange={(e) => setNewEventData({...newEventData, date: e.target.value})}
                />
              </div>

              {/* Grid para Horários (Início e Fim) */}
              <div className="row">
                <div className="col-6">
                  <div className="form-group">
                    <label>Início</label>
                    <input 
                      type="time" 
                      value={newEventData.startTime}
                      onChange={(e) => setNewEventData({...newEventData, startTime: e.target.value})}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group">
                    <label>Encerramento</label>
                    <input 
                      type="time" 
                      value={newEventData.endTime}
                      onChange={(e) => setNewEventData({...newEventData, endTime: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowCreateModal(false)}>Cancelar</button>
                <button className="btn-confirm" onClick={handleCreateEvent}>Criar</button>
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL DE DETALHES --- */}
        {showDetailModal && selectedEvent && (
          <div className="modal-overlay">
            <div className="custom-modal">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h2 className="fw-bold text-white m-0">{selectedEvent.title}</h2>
                <button className="text-white bg-transparent border-0 fs-4" onClick={() => setShowDetailModal(false)}>&times;</button>
              </div>
              
              <div className="text-white mb-4">
                <p><strong>Data:</strong> {selectedEvent.start.toLocaleDateString('pt-BR')}</p>
                {/* Mostra horário se existir */}
                {!selectedEvent.allDay && (
                    <p>
                        <strong>Horário:</strong> {selectedEvent.start.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                        {selectedEvent.end && ` - ${selectedEvent.end.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}`}
                    </p>
                )}
                
                <hr className="border-secondary" />
                
                <h5 className="text-custom-accent">Membros Confirmados</h5>
                <ul className="text-custom-secondary small">
                    <li>Carregando lista... (Fictício)</li>
                </ul>
              </div>

              <div className="modal-actions justify-content-between w-100">
                <button className="btn-delete" onClick={handleDeleteEvent}>Cancelar Evento</button>
                <button className="btn-cancel" onClick={() => setShowDetailModal(false)}>Fechar</button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Events;