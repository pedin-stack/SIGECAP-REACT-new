import { useState, useEffect, useCallback } from 'react';
import EventService from '../api/EventService';
import AuthService from '../api/AuthService';

export const useEvents = () => {
  // --- Estados de Dados ---
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [attendeesLoading, setAttendeesLoading] = useState(false);
  const [userConfirmed, setUserConfirmed] = useState(false);
  const [attendanceLoading, setAttendanceLoading] = useState(false); 

  // --- Estados de Modais de UI ---
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // --- Estados de Modais de Feedback (Sucesso/Erro) ---
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });
  const [successModal, setSuccessModal] = useState({ isOpen: false, message: '' });

  // --- Formulários ---
  const [newEventData, setNewEventData] = useState({ title: '', date: '', startTime: '', endTime: '', eventRole: '' });
  const [editEventData, setEditEventData] = useState({ id: null, title: '', date: '', startTime: '', endTime: '', eventRole: '' });

  // --- Helpers de Data ---
  const toDateString = (d) => {
    if (!d) return '';
    const dt = (d instanceof Date) ? d : new Date(d);
    return dt.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  const toTimeString = (d) => {
    if (!d) return '';
    const dt = (d instanceof Date) ? d : new Date(d);
    const hh = String(dt.getHours()).padStart(2, '0');
    const mi = String(dt.getMinutes()).padStart(2, '0');
    return `${hh}:${mi}`;
  };

  // --- Carregar Eventos ---
  const loadEvents = useCallback(async () => {
    try {
      const data = await EventService.findAll(0, 100);
      const list = Array.isArray(data?.content) ? data.content : (Array.isArray(data) ? data : []);
      const mapped = list.map((e) => ({
        id: e.id ? String(e.id) : Date.now().toString(),
        title: e.name || '',
        start: e.startTime || e.date || null,
        end: e.endTime || null,
        allDay: !(e.startTime || e.endTime),
        extendedProps: { eventRole: e.eventRole } 
      }));
      setEvents(mapped);
    } catch (err) {
      console.error(err);
      setErrorModal({ isOpen: true, message: 'Erro ao carregar eventos.' });
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // --- Carregar Participantes ---
  const loadAttendees = useCallback(async (eventId) => {
    if (!eventId) return;
    setAttendeesLoading(true);
    try {
      const data = await EventService.getAttendees(eventId);
      const list = Array.isArray(data?.content) ? data.content : (Array.isArray(data) ? data : []);
      
      const filtered = list.filter((a) => String(a.eventId) === String(eventId));
      
      const attendeesList = filtered.map((a) => ({
        attendanceId: a.id,
        memberId: a.memberId,
        memberName: a.memberName || a.memberFullName || `Membro ${a.memberId}`,
        status: a.status,
      }));
      
      setAttendees(attendeesList);

      const currentUser = AuthService.getCurrentUser();
      if (currentUser && attendeesList.length > 0) {
        const found = attendeesList.some((u) => String(u.memberId) === String(currentUser.id));
        setUserConfirmed(!!found);
      } else {
        setUserConfirmed(false);
      }
    } catch (err) {
      console.error(err);
      setAttendees([]);
      setUserConfirmed(false);
    } finally {
      setAttendeesLoading(false);
    }
  }, []);

  // --- Ações do CRUD ---

  const handleCreateEvent = async () => {
    if (!newEventData.title || !newEventData.date || !newEventData.eventRole) {
      setErrorModal({ isOpen: true, message: 'Preencha título, data e status.' });
      return;
    }

    let start = newEventData.date;
    let end = newEventData.date;
    if (newEventData.startTime) start = `${newEventData.date}T${newEventData.startTime}`;
    if (newEventData.endTime) end = `${newEventData.date}T${newEventData.endTime}`;

    const payload = {
      name: newEventData.title,
      date: newEventData.startTime ? start : `${newEventData.date}T00:00:00`,
      startTime: newEventData.startTime ? start : null,
      endTime: newEventData.endTime ? end : null,
      eventRole: newEventData.eventRole,
      eventPics: ''
    };

    try {
      await EventService.save(payload);
      setSuccessModal({ isOpen: true, message: 'Evento criado com sucesso!' });
      setShowCreateModal(false);
      loadEvents(); 
    } catch (err) {
      console.error(err);
      setErrorModal({ isOpen: true, message: 'Erro ao criar evento.' });
    }
  };

  const handleUpdateEvent = async () => {
    if (!editEventData.title || !editEventData.date || !editEventData.eventRole) {
      setErrorModal({ isOpen: true, message: 'Campos obrigatórios faltando.' });
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
      await EventService.update(editEventData.id, payload);
      setSuccessModal({ isOpen: true, message: 'Evento atualizado!' });
      setShowEditModal(false);
      loadEvents();
    } catch (err) {
      console.error(err);
      setErrorModal({ isOpen: true, message: 'Erro ao atualizar evento.' });
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    if (!window.confirm(`Apagar "${selectedEvent.title}"?`)) return;

    try {
      await EventService.remove(selectedEvent.id);
      setSuccessModal({ isOpen: true, message: 'Evento removido.' });
      setShowDetailModal(false);
      setSelectedEvent(null);
      loadEvents();
    } catch (err) {
      console.error(err);
      setErrorModal({ isOpen: true, message: 'Erro ao deletar evento.' });
    }
  };

  const toggleAttendance = async () => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser || !selectedEvent) return;
    
    setAttendanceLoading(true);
    try {
      if (userConfirmed) {
        // Desmarcar
        const entry = attendees.find((a) => String(a.memberId) === String(currentUser.id));
        if (entry?.attendanceId) {
          await EventService.removeAttendance(entry.attendanceId);
          setSuccessModal({ isOpen: true, message: 'Presença cancelada.' });
        }
      } else {
        // Confirmar
        await EventService.confirmAttendance(selectedEvent.id, currentUser.id);
        setSuccessModal({ isOpen: true, message: 'Presença confirmada!' });
      }
      loadAttendees(selectedEvent.id); 
    } catch (err) {
      console.error(err);
      setErrorModal({ isOpen: true, message: 'Erro ao alterar presença.' });
    } finally {
      setAttendanceLoading(false);
    }
  };

  // --- Manipuladores de UI ---
  const openCreateModal = () => {
    setNewEventData({ title: '', date: '', startTime: '', endTime: '', eventRole: '' });
    setShowCreateModal(true);
  };

  const openEditModal = () => {
    if (!selectedEvent) return;
    setEditEventData({
      id: selectedEvent.id,
      title: selectedEvent.title,
      date: toDateString(selectedEvent.start),
      startTime: toTimeString(selectedEvent.start),
      endTime: toTimeString(selectedEvent.end),
      eventRole: selectedEvent.extendedProps?.eventRole || ''
    });
    setShowDetailModal(false);
    setShowEditModal(true);
  };

  const onEventClick = (info) => {
    setSelectedEvent(info.event);
    loadAttendees(info.event.id);
    setShowDetailModal(true);
  };

  return {
    // Dados
    events,
    selectedEvent,
    attendees,
    attendeesLoading,
    userConfirmed,
    attendanceLoading,
    
    // Formulários
    newEventData, setNewEventData,
    editEventData, setEditEventData,

    // Controle de Modais UI
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
  };
};