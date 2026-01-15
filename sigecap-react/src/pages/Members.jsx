import React, { useState } from 'react';
import UserService from '../api/UserService';
import * as UserTypeService from '../api/UserTypeService';
import Sidebar from '../components/Sidebar';
import UserButton from '../components/UserButton';
import '../App.css';
import '../assets/css/Users.css';

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

  const loadUsers = async (page = 0, size = 100) => {
    try {
      const data = await UserService.findAll(page, size);
    
      const rawList = Array.isArray(data?.content) ? data.content : (Array.isArray(data) ? data : []);
     
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

        // Normaliza o valor do tipo para a CHAVE usada no enum USER_TYPES (ex: 'DEMOLAY')
       type: (() => {
         const raw = u.userType;
         if (!raw) return '';
         // se já for string, tentar mapear para a key via label ou nome
         if (typeof raw === 'string') {
           const found = Object.entries(USER_TYPES).find(([, v]) => v.toLowerCase() === raw.toString().toLowerCase() ||
             Object.keys(USER_TYPES).find((k) => k.toLowerCase() === raw.toString().toLowerCase())
           );
           if (found) return found[0];
           // tentar encontrar por key diretamente
           const asKey = Object.keys(USER_TYPES).find((k) => k.toLowerCase() === raw.toString().toLowerCase());
           return asKey || raw;
         }
         // se for objeto, extrair descrição/nome/label
         if (typeof raw === 'object') {
           const desc = (raw.description || raw.typeName || raw.label || raw.name);
           if (!desc) return raw.id ? String(raw.id) : JSON.stringify(raw);
           const found = Object.entries(USER_TYPES).find(([, v]) => v.toLowerCase() === desc.toString().toLowerCase());
           if (found) return found[0];
           const asKey = Object.keys(USER_TYPES).find((k) => k.toLowerCase() === desc.toString().toLowerCase());
           return asKey || desc;
         }
         return String(raw);
       })(),
       // Extrai/normaliza ocupação do userType (pode vir em userType.occupation ou u.occupation)
       occupation: (() => {
         const rawOcc = (u.userType && (u.userType.occupation || u.userType.description)) || u.occupation || u.occupationRole || null;
         if (!rawOcc) return '';
         // se for objeto, pegar campo occupation/label/description
         if (typeof rawOcc === 'object') {
           const val = rawOcc.occupation || rawOcc.label || rawOcc.description || rawOcc.name;
           if (!val) return rawOcc.toString ? String(rawOcc) : '';
           // tentar mapear por label ou key
           const found = Object.entries(OCCUPATIONS).find(([, v]) => v.toLowerCase() === val.toString().toLowerCase());
           if (found) return found[0];
           const asKey = Object.keys(OCCUPATIONS).find((k) => k.toLowerCase() === val.toString().toLowerCase());
           return asKey || val;
         }
         // se for string ou enum name/label
         if (typeof rawOcc === 'string') {
           const found = Object.entries(OCCUPATIONS).find(([, v]) => v.toLowerCase() === rawOcc.toString().toLowerCase());
           if (found) return found[0];
           const asKey = Object.keys(OCCUPATIONS).find((k) => k.toLowerCase() === rawOcc.toString().toLowerCase());
           return asKey || rawOcc;
         }
         return String(rawOcc);
       })()
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

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;
    try {
      await UserService.delete(id);
      // remover da lista apenas após sucesso
      setUsers((prev) => prev.filter((user) => user.id !== id));
      alert('Membro excluído com sucesso.');
    } catch (err) {
      console.error('Erro ao deletar usuário com ID', id, err);
      const backendMsg = err?.response?.data?.message || err?.message || 'Erro desconhecido';
      alert('Erro ao excluir: ' + backendMsg);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

 const resolveUserTypeId = (typeValue, occupationValue) => {
    if (!typeValue) return null;

    const targetType = typeValue.toString().toLowerCase();
  
    let targetOcc = occupationValue ? occupationValue.toString() : '';
    
    const occupationEntry = Object.entries(OCCUPATIONS).find(([key, label]) => 
        label.toLowerCase() === targetOcc.toLowerCase() || 
        key.toLowerCase() === targetOcc.toLowerCase()
    );

    const occupationKey = occupationEntry ? occupationEntry[0].toLowerCase() : targetOcc.toLowerCase();

    const found = userTypes.find((t) => {
 
        const dbType = (t.description || t.typeName || '').toString().toLowerCase();
        
        // Verifica se 'description' bate '
        const typeMatch = dbType === targetType; 

        // Verifica se 'occupation' bate 
        const dbOcc = (t.occupation || '').toString().toLowerCase();
        const occMatch = dbOcc === occupationKey;

        return typeMatch && occMatch;
    });

    return found ? found.id : null;
  };

  const getTypeLabel = (typeVal) => {
    if (!typeVal) return '';
    // Se vier um objeto do backend, extrai uma string amigável
    if (typeof typeVal === 'object') {
      return typeVal.label || typeVal.typeName || typeVal.description || typeVal.name || JSON.stringify(typeVal);
    }
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

  const getOccupationLabel = (occ) => {
    if (!occ) return '';
    if (typeof occ === 'object') {
      return occ.description || occ.occupation || occ.label || occ.name || JSON.stringify(occ);
    }
    return OCCUPATIONS[occ] || occ;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {

      const resolvedTypeId = resolveUserTypeId(currentUser.type);

      const payload = {
        name: currentUser.name,
        cpf: (currentUser.cpf || '').toString().replace(/\D/g, ''),
        birthDate: currentUser.birthDate,
        phone: currentUser.phone,
        email: currentUser.email,
        password: currentUser.password,
        active: currentUser.status === 'ativo',
        occupation: currentUser.occupation,
     
        userType: resolvedTypeId
          ? { id: resolvedTypeId }
          : (typeof currentUser.type === 'object'
            ? currentUser.type
            : { description: currentUser.type, occupation: currentUser.occupation }),
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
                      <td>{getOccupationLabel(user.occupation)}</td>
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