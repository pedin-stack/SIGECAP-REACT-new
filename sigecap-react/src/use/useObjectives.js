import { useEffect, useState } from 'react';
import ObjectiveService from '../api/ObjectiveService';
import AuthService from '../api/AuthService';

export const useObjectives = () => {
  const [objectives, setObjectives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [modals, setModals] = useState({
    hub: false,
    create: false,
    edit: false,
    contribution: false
  });

  const [selectedObjective, setSelectedObjective] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, objective: null });

  const openHub = () => setModals((m) => ({ ...m, hub: true }));
  const closeHub = () => setModals((m) => ({ ...m, hub: false }));
  const openCreate = () => setModals((m) => ({ ...m, create: true }));
  const closeCreate = () => setModals((m) => ({ ...m, create: false }));
  const openEdit = (objective) => {
    setSelectedObjective(objective);
    setModals((m) => ({ ...m, edit: true }));
  };
  const closeEdit = () => {
    setSelectedObjective(null);
    setModals((m) => ({ ...m, edit: false }));
  };

  const openContribution = (objective) => {
    setSelectedObjective(objective);
    setModals((m) => ({ ...m, contribution: true }));
  };
  const closeContribution = () => {
    setSelectedObjective(null);
    setModals((m) => ({ ...m, contribution: false }));
  };

  const openConfirmDelete = (objective) => setConfirmDelete({ isOpen: true, objective });
  const closeConfirmDelete = () => setConfirmDelete({ isOpen: false, objective: null });

  const fetchObjectives = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ObjectiveService.getAll({ size: 100 });
      // API retorna Page; tenta acessar content ou data
      const data = res.data?.content ?? res.data ?? [];
      setObjectives(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao buscar objetivos', err);
      setError(err.message || 'Erro ao buscar objetivos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (modals.hub) fetchObjectives();
  }, [modals.hub]);

  const createObjective = async (payload, onSuccess) => {
    setLoading(true);
    try {
      const currentUser = AuthService.getCurrentUser();
      const responsibleId = currentUser?.id;
      if (!responsibleId) {
        const msg = 'Usuário não autenticado: impossível definir objetivo (responsibleId ausente).';
        setError(msg);
        alert(msg);
        setLoading(false);
        return;
      }
      const body = { ...payload, responsibleId };
      const res = await ObjectiveService.create(body);
      if (onSuccess) onSuccess(res.data);
      // dispatch success event for UI feedback
      try { window.dispatchEvent(new CustomEvent('objective:success', { detail: { message: 'Objetivo criado com sucesso.' } })); } catch(e) {}
      await fetchObjectives();
      closeCreate();
    } catch (err) {
      console.error('Erro criar objetivo', err);
      try { window.dispatchEvent(new CustomEvent('objective:error', { detail: { message: err.response?.data?.message || err.message || 'Erro ao criar objetivo' } })); } catch(e) {}
      setError(err.message || 'Erro ao criar objetivo');
    } finally {
      setLoading(false);
    }
  };

  const updateObjective = async (id, payload, onSuccess) => {
    setLoading(true);
    try {
      const currentUser = AuthService.getCurrentUser();
      const responsibleId = currentUser?.id;
      const body = { ...payload, responsibleId };
      if (body.financialGoal != null) body.financialGoal = parseFloat(body.financialGoal);

      const res = await ObjectiveService.update(id, body);
      if (onSuccess) onSuccess(res.data);
      try { window.dispatchEvent(new CustomEvent('objective:success', { detail: { message: 'Objetivo atualizado com sucesso.' } })); } catch(e) {}
      await fetchObjectives();
      closeEdit();
    } catch (err) {
      console.error('Erro atualizar objetivo', err);
      try { window.dispatchEvent(new CustomEvent('objective:error', { detail: { message: err.response?.data?.message || err.message || 'Erro ao atualizar objetivo' } })); } catch(e) {}
      setError(err.message || 'Erro ao atualizar objetivo');
    } finally {
      setLoading(false);
    }
  };

  const deleteObjective = async (id, onSuccess) => {
    setLoading(true);
    try {
      await ObjectiveService.delete(id);
      if (onSuccess) onSuccess();
      try { window.dispatchEvent(new CustomEvent('objective:success', { detail: { message: 'Objetivo excluído com sucesso.' } })); } catch(e) {}
      await fetchObjectives();
      closeConfirmDelete();
    } catch (err) {
      console.error('Erro deletar objetivo', err);
      try { window.dispatchEvent(new CustomEvent('objective:error', { detail: { message: err.response?.data?.message || err.message || 'Erro ao deletar objetivo' } })); } catch(e) {}
      setError(err.message || 'Erro ao deletar objetivo');
    } finally {
      setLoading(false);
    }
  };

  const handleContributionSaved = async () => {
    await fetchObjectives();
    closeContribution();
  };

  // --- Função de submissão de contribuição (migrada de useObjective.js)
  const submitContribution = async (objectiveId, formData, onSuccess) => {
    setLoading(true);
    try {
      const currentUser = AuthService.getCurrentUser();
      const responsibleId = currentUser?.id || null;

      if (!responsibleId) {
        const msg = 'Usuário não autenticado: impossível submeter contribuição (responsibleId ausente).';
        setError(msg);
        alert(msg);
        setLoading(false);
        return;
      }

      if (parseFloat(formData.value) <= 0) throw new Error('O valor deve ser positivo.');

      // Se houver arquivo, fazer upload via FormData
      if (formData.file) {
        const formDataToSend = new FormData();
        formDataToSend.append('supportingFile', formData.file);
        formDataToSend.append('value', String(parseFloat(formData.value)));
        formDataToSend.append('description', formData.description || 'DATAMOCK');
        formDataToSend.append('date', formData.date ? new Date(formData.date).toISOString() : new Date().toISOString());
        formDataToSend.append('type', 'ENTRADA');
        formDataToSend.append('responsibleId', String(responsibleId));

        const response = await ObjectiveService.addContributionWithFile(objectiveId, formDataToSend);
        if (onSuccess) onSuccess(response.data);
      } else {
        // Sem arquivo, enviar JSON normalmente
        const payload = {
          value: parseFloat(formData.value),
          description: formData.description || 'DATAMOCK',
          date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
          type: 'ENTRADA',
          supportingDoc: '',
          responsibleId: responsibleId
        };

        const response = await ObjectiveService.addContribution(objectiveId, payload);
        if (onSuccess) onSuccess(response.data);
      }

      try { window.dispatchEvent(new CustomEvent('objective:success', { detail: { message: 'Contribuição registrada com sucesso.' } })); } catch(e) {}
      await handleContributionSaved();
    } catch (err) {
      console.error('Erro ao enviar contribuição', err);
      try { window.dispatchEvent(new CustomEvent('objective:error', { detail: { message: err.response?.data?.message || err.message || 'Erro ao salvar contribuição' } })); } catch(e) {}
      setError(err.response?.data?.message || err.message || 'Erro ao salvar contribuição');
      alert(err.response?.data?.message || err.message || 'Erro ao salvar contribuição');
    } finally {
      setLoading(false);
    }
  };

  return {
    objectives,
    loading,
    error,
    modals,
    selectedObjective,
    confirmDelete,
    openHub,
    closeHub,
    openCreate,
    closeCreate,
    openEdit,
    closeEdit,
    openContribution,
    closeContribution,
    openConfirmDelete,
    closeConfirmDelete,
    fetchObjectives,
    createObjective,
    updateObjective,
    deleteObjective,
    handleContributionSaved,
    submitContribution
  };
};

export default useObjectives;
