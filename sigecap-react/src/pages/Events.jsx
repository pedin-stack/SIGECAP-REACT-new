import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Sidebar from '../components/Sidebar';
import '../App.css';
import '../assets/css/Events.css';
import UserButton from '../components/UserButton';
import EventService from '../api/EventService';

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

  // Carrega eventos do backend
  const loadEvents = async (page = 0, size = 100) => {
    try {
      const data = await EventService.findAll(page, size);
      // data pode ser uma Page com .content ou um array
      const list = Array.isArray(data?.content) ? data.content : (Array.isArray(data) ? data : []);
      const mapped = list.map((e) => ({
        id: e.id ? String(e.id) : Date.now().toString(),
        title: e.name || '',
        start: e.startTime || e.date || null,
        end: e.endTime || null,
        allDay: !(e.startTime || e.endTime)
      }));
      setEvents(mapped);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[Events] erro ao carregar eventos:', err);
    }
  };

  useEffect(() => {
    loadEvents(0, 100);
  }, []);
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editEventData, setEditEventData] = useState({
    id: null,
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    eventRole: ''
  });

  // Estado do formulário de criação
  const [newEventData, setNewEventData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    eventRole: ''
  });

  // --- FUNÇÕES DE MANIPULAÇÃO ---

  // Abrir modal de criação
  const handleOpenCreateModal = () => {
    // Limpa o formulário
    setNewEventData({ title: '', date: '', startTime: '', endTime: '', eventRole: '' });
    setShowCreateModal(true);
  };

  // Guardar o evento
  const handleCreateEvent = async () => {
    if (!newEventData.title || !newEventData.date) {
      alert("Por favor, preencha o título e a data.");
      return;
    }

    if (!newEventData.eventRole) {
      alert('Por favor, selecione o status do evento.');
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
      title: newEventData.title,
      start: start,
      end: newEventData.endTime ? end : undefined,
      allDay: !newEventData.startTime
    };

    // Montar payload compatível com EventRequestDTO do backend
    // Campos esperados: name, date (LocalDateTime), local, description, startTime, endTime, eventRole, eventPics
    const payload = {
      name: newEventData.title,
      // date: usar o início quando houver, senão data às 00:00
      date: newEventData.startTime ? start : `${newEventData.date}T00:00:00`,
      startTime: newEventData.startTime ? start : null,
      endTime: newEventData.endTime ? end : null,
      eventRole: newEventData.eventRole,
      eventPics: ''
    };

    try {
      // eslint-disable-next-line no-console
      console.debug('[Events] payload antes do POST:', payload);
      const created = await EventService.save(payload);
      // eslint-disable-next-line no-console
      console.info('[Events] evento criado:', created);

      // Mapear resposta para o formato do FullCalendar
      const fcEvent = {
        id: created.id ? String(created.id) : Date.now().toString(),
        title: created.name || newEvent.title,
        start: created.startTime || created.date || newEvent.start,
        end: created.endTime || newEvent.end,
        allDay: !newEventData.startTime
      };

      setEvents([...events, fcEvent]);
      setShowCreateModal(false);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[Events] erro ao salvar evento:', err);
      alert('Erro ao salvar evento. Veja o console.');
    }
  };
  
  // Helpers para formatar Date -> 'YYYY-MM-DD' e 'HH:mm'
  const toDateString = (d) => {
    if (!d) return '';
    const dt = (d instanceof Date) ? d : new Date(d);
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const dd = String(dt.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const toTimeString = (d) => {
    if (!d) return '';
    const dt = (d instanceof Date) ? d : new Date(d);
    const hh = String(dt.getHours()).padStart(2, '0');
    const mi = String(dt.getMinutes()).padStart(2, '0');
    return `${hh}:${mi}`;
  };

  // Abrir modal de edição com dados do evento selecionado
  const handleOpenEditModal = () => {
    if (!selectedEvent) return;
    const id = selectedEvent.id;
    const title = selectedEvent.title || '';
    const start = selectedEvent.start || selectedEvent.startStr || null;
    const end = selectedEvent.end || selectedEvent.endStr || null;
    setEditEventData({
      id: id || null,
      title: title,
      date: toDateString(start),
      startTime: toTimeString(start),
      endTime: toTimeString(end),
      eventRole: selectedEvent.extendedProps?.eventRole || selectedEvent.eventRole || ''
    });
    setShowEditModal(true);
    setShowDetailModal(false);
  };

  const handleUpdateEvent = async () => {
    if (!editEventData.title || !editEventData.date) {
      alert('Título e data são obrigatórios');
      return;
    }
    if (!editEventData.eventRole) {
      alert('Selecione o status do evento');
      return;
    }

    let start = editEventData.date;
    let end = editEventData.date;
    if (editEventData.startTime) start = `${editEventData.date}T${editEventData.startTime}`;
    if (editEventData.endTime) end = `${editEventData.date}T${editEventData.endTime}`;

    const payload = {
      name: editEventData.title,
      date: editEventData.startTime ? start : `${editEventData.date}T00:00:00`,
      startTime: editEventData.startTime ? start : null,
      endTime: editEventData.endTime ? end : null,
      eventRole: editEventData.eventRole,
      eventPics: ''
    };

    try {
      const updated = await EventService.update(editEventData.id, payload);
      // mapear para FullCalendar
      const fc = {
        id: updated.id ? String(updated.id) : String(editEventData.id),
        title: updated.name || editEventData.title,
        start: updated.startTime || updated.date || start,
        end: updated.endTime || end,
        allDay: !editEventData.startTime
      };
      setEvents(events.map((e) => (e.id === fc.id ? fc : e)));
      setShowEditModal(false);
      setSelectedEvent(null);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[Events] erro ao atualizar evento:', err);
      alert('Erro ao atualizar evento. Veja console.');
    }
  };

  const handleDeleteEventApi = async () => {
    // Deletar evento do backend usando selectedEvent
    try {
      const id = selectedEvent?.id;
      if (!id) return;
      await EventService.remove(id);
      setEvents(events.filter((e) => e.id !== id));
      setShowDetailModal(false);
      setSelectedEvent(null);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[Events] erro ao deletar evento:', err);
      alert('Erro ao deletar evento. Veja console.');
    }
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

              

              <div className="form-group">
                <label>Status</label>
                <select value={newEventData.eventRole} onChange={(e) => setNewEventData({...newEventData, eventRole: e.target.value})}>
                  <option value="">Selecione...</option>
                  <option value="SCHEDULED">Agendado</option>
                  <option value="IN_COURSE">Acontecendo</option>
                  <option value="FINISHED">Finalizado</option>
                </select>
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
                <div>
                  <button className="btn-edit" onClick={handleOpenEditModal}>Editar</button>
                  <button className="btn-delete ms-2" onClick={handleDeleteEventApi}>Deletar</button>
                </div>
                <button className="btn-cancel" onClick={() => setShowDetailModal(false)}>Fechar</button>
              </div>
            </div>
          </div>
        )}

        {showEditModal && (
          <div className="modal-overlay">
            <div className="custom-modal large-modal">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold text-white m-0">Editar Evento</h3>
                <button className="text-white bg-transparent border-0 fs-3" onClick={() => setShowEditModal(false)}>&times;</button>
              </div>

              <form className="modal-form" onSubmit={(e) => { e.preventDefault(); handleUpdateEvent(); }}>
                <div className="form-group">
                  <label>Nome do evento</label>
                  <input type="text" value={editEventData.title} onChange={(e) => setEditEventData({...editEventData, title: e.target.value})} required />
                </div>

                <div className="form-group">
                  <label>Data</label>
                  <input type="date" value={editEventData.date} onChange={(e) => setEditEventData({...editEventData, date: e.target.value})} required />
                </div>

                <div className="row">
                  <div className="col-6">
                    <div className="form-group">
                      <label>Início</label>
                      <input type="time" value={editEventData.startTime} onChange={(e) => setEditEventData({...editEventData, startTime: e.target.value})} />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      <label>Encerramento</label>
                      <input type="time" value={editEventData.endTime} onChange={(e) => setEditEventData({...editEventData, endTime: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select value={editEventData.eventRole} onChange={(e) => setEditEventData({...editEventData, eventRole: e.target.value})} required>
                    <option value="">Selecione...</option>
                    <option value="SCHEDULED">Agendado</option>
                    <option value="IN_COURSE">Acontecendo</option>
                    <option value="FINISHED">Finalizado</option>
                  </select>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button type="button" className="btn btn-outline-secondary text-white" onClick={() => setShowEditModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-custom fw-bold">Salvar Alterações</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Events;