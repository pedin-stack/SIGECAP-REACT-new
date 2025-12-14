import React, { useState } from 'react';
import StatCard from '../components/StatCard';
import Sidebar from '../components/Sidebar';
import '../App.css'; 
import UserButton from '../components/UserButton';

const Dashboard = () => {

  const [collapsed, setCollapsed] = useState(true);

  // Função para inverter o estado
  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div className="d-flex bg-custom-main" style={{ minHeight: '100vh' }}>
      
      {/* 1. Componente Sidebar */}
      <Sidebar isCollapsed={collapsed} toggleSidebar={toggleSidebar} />

      {/* 2. Área Principal */}
      <main className="main-content p-4">
        
        {/* Cabeçalho */}
        <header className="d-flex justify-content-between align-items-center mb-5">
          <h1 className="fw-bold text-white">Dashboard</h1>
          <div>
            <UserButton />
          </div>
        </header>

        {/* Grid de Cards (Utilizando Bootstrap Grid System) */}
        <div className="row g-4">
          
          {/* Card 1: Eventos */}
          <div className="col-12 col-md-6 col-lg-4">
            <StatCard 
              title="Próximos Eventos"
              value="Evento nome"
              footer="Data: 20/12/2025"
            />
          </div>

          {/* Card 2: Saldo */}
          <div className="col-12 col-md-6 col-lg-4">
            <StatCard 
              title="Saldo em Caixa"
              value="R$ 1.250,00"
              isMoney={true}
              footer="Atualizado *Último log registrado na Tesouraria*"
            />
          </div>

          {/* Card 3: Avisos */}
          <div className="col-12 col-md-6 col-lg-4">
            <StatCard 
              title="Último Aviso"
              value="*Aviso Importante*"
              footer="Enviado por: Mestre Conselheiro"
            />
          </div>

        </div>

      </main>
    </div>
  );
};

export default Dashboard;