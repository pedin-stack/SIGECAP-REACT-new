import React, { useState } from 'react';
import UserService from '../api/UserService';
import * as UserTypeService from '../api/UserTypeService';
import Sidebar from '../components/Sidebar';
import UserButton from '../components/UserButton';
import '../App.css';
import '../assets/css/Users.css';

// --- ENUMS (CONSTANTES) ---
const USER_TYPES = {
  DEMOLAY: "Demolay",
  SENIOR: "Senior",
  RESPONSAVEL: "Responsavel",
  MACOM: "Maçom"
};

const OCCUPATIONS = {
  MASTER_COUNCILOR: "Mestre Conselheiro",
  FIRST_COUNCILOR: "Primeiro Conselheiro",
  SECOND_COUNCILOR: "Segundo Conselheiro",
  SCRIBE: "Escrivão",
  TREASURER: "Tesoureiro",
  ORATOR: "Orador",
  CHAPLAIN: "Capelão",
  MARSHAL: "Mestre de Cerimônias",
  HOSPITALER: "Hospitaleiro",
  FIRST_DEACON: "Primeiro Diácono",
  SECOND_DEACON: "Segundo Diácono",
  FIRST_STEWARD: "Primeiro Mordomo",
  SECOND_STEWARD: "Segundo Mordomo",
  STANDARD_BEARER: "Porta Bandeira",
  SENTINEL: "Sentinela",
  ORGANIST: "Organista",
  FIRST_PRECEPTOR: "1º Preceptor",
  SECOND_PRECEPTOR: "2º Preceptor",
  THIRD_PRECEPTOR: "3º Preceptor",
  FOURTH_PRECEPTOR: "4º Preceptor",
  FIFTH_PRECEPTOR: "5º Preceptor",
  SIXTH_PRECEPTOR: "6º Preceptor",
  SEVENTH_PRECEPTOR: "7º Preceptor",
  ADVISORY_BOARD_PRESIDENT: "Presidente do conselho consultivo"
};

// Componente auxiliar para os Cards
const OptionCard = ({ title, description, icon, onClick, disabled }) => (
  <div className="col-lg-6 col-md-6 mb-4">
    <div
      className={`option-card ${disabled ? 'disabled' : ''}`}
      onClick={!disabled ? onClick : undefined}
    >
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <h2>{title}</h2>
        <p>{description}</p>
        {disabled && <small className="text-muted d-block mt-2">(Em breve)</small>}
      </div>
    </div>
  </div>
);

const Members = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [currentView, setCurrentView] = useState('menu');

  // --- DADOS INICIAIS (Exemplo) ---
  const [users, setUsers] = useState([
  ]);
  const [userTypes, setUserTypes] = useState([]);

  const [showEditModal, setShowEditModal] = useState(false);

  // Estado inicial do formulário vazio
  const initialFormState = {
    id: null,
    name: '',
    cpf: '',
    birthDate: '',
    phone: '',
    email: '',
    password: '',
    status: 'ativo', // Padrão
    type: '',
    occupation: ''
  };

  const [currentUser, setCurrentUser] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState(false);

  // Carrega usuários do backend e atualiza o estado
  const loadUsers = async (page = 0, size = 100) => {
    try {
      const data = await UserService.findAll(page, size);
      // data pode ser uma página com .content (Spring Page)
      const rawList = Array.isArray(data?.content) ? data.content : (Array.isArray(data) ? data : []);
      // mapear campos do backend para o formato usado na UI
      const list = rawList.map((u) => ({
        id: u.id ?? u.personId ?? null,
        name: u.name || (u.person && u.person.name) || '',
        cpf: u.cpf || (u.person && u.person.cpf) || '',
        birthDate: u.birthDate || (u.person && u.person.birthDate) || '',
        phone: u.phone || u.contact || (u.person && u.person.contact) || '',
        email: u.email || '',
        // status esperado na UI: 'ativo' / 'inativo'
        status: (u.active === true || u.active === 'true') ? 'ativo' : 'inativo',
        // occupation
        // type: preferir userType.id quando disponível (para enviar userTypeId ao salvar)
       type: u.userType || ''
      }));
      // eslint-disable-next-line no-console
      console.info('[Frontend] usuários carregados (mapeados):', list);
      setUsers(list);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[Frontend] Erro ao carregar usuários:', err);
    }
  };

  const openManagement = () => {
    setCurrentView('management');
    // carregar tipos e usuários
    loadUserTypes();
    loadUsers(0, 100);
  };

  const loadUserTypes = async () => {
    try {
      const data = await UserTypeService.getAll(0, 100);
      const list = Array.isArray(data?.content) ? data.content : (Array.isArray(data) ? data : []);
      // map para objeto simples { id, label }
      const mapped = list.map((t) => ({ id: t.id, label: t.typeName || t.name || t.description || t.id }));
      setUserTypes(mapped);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[Frontend] erro ao carregar user-types:', err);
    }
  };

  // --- ÍCONES ---
  const iconUsers = <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
  const iconCheck = <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;

  // --- FUNÇÕES CRUD ---
  const handleEdit = (user) => {
    setIsEditing(true);
    setCurrentUser(user);
    setShowEditModal(true);
  };

  const handleCreate = () => {
    setIsEditing(false);
    setCurrentUser(initialFormState);
    setShowEditModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

  const resolveUserTypeId = (typeValue) => {
    if (!typeValue) return null;
    const asNum = Number(typeValue);
    if (!Number.isNaN(asNum)) return asNum;
    // procurar por id como string
    const byId = userTypes.find((t) => t.id?.toString() === typeValue?.toString());
    if (byId) return Number(byId.id);
    // procurar por label
    const byLabel = userTypes.find((t) => (t.label || '').toString() === typeValue?.toString());
    if (byLabel) return Number(byLabel.id);
 
    const labelFromKey = USER_TYPES[typeValue];
    if (labelFromKey) {
      const byLabel2 = userTypes.find((t) => (t.label || '') === labelFromKey);
      if (byLabel2) return Number(byLabel2.id);
    }
    return null;
  };

  const getTypeLabel = (typeVal) => {
    if (!typeVal) return '';
    const asNum = Number(typeVal);
    if (!Number.isNaN(asNum)) {
      const found = userTypes.find((t) => Number(t.id) === asNum);
      if (found) return found.label;
    }
    // try match label directly
    const foundLabel = userTypes.find((t) => t.label === typeVal);
    if (foundLabel) return foundLabel.label;
    // fallback to local enum mapping
    if (USER_TYPES[typeVal]) return USER_TYPES[typeVal];
    return typeVal;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // PAYLOAD SIMPLIFICADO
      const payload = {
        name: currentUser.name,
        cpf: (currentUser.cpf || '').toString().replace(/\D/g, ''),
        birthDate: currentUser.birthDate,
        phone: currentUser.phone,
        email: currentUser.email,
        password: currentUser.password,
        active: currentUser.status === 'ativo',
        occupation: currentUser.occupation,

        // MUDANÇA AQUI: Enviamos a String direta (ex: "DEMOLAY")
        // Certifique-se que currentUser.type contém "DEMOLAY", "MACOM", etc.
        userType: currentUser.type
      };

      // Remove senha se estiver vazio na edição
      if (isEditing && !payload.password) {
        delete payload.password;
      }

      console.debug('[Frontend] payload enviando:', payload);

      if (isEditing) {
        // PUT
        const updated = await UserService.update(currentUser.id, payload);
        alert('Membro atualizado com sucesso!');
        // Atualiza lista localmente
        setUsers(users.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)));
      } else {
        // POST
        const created = await UserService.save(payload);
        alert('Membro criado com sucesso!');
        // Adiciona na lista
        setUsers((prev) => [...prev, created]);
      }

      setShowEditModal(false);
      loadUsers(0, 100); // Recarrega lista

    } catch (err) {
      console.error('[Frontend] Erro ao salvar:', err);
      const backendMsg = err?.response?.data?.message || err?.message || 'Erro desconhecido';
      alert('Erro ao salvar: ' + backendMsg);
    }
  };

  return (
    <div className="d-flex bg-custom-main" style={{ minHeight: '100vh' }}>
      <Sidebar isCollapsed={sidebarCollapsed} toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className="main-content p-4 flex-grow-1" style={{ overflowY: 'auto' }}>
        <header className="d-flex justify-content-between align-items-center mb-5">
          <h1 className="fw-bold text-white">Membros</h1>
        </header>

        {/* --- MENU INICIAL --- */}
        {currentView === 'menu' && (
          <section className="users-options">
            <div className="row justify-content-center">
              <OptionCard
                title="Gerenciamento de Membros"
                description="Adicionar, editar ou remover membros do capítulo."
                icon={iconUsers}
                onClick={openManagement}
              />
              <OptionCard
                title="Lista de Presença"
                description="Controle de frequência em reuniões."
                icon={iconCheck}
                disabled={true}
                onClick={() => { }}
              />
            </div>
          </section>
        )}

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
                      <td>{getTypeLabel(user.type)}</td>
                      <td>{OCCUPATIONS[user.occupation] || user.occupation}</td>
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
                </tbody>
              </table>
            </div>
          </section>
        )}

        {showEditModal && (
          <div className="modal-overlay">
            <div className="custom-modal large-modal">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold text-white m-0">
                  {isEditing ? 'Editar Membro' : 'Novo Membro'}
                </h3>
                <button className="text-white bg-transparent border-0 fs-3" onClick={() => setShowEditModal(false)}>&times;</button>
              </div>

              <form onSubmit={handleSave} className="modal-form">

                {/* Linha 1: Nome e CPF */}
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label>Nome Completo</label>
                    <input type="text" name="name" value={currentUser.name} onChange={handleChange} required placeholder="Ex: João da Silva" />
                  </div>
                  <div className="col-md-6 form-group">
                    <label>CPF</label>
                    <input type="text" name="cpf" value={currentUser.cpf} onChange={handleChange} required placeholder="000.000.000-00" />
                  </div>
                </div>


                <div className="row">
                  <div className="col-md-6 form-group">
                    <label>Data de Nascimento</label>
                    <input type="date" name="birthDate" value={currentUser.birthDate} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 form-group">
                    <label>Telefone</label>
                    <input type="tel" name="phone" value={currentUser.phone} onChange={handleChange} required placeholder="(00) 00000-0000" />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={currentUser.email} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 form-group">
                    <label>Senha</label>
                    <input type="password" name="password" value={currentUser.password} onChange={handleChange} required={!isEditing} placeholder={isEditing ? "Deixe em branco para manter" : ""} />
                  </div>
                </div>

                <hr className="border-secondary my-3" />


                <div className="row">
                  <div className="col-md-6 form-group">
                    <label>Tipo de Usuário</label>
                    <select
                      name="type"
                      value={currentUser.type}
                      onChange={handleChange}
                      required
                      className="form-select custom-select-dark"
                    >
                      <option value="">Selecione...</option>
                      {/* Aqui iteramos sobre as chaves do objeto USER_TYPES.
       key = "DEMOLAY" (O que vai pro banco)
       label = "Demolay" (O que aparece na tela)
    */}
                      {Object.entries(USER_TYPES).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 form-group">
                    <label>Ocupação / Cargo</label>
                    <select name="occupation" value={currentUser.occupation} onChange={handleChange} required className="form-select custom-select-dark">
                      <option value="">Selecione...</option>
                      {Object.entries(OCCUPATIONS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>


                <div className="form-group mt-3">
                  <label className="d-block mb-2">Status</label>
                  <div className="d-flex gap-4">
                    <div className="form-check">
                      <input
                        className="custom-radio-btn"
                        type="radio"
                        name="status"
                        id="statusAtivo"
                        value="ativo"
                        checked={currentUser.status === 'ativo'}
                        onChange={handleChange}
                      />
                      <label className="form-check-label text-white" htmlFor="statusAtivo">
                        Ativo
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="custom-radio-btn"
                        type="radio"
                        name="status"
                        id="statusInativo"
                        value="inativo"
                        checked={currentUser.status === 'inativo'}
                        onChange={handleChange}
                      />
                      <label className="form-check-label text-white" htmlFor="statusInativo">
                        Inativo
                      </label>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button type="button" className="btn btn-outline-secondary text-white" onClick={() => setShowEditModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-custom fw-bold">Salvar Dados</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Members;