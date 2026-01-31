import React from 'react';
import ConfirmDeleteModal from '../ConfirmDeleteModal';
import '../../../assets/css/Objectives.css';
// CreateObjectiveModal and ContributionModal are rendered by the parent (Treasury.jsx)

const ObjectivesHubModal = ({
  isOpen,
  onClose,
  objectives,
  loading,
  onOpenCreate,
  onOpenEdit,
  onOpenDelete,
  onOpenContribution,
  confirmDelete,
  onCloseConfirmDelete,
  onConfirmDelete
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay animate-fade-in" style={{ zIndex: 1045 }}>
      <div className="card objectives-modal bg-custom-surface text-white p-3" style={{ width: '95%', maxWidth: '1100px' }}>
        <div className="modal-header bg-transparent border-0 d-flex align-items-start justify-content-between">
          <h5 className="modal-title text-white">Objetivos Financeiros</h5>
          <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={onClose}></button>
        </div>
        <div className="modal-body">
          <div className="d-flex justify-content-between mb-3">
            <div />
            <button className="btn btn-custom" onClick={onOpenCreate}>Definir novo objetivo</button>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-hover table-custom">
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Data de encerramento</th>
                  <th>Valor arrecadado</th>
                  <th>Valor visado</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="5" className="text-center">Carregando...</td>
                  </tr>
                )}
                {!loading && objectives.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center">Nenhum objetivo cadastrado.</td>
                  </tr>
                )}

                {objectives.map((obj) => {
                  // suportar vários nomes de campo vindos do backend
                  const collectedCandidates = [
                    obj.collectedAmount,
                    obj.collected,
                    obj.arrecadado,
                    obj.valorArrecadado,
                    obj.totalCollected
                  ];
                  let collected = collectedCandidates.find(v => v != null);
                  // se houver lista de contribuições, somar
                  if ((obj.contributions || obj.movements || obj.contributionsList) && !collected) {
                    const list = obj.contributions || obj.movements || obj.contributionsList;
                    collected = Array.isArray(list) ? list.reduce((s, c) => s + (Number(c.value || c.valor || c.amount || 0) || 0), 0) : 0;
                  }
                  collected = Number(collected || 0);
                  const goal = Number(obj.financialGoal ?? obj.valor ?? 0);
                  const percent = goal > 0 ? Math.round((collected / goal) * 100) : 0;
                  return (
                    <tr key={obj.id} className="objective-row">
                      <td className="align-middle">{obj.description}</td>
                      <td className="align-middle">{obj.deadline ? new Date(obj.deadline).toLocaleDateString() : '-'}</td>
                      <td className="align-middle">{`R$ ${Number(collected).toFixed(2)} (${percent}%)`}</td>
                      <td className="align-middle">{`R$ ${Number(goal).toFixed(2)}`}</td>
                      <td className="align-middle objective-actions ">
                        <div className="btn-group" role="group">
                          <button className="btn btn-sm btn-outline-success" onClick={() => onOpenContribution(obj)}>Contribuir</button>
                          <button className="btn btn-sm btn-outline-warning" onClick={() => onOpenEdit(obj)}>Editar</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => onOpenDelete(obj)}>Excluir</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="modal-footer bg-transparent border-0 d-flex justify-content-end">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Fechar</button>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={confirmDelete?.isOpen}
        onClose={onCloseConfirmDelete}
        onConfirm={() => onConfirmDelete(confirmDelete?.objective?.id)}
        title="Excluir objetivo"
        message={confirmDelete?.objective ? `Deseja excluir o objetivo "${confirmDelete.objective.description || ''}"?` : undefined}
      />
    </div>
  );
};

export default ObjectivesHubModal;
