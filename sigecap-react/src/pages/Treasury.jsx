import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../App.css';
import '../assets/css/Treasury.css';

// Hook
import { useTreasury } from '../use/useTreasury';

// Modais de Domínio
import MovementModal from '../components/modals/treasury/MovementModal';
import DuesModal from '../components/modals/treasury/DuesModal';
import ManualDuesModal from '../components/modals/treasury/ManualDuesModal';
import BalanceModal from '../components/modals/treasury/BalanceModal';
import ReportsModal from '../components/modals/treasury/ReportsModal';
import OptionCard from '../components/OptionCard';

// Modais Genéricos (Sucesso/Erro)
import SuccessModal from '../components/modals/successModal';
import ExceptionModal from '../components/modals/errorModal';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';



const Treasury = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  // Importando lógica do Hook
  const {
    modals,
    toggleModal,
    feedback,
    closeFeedback,
    movements,
    cash,
    loading,
    selectedMovement,
    handleCreateMovement,
    handleOpenEditMovement,
    handleDeleteMovement,
    openConfirmDelete,
    confirmDelete,
    closeConfirmDelete,
    confirmDeleteAction,
    handleSaveInitialBalance
  } = useTreasury();

  // Ícones (SVGs)
  const iconExchange = (<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 2.1l4 4-4 4"/><path d="M3 12.2v-2a4 4 0 0 1 4-4h12.8M7 21.9l-4-4 4-4"/><path d="M21 11.8v2a4 4 0 0 1-4 4H4.2"/></svg>);
  const iconInvoice = (<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>);
  const iconChart = (<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>);
  const iconFile = (<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>);

  return (
    <div className="d-flex bg-custom-main" style={{ minHeight: '100vh' }}>
      <Sidebar isCollapsed={sidebarCollapsed} toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className="main-content p-4 flex-grow-1" style={{ overflowY: 'auto' }}>
        <header className="d-flex justify-content-between align-items-center mb-5">
          <h1 className="fw-bold text-white">Tesouraria</h1>
        </header>

        <section className="treasury-options">
          <div className="row g-4">
            <OptionCard 
              title="Registrar Movimentação" 
              description="Adicione novas entradas ou saídas no caixa." 
              icon={iconExchange} 
              onClick={() => handleOpenEditMovement(null)} 
            />
            <OptionCard 
              title="Gestão de Mensalidades" 
              description="Controle o status de pagamento dos membros." 
              icon={iconInvoice} 
              onClick={() => toggleModal('dues', true)} 
            />
            <OptionCard 
              title="Balanço Simples" 
              description="Resumo dos gastos recentes." 
              icon={iconChart} 
              onClick={() => toggleModal('balance', true)} 
            />
            <OptionCard 
              title="Relatórios" 
              description="Emita relatórios detalhados." 
              icon={iconFile} 
              onClick={() => toggleModal('reports', true)} 
            />
          </div>
        </section>

        <DuesModal 
          isOpen={modals.dues} 
          onClose={() => toggleModal('dues', false)} 
          onOpenManualEntry={() => toggleModal('manualDues', true)}
        />

        <ManualDuesModal 
          isOpen={modals.manualDues} 
          onClose={() => toggleModal('manualDues', false)} 
        />

          <BalanceModal 
            isOpen={modals.balance} 
            onClose={() => toggleModal('balance', false)}
            movements={movements}
            cash={cash} 
            onEditMovement={handleOpenEditMovement}
             onDeleteMovement={openConfirmDelete}
            onSaveInitialBalance={handleSaveInitialBalance}
          />

          <ConfirmDeleteModal
            isOpen={confirmDelete.isOpen}
            onClose={closeConfirmDelete}
            onConfirm={confirmDeleteAction}
            title="Excluir movimentação"
            message={confirmDelete.movement ? `Deseja excluir a movimentação "${confirmDelete.movement.description || ''}" no valor de R$ ${confirmDelete.movement.value || ''}?` : undefined}
          />

        <ReportsModal 
          isOpen={modals.reports} 
          onClose={() => toggleModal('reports', false)} 
        />

        <MovementModal 
          isOpen={modals.movement} 
          onClose={() => toggleModal('movement', false)} 
          onSave={handleCreateMovement}
          loading={loading}
          initialData={selectedMovement}
        />

        {/* --- MODAIS DE FEEDBACK (SUCESSO/ERRO) --- */}
        <SuccessModal 
          isOpen={feedback.success.isOpen} 
          onClose={closeFeedback} 
          message={feedback.success.message} 
        />
        
        <ExceptionModal 
          isOpen={feedback.error.isOpen} 
          onClose={closeFeedback} 
          message={feedback.error.message} 
        />

      </main>
    </div>
  );
};

export default Treasury;