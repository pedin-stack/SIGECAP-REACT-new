import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../App.css';
import StatCard from '../components/StatCard';
import useDashboard from '../use/useDashboard';

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(true);
  const { nextEvent, total, lastUpdate } = useDashboard();

  // Função para inverter o estado
  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div className="d-flex bg-custom-main" style={{ minHeight: '100vh' }}>
      <Sidebar isCollapsed={collapsed} toggleSidebar={toggleSidebar} />

      <main className="main-content p-4">
        <header className="d-flex justify-content-between align-items-center mb-5">
          <h1 className="fw-bold text-white">Dashboard</h1>
        </header>

        <div className="row g-4 col-12">
          <div className="col-12 col-md-6 col-lg-4">
            <StatCard
              title="Próximo Evento"
              value={nextEvent?.title || 'Evento nome'}
              footer={nextEvent?.date ? `Data: ${new Date(nextEvent.date).toLocaleDateString('pt-BR')}` : 'Nenhum evento agendado'}
            />
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <StatCard
              title="Saldo em Caixa"
              value={total != null ? Number(total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}
              isMoney={true}
              footer={lastUpdate ? `Atualizado em ${new Date(lastUpdate).toLocaleDateString('pt-BR')}` : 'Atualizado *Último log registrado na Tesouraria*'}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;