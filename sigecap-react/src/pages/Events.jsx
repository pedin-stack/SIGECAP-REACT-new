import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

// Componentes UI
import Sidebar from '../components/Sidebar';
import '../App.css';
import '../assets/css/Events.css';

// Modais
import CreateEventModal from '../components/modals/eventModal/CreateEventModal';
import EditEventModal from '../components/modals/eventModal/EditEventModal';
import EventDetailModal from '../components/modals/eventModal/EventDetailModal';
import ExceptionModal from '../components/modals/errorModal'; 
import SuccessModal from '../components/modals/successModal';  

import  useEvents  from '../use/useEvents';

const Events = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  // Destruturação de tudo que vem do Hook
  const {
    events,
    selectedEvent,
    attendees,
    attendeesLoading,
    userConfirmed,
    attendanceLoading,
    
    // Formulários
    newEventData, setNewEventData,
    editEventData, setEditEventData,

    // Controle Modais
    showCreateModal, setShowCreateModal, openCreateModal,
    showEditModal, setShowEditModal, openEditModal,
    showDetailModal, setShowDetailModal,
    
    // Modais Feedback
    errorModal, setErrorModal,
    successModal, setSuccessModal,

    // Ações
    handleCreateEvent,
    handleUpdateEvent,
    handleDeleteEvent,
    toggleAttendance,
    onEventClick
  } = useEvents();

  return (
    <div className="d-flex bg-custom-main" style={{ minHeight: '100vh' }}>
      
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />

      <main className="main-content p-4 flex-grow-1" style={{ overflowY: 'auto' }}>
        
        <header className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold text-white">Eventos</h1>
        </header>

        <div className="calendar-wrapper">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="pt-br"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'customAddButton'
            }}
            customButtons={{
              customAddButton: {
                text: 'Criar Evento',
                click: openCreateModal
              }
            }}
            events={events}
            eventClick={onEventClick}
            height="auto"
            minHeight="800px"
          />
        </div>

        {/* --- MODAIS DE CRUD --- */}
        <CreateEventModal 
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          data={newEventData}
          setData={setNewEventData}
          onSave={handleCreateEvent}
        />

        <EditEventModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          data={editEventData}
          setData={setEditEventData}
          onSave={handleUpdateEvent}
        />

        <EventDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          event={selectedEvent}
          onEdit={openEditModal}
          onDelete={handleDeleteEvent}
          
          // Props de Presença
          attendees={attendees}
          attendeesLoading={attendeesLoading}
          userConfirmed={userConfirmed}
          attendanceLoading={attendanceLoading}
          onToggleAttendance={toggleAttendance}
        />

        {/* --- MODAIS DE FEEDBACK */}
        <ExceptionModal 
          isOpen={errorModal.isOpen} 
          onClose={() => setErrorModal({ ...errorModal, isOpen: false })} 
          message={errorModal.message} 
        />
        
        <SuccessModal 
          isOpen={successModal.isOpen} 
          onClose={() => setSuccessModal({ ...successModal, isOpen: false })} 
          message={successModal.message} 
        />

      </main>
    </div>
  );
};

export default Events;