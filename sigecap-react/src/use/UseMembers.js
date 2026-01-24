import { useState, useCallback } from 'react';
import UserService from '../api/UserService';
import * as UserTypeService from '../api/UserTypeService';

export const OCCUPATIONS = {
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
  ADVISORY_BOARD_PRESIDENT: "Presidente do conselho consultivo",
  MACOM : "Maçom",
  RESPONSAVEL : "Responsavel"
};

export const USER_TYPES = {
  DEMOLAY: "Demolay",
  SENIOR: "Senior",
  RESPONSAVEL: "Responsavel",
  MACOM: "Maçom"
};

export const useMembers = () => {
  const [users, setUsers] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Estados para Modal de Sucesso/Erro
  const [statusModal, setStatusModal] = useState({ isOpen: false, type: 'success', message: '' });

  const loadUserTypes = useCallback(async () => {
    try {
      const data = await UserTypeService.getAll(0, 100);
      const list = Array.isArray(data?.content) ? data.content : (Array.isArray(data) ? data : []);
      const mapped = list.map((t) => ({ id: t.id, label: t.typeName || t.name || t.description || t.id, ...t }));
      setUserTypes(mapped);
    } catch (err) {
      console.error('Erro ao carregar tipos:', err);
    }
  }, []);

  const loadUsers = useCallback(async (page = 0, size = 100) => {
    setLoading(true);
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
        status: (u.active === true || u.active === 'true') ? 'ativo' : 'inativo',
        type: resolveTypeLabel(u.userType),
        occupation: resolveOccupationLabel(u),
        rawUserType: u.userType // Mantendo referência original se precisar
      }));
      
      setUsers(list);
    } catch (err) {
      setStatusModal({ isOpen: true, type: 'error', message: 'Erro ao carregar usuários.' });
    } finally {
      setLoading(false);
    }
  }, []);

  // Helpers de formatação
  const resolveTypeLabel = (raw) => {
     if (!raw) return '';
     if (typeof raw === 'string') {
        const found = Object.entries(USER_TYPES).find(([, v]) => v.toLowerCase() === raw.toLowerCase());
        return found ? found[0] : raw;
     }
     if (typeof raw === 'object') {
        const desc = raw.description || raw.typeName || raw.label;
        const found = Object.entries(USER_TYPES).find(([, v]) => v.toLowerCase() === String(desc).toLowerCase());
        return found ? found[0] : (desc || '');
     }
     return String(raw);
  };

  const resolveOccupationLabel = (u) => {
     const rawOcc = (u.userType && (u.userType.occupation || u.userType.description)) || u.occupation || null;
     if (!rawOcc) return '';
     if (typeof rawOcc === 'object') return rawOcc.occupation || rawOcc.label || '';
     const found = Object.entries(OCCUPATIONS).find(([, v]) => v.toLowerCase() === String(rawOcc).toLowerCase());
     return found ? found[0] : rawOcc;
  };

  // Resolve ID para envio ao backend
  const resolveUserTypeId = (typeValue, occupationValue) => {
    if (!typeValue) return null;
    const targetType = typeValue.toString().toLowerCase();
    let targetOcc = occupationValue ? occupationValue.toString() : '';
    const occupationEntry = Object.entries(OCCUPATIONS).find(([key, label]) => 
        label.toLowerCase() === targetOcc.toLowerCase() || key.toLowerCase() === targetOcc.toLowerCase()
    );
    const occupationKey = occupationEntry ? occupationEntry[0].toLowerCase() : targetOcc.toLowerCase();

    const found = userTypes.find((t) => {
        const dbType = (t.description || t.typeName || '').toString().toLowerCase();
        const dbOcc = (t.occupation || '').toString().toLowerCase();
        return dbType === targetType && dbOcc === occupationKey;
    });
    return found ? found.id : null;
  };

  const saveUser = async (userData, isEditing) => {
    try {
      const resolvedTypeId = resolveUserTypeId(userData.type, userData.occupation);
      
      const payload = {
        name: userData.name,
        cpf: (userData.cpf || '').toString().replace(/\D/g, ''),
        birthDate: userData.birthDate,
        phone: userData.phone,
        email: userData.email,
        password: userData.password,
        active: userData.status === 'ativo',
        occupation: userData.occupation,
        userType: resolvedTypeId 
          ? { id: resolvedTypeId } 
          : { description: userData.type, occupation: userData.occupation }
      };

      if (isEditing && !payload.password) delete payload.password;

      if (isEditing) {
        await UserService.update(userData.id, payload);
        setStatusModal({ isOpen: true, type: 'success', message: 'Membro atualizado com sucesso!' });
      } else {
        await UserService.save(payload);
        setStatusModal({ isOpen: true, type: 'success', message: 'Membro criado com sucesso!' });
      }
      
      loadUsers(); // Recarrega a lista
      return true; // Sucesso
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || 'Erro desconhecido';
      setStatusModal({ isOpen: true, type: 'error', message: `Erro ao salvar: ${msg}` });
      return false;
    }
  };

  const deleteUser = async (id) => {
    try {
      await UserService.delete(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setStatusModal({ isOpen: true, type: 'success', message: 'Membro excluído com sucesso.' });
    } catch (err) {
      setStatusModal({ isOpen: true, type: 'error', message: 'Erro ao excluir usuário.' });
    }
  };

  return {
    users,
    userTypes,
    loading,
    statusModal,
    setStatusModal, // para poder fechar o modal
    loadUsers,
    loadUserTypes,
    saveUser,
    deleteUser
  };
};