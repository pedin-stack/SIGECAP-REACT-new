import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../App.css';
import '../assets/css/Users.css'; // Importa o CSS específico
import UserButton from '../components/UserButton';

const Users = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  // --- ESTADO DOS DADOS (Mock Inicial) ---
  const [users, setUsers] = useState([
    { id: 1, name: 'Antônio Silva', email: 'antonio@gmail.com', role: 'Maçom' },
    { id: 2, name: 'Mario Costa', email: 'mario@outlook.com', role: 'Tesoureiro' },
    { id: 3, name: 'João Pereira', email: 'joao@example.com', role: 'Membro' },
  ]);

  // --- ESTADOS DO MODAL ---
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({ id: null, name: '', email: '', role: '' });

  // --- FUNÇÕES ---

  // Abrir modal de edição preenchido
  const handleEdit = (user) => {
    setCurrentUser(user);
    setShowEditModal(true);
  };

  // Excluir usuário
  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  // Atualizar campo do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

  // Salvar alterações
  const handleSave = (e) => {
    e.preventDefault();
    // Atualiza a lista mapeando e substituindo o usuário modificado
    setUsers(users.map((user) => (user.id === currentUser.id ? currentUser : user)));
    setShowEditModal(false);
  };

  return (
    <div className="d-flex bg-custom-main" style={{ minHeight: '100vh' }}>
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />

      <main className="main-content p-4 flex-grow-1" style={{ overflowY: 'auto' }}>
        
        {/* Cabeçalho */}
        <header className="d-flex justify-content-between align-items-center mb-5">
          <h1 className="fw-bold text-white">Usuários</h1>
          <div>
             {/* Botão User ativo (simbólico, já que estamos na página de users) */}
            <button className="btn btn-custom rounded-pill px-4 fw-bold">User</button>
          </div>
        </header>

        {/* --- PAINEL / TABELA --- */}
        <section className="users-panel">
          <div className="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary pb-3">
             <h2 className="card-title mb-0 border-0 p-0">Lista de Usuários</h2>
             <button className="btn btn-sm btn-outline-light">+ Novo</button>
          </div>
          
          <div className="table-responsive">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Função</th>
                  <th className="text-end">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td className="actions-cell">
                      <button 
                        className="btn-action btn-edit"
                        onClick={() => handleEdit(user)}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn-action btn-danger-custom"
                        onClick={() => handleDelete(user.id)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* --- MODAL DE EDIÇÃO --- */}
        {showEditModal && (
          <div className="modal-overlay">
            <div className="custom-modal small-modal">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold text-white m-0">Editar Usuário</h3>
                <button 
                    className="text-white bg-transparent border-0 fs-3" 
                    onClick={() => setShowEditModal(false)}
                >&times;</button>
              </div>

              <form onSubmit={handleSave} className="modal-form">
                <div className="form-group">
                  <label htmlFor="name">Nome</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={currentUser.name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={currentUser.email} 
                    onChange={handleChange} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="role">Função</label>
                  <input 
                    type="text" 
                    id="role" 
                    name="role" 
                    value={currentUser.role} 
                    onChange={handleChange} 
                    required 
                  />
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary text-white" 
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-custom fw-bold">
                    Confirmar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Users;