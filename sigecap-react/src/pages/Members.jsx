import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useMembers, USER_TYPES, OCCUPATIONS } from '../use/UseMembers';
import  useEvents  from '../use/useEvents';

// Modais
import MemberFormModal from '../components/modals/members/MemberFormModal';
import AttendanceListModal from '../components/modals/eventModal/AttendanceListModal';
import AttendanceDetailsModal from '../components/modals/eventModal/AttendanceDetailsModal';
import StatusModal from '../components/modals/members/statusModal';
import OptionCard from '../components/OptionCard';
import '../App.css';
import '../assets/css/Users.css';




const Members = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [currentView, setCurrentView] = useState('menu');
  
  // --- Integração com Hooks ---
  const { 
    users, 
    loadUsers, 
    loadUserTypes, 
    saveUser, 
    deleteUser,
    statusModal,
    setStatusModal
  } = useMembers();

  const {
    events,
    attendees,
    loadingEvents,
    loadingAttendees,
    fetchEvents,
    fetchAttendees,
    updateAttendanceStatus
  } = useEvents();

  // --- Estados de Controle de UI Local ---
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAttendanceList, setShowAttendanceList] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null); // Se null, fecha o modal de detalhes
  
  const initialFormState = {
    id: null, name: '', cpf: '', birthDate: '', phone: '', email: '',
    password: '', status: 'ativo', type: '', occupation: ''
  };
  const [currentUserData, setCurrentUserData] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState(false);

  // --- Handlers de Ação ---

  const handleOpenManagement = () => {
    setCurrentView('management');
    loadUserTypes();
    loadUsers();
  };

  const handleOpenAttendance = async () => {
    await fetchEvents();
    setShowAttendanceList(true);
  };

  const handleSelectEvent = async (event) => {
    setSelectedEvent(event);
    await fetchAttendees(event.id);
  };

  // CRUD Handlers
  const handleCreate = () => {
    setIsEditing(false);
    setCurrentUserData(initialFormState);
    setShowEditModal(true);
  };

  const handleEdit = (user) => {
    setIsEditing(true);
    setCurrentUserData({
        ...user,
        password: '' 
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
        await deleteUser(id);
    }
  };

  const handleSaveForm = async (formData) => {
    const success = await saveUser(formData, isEditing);
    if (success) {
        setShowEditModal(false);
    }
  };

  // Ícones SVG
  const iconUsers = <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
  const iconCheck = <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;

  const getLabel = (val, dict) => {
      // Se já vier formatado do hook, usa. Senão tenta mapear.
      if (!val) return '-';
      return val; 
  };

  return (
    <div className="d-flex bg-custom-main" style={{ minHeight: '100vh' }}>
      <Sidebar isCollapsed={sidebarCollapsed} toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className="main-content p-4 flex-grow-1" style={{ overflowY: 'auto' }}>
        <header className="d-flex justify-content-between align-items-center mb-5">
          <h1 className="fw-bold text-white">Membros</h1>
        </header>

        {/* --- MENU DE OPÇÕES --- */}
        {currentView === 'menu' && (
          <section className="users-options">
            <div className="row justify-content-center">
              <OptionCard
                title="Gerenciamento de Membros"
                description="Adicionar, editar ou remover membros do capítulo."
                icon={iconUsers}
                onClick={handleOpenManagement}
              />
              <OptionCard
                title="Lista de Presença"
                description="Controle de frequência em reuniões."
                icon={iconCheck}
                onClick={handleOpenAttendance}
              />
            </div>
          </section>
        )}

        {/* --- TELA DE GERENCIAMENTO --- */}
        {currentView === 'management' && (
          <section className="users-panel animate-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary pb-3">
              <div className="d-flex align-items-center gap-3">
                <button className="btn btn-sm btn-outline-secondary text-white" onClick={() => setCurrentView('menu')}>
                  &larr; Voltar
                </button>
                <h2 className="card-title mb-0 border-0 p-0">Gerenciamento</h2>
              </div>
              <button className="btn btn-sm btn-outline-light" onClick={handleCreate}>+ Novo Membro</button>
            </div>

            <div className="table-responsive">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Tipo</th>
                    <th>Ocupação</th>
                    <th>Status</th>
                    <th className="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{getLabel(user.type)}</td>
                      <td>{getLabel(user.occupation)}</td>
                      <td>
                        <span className={`badge ${user.status === 'ativo' ? 'bg-success' : 'bg-secondary'}`}>
                          {user.status === 'ativo' ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button className="btn-action btn-edit" onClick={() => handleEdit(user)}>Editar</button>
                        <button className="btn-action btn-danger-custom" onClick={() => handleDelete(user.id)}>Excluir</button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                      <tr><td colSpan="5" className="text-center">Nenhum membro encontrado.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* --- MODAIS --- */}

        {/* 1. Modal de Formulário de Membro */}
        <MemberFormModal 
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            onSave={handleSaveForm}
            initialData={currentUserData}
            isEditing={isEditing}
        />

        {/* 2. Modal Lista de Eventos (Presença) */}
        <AttendanceListModal 
            isOpen={showAttendanceList}
            onClose={() => setShowAttendanceList(false)}
            events={events}
            loading={loadingEvents}
            onSelectEvent={handleSelectEvent}
        />

        {/* 3. Modal Detalhes do Evento (Membros) */}
        <AttendanceDetailsModal 
            isOpen={!!selectedEvent}
            onClose={() => setSelectedEvent(null)}
            event={selectedEvent}
            attendees={attendees}
            loading={loadingAttendees}
            onStatusChange={updateAttendanceStatus}
        />

        {/* 4. Modal de Sucesso / Erro */}
        <StatusModal 
            isOpen={statusModal.isOpen}
            onClose={() => setStatusModal({ ...statusModal, isOpen: false })}
            type={statusModal.type}
            message={statusModal.message}
        />

      </main>
    </div>
  );
};

export default Members;