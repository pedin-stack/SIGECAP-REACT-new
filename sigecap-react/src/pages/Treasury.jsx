import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import '../App.css';
import '../assets/css/Treasury.css';
import UserButton from '../components/UserButton';
import FinancialMovementService from '../api/FinancialMovementService';
import CashService from '../api/CashService';

// Componente auxiliar para o Card de Opção
const OptionCard = ({ title, description, icon, onClick }) => (
  <div className="col-lg-4 col-md-6">
    <div className="option-card" onClick={onClick}>
      <div className="card-icon">
        {icon}
      </div>
      <div className="card-content">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  </div>
);

const Treasury = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  // Estados dos Modais
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [showDuesModal, setShowDuesModal] = useState(false); // Modal da Tabela Grande
  const [showManualDuesModal, setShowManualDuesModal] = useState(false); // Modal de inserir pagto
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);

  // Estados de Formulário (Simples)
  const [movementType, setMovementType] = useState('entrada');
  const [movementDescription, setMovementDescription] = useState('');
  const [movementValue, setMovementValue] = useState('');
  const [movementDate, setMovementDate] = useState('');
  const [movementFile, setMovementFile] = useState(null);

  const [movements, setMovements] = useState([]);
  const [initialBalance, setInitialBalance] = useState('');
  const [cash, setCash] = useState(null);

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('currentUser') || 'null');
    } catch (e) {
      return null;
    }
  })();

  // calcula soma das movimentações (entradas positivas, saídas negativas)
  const sumMovements = movements.reduce((acc, m) => {
    const val = Number(m.value) || 0;
    return acc + ((m.type === 'ENTRADA' || m.type === 'INCOMING') ? val : -val);
  }, 0);
  const computedTotal = (parseFloat(initialBalance) || 0) + sumMovements;
  // se o backend fornece cash.total, usa ele; caso contrário usa o total calculado localmente
  const displayedTotal = (cash && (cash.total !== null && cash.total !== undefined)) ? cash.total : computedTotal;
  const formattedTotal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(displayedTotal);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await FinancialMovementService.getAll();
        const data = res.data;
        const list = data && data.content ? data.content : data;
        setMovements(list || []);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Erro ao carregar movimentações', err);
      }
    };
    if (showBalanceModal) fetch();
  }, [showBalanceModal]);

  useEffect(() => {
    const fetchCash = async () => {
      try {
        const res = await CashService.getCurrent();
        setCash(res.data);
        if (res.data && res.data.initialValue != null) {
          setInitialBalance(String(res.data.initialValue));
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Erro ao carregar cash', err);
      }
    };
    if (showBalanceModal) fetchCash();
  }, [showBalanceModal]);

  // --- SVGs para os Cards (Substituindo FontAwesome) ---
  const iconExchange = (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 2.1l4 4-4 4"/><path d="M3 12.2v-2a4 4 0 0 1 4-4h12.8M7 21.9l-4-4 4-4"/><path d="M21 11.8v2a4 4 0 0 1-4 4H4.2"/></svg>
  );
  const iconInvoice = (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
  );
  const iconChart = (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
  );
  const iconFile = (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
  );

  return (
    <div className="d-flex bg-custom-main" style={{ minHeight: '100vh' }}>
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />

      <main className="main-content p-4 flex-grow-1" style={{ overflowY: 'auto' }}>
        
        {/* Cabeçalho */}
        <header className="d-flex justify-content-between align-items-center mb-5">
          <h1 className="fw-bold text-white">Tesouraria</h1>
          <div>
          </div>
        </header>

        {/* --- GRID DE OPÇÕES --- */}
        <section className="treasury-options">
          <div className="row g-4">
            <OptionCard 
              title="Registrar Movimentação" 
              description="Adicione novas entradas ou saídas no caixa." 
              icon={iconExchange}
              onClick={() => setShowMovementModal(true)}
            />
            <OptionCard 
              title="Gestão de Mensalidades" 
              description="Controle o status de pagamento dos membros." 
              icon={iconInvoice}
              onClick={() => setShowDuesModal(true)}
            />
            <OptionCard 
              title="Balanço Simples" 
              description="Resumo dos gastos recentes." 
              icon={iconChart}
              onClick={() => setShowBalanceModal(true)}
            />
            <OptionCard 
              title="Relatórios" 
              description="Emita relatórios detalhados." 
              icon={iconFile}
              onClick={() => setShowReportsModal(true)}
            />
          </div>
        </section>

        {/* --- MODAIS --- */}

        {/* 1. REGISTRAR MOVIMENTAÇÃO */}
        {showMovementModal && (
          <div className="modal-overlay">
            <div className="custom-modal">
              <h3 className="fw-bold text-white mb-4">Nova Movimentação</h3>
              <form>
                  <div className="form-group">
                    <label>Nome/Objeto</label>
                    <input type="text" placeholder="Ex: Materiais Filantropia" />
                  </div>

                  <div className="form-group">
                    <label>Descrição</label>
                    <input
                      type="text"
                      placeholder="Descrição detalhada da movimentação"
                      value={movementDescription}
                      onChange={(e) => setMovementDescription(e.target.value)}
                    />
                  </div>
                
                <div className="form-group">
                   <label>Tipo</label>
                   <div className="d-flex gap-2">
                     <button type="button" 
                        className={`btn w-50 ${movementType === 'entrada' ? 'btn-custom' : 'btn-outline-secondary text-white'}`}
                        onClick={() => setMovementType('entrada')}
                     >Entrada</button>
                     <button type="button" 
                        className={`btn w-50 ${movementType === 'saida' ? 'btn-custom' : 'btn-outline-secondary text-white'}`}
                        onClick={() => setMovementType('saida')}
                     >Saída</button>
                   </div>
                </div>

                <div className="row">
                   <div className="col-6">
                      <div className="form-group">
                        <label>Valor (R$)</label>
                        <input
                          type="number"
                          placeholder="0,00"
                          step="0.01"
                          value={movementValue}
                          onChange={(e) => setMovementValue(e.target.value)}
                        />
                      </div>
                   </div>
                   <div className="col-6">
                      <div className="form-group">
                        <label>Documento</label>
                        <input
                          type="file"
                          className="form-control form-control-custom"
                          onChange={(e) => setMovementFile(e.target.files[0] || null)}
                        />
                      </div>
                   </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowMovementModal(false)}>Cancelar</button>
                  <button type="button" className="btn-confirm" onClick={async () => {
                    try {
                      if (movementFile) {
                        const formData = new FormData();
                        // use a different field name to avoid Spring trying to bind the MultipartFile
                        formData.append('supportingFile', movementFile);
                        formData.append('value', String(parseFloat(movementValue) || 0));
                        formData.append('description', movementDescription || '');
                        formData.append('date', movementDate ? new Date(movementDate).toISOString() : new Date().toISOString());
                        formData.append('type', movementType === 'entrada' ? 'ENTRADA' : 'SAIDA');
                        formData.append('responsibleId', String(currentUser?.id || 1));

                        await FinancialMovementService.createWithFile(formData);
                      } else {
                        const payload = {
                          value: parseFloat(movementValue) || 0,
                          description: movementDescription,
                          date: movementDate ? new Date(movementDate).toISOString() : new Date().toISOString(),
                          type: movementType === 'entrada' ? 'ENTRADA' : 'SAIDA',
                          supportingDoc: movementFile ? movementFile.name : '',
                          responsibleId: currentUser?.id || 1,
                        };
                        await FinancialMovementService.create(payload);
                      }

                      setShowMovementModal(false);
                      setMovementDescription('');
                      setMovementValue('');
                      setMovementDate('');
                      setMovementFile(null);
                      // Atualiza lista caso o modal de balanço esteja aberto
                      if (showBalanceModal) {
                        const res = await FinancialMovementService.getAll();
                        const data = res.data;
                        const list = data && data.content ? data.content : data;
                        setMovements(list || []);
                        try {
                          const cashRes = await CashService.getCurrent();
                          setCash(cashRes.data);
                        } catch (e) {
                          // eslint-disable-next-line no-console
                          console.error('Erro ao atualizar cash após salvar movimentação', e);
                        }
                      }
                    } catch (err) {
                      // eslint-disable-next-line no-console
                      console.error('Erro ao salvar movimentação', err);
                      alert('Erro ao salvar movimentação. Veja o console para detalhes.');
                    }
                  }}>Salvar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 2. GESTÃO DE MENSALIDADES (MODAL XL) */}
        {showDuesModal && (
          <div className="modal-overlay">
            {/* Adicionada classe modal-xl para ficar largo */}
            <div className="custom-modal modal-xl"> 
              <div className="d-flex justify-content-between align-items-center mb-4">
                 <h3 className="fw-bold text-white m-0">Mensalidades 2025</h3>
                 <button className="btn-cancel" onClick={() => setShowDuesModal(false)}>Fechar</button>
              </div>

              <div className="table-responsive mb-4">
                <table className="table-custom">
                  <thead>
                    <tr>
                      <th>Membro</th>
                      <th>Jan</th><th>Fev</th><th>Mar</th><th>Abr</th>
                      <th>Mai</th><th>Jun</th><th>Jul</th><th>Ago</th>
                      <th>Set</th><th>Out</th><th>Nov</th><th>Dez</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Pedro Dourado</td>
                      <td><span className="status-badge status-paid">Pago</span></td>
                      <td><span className="status-badge status-paid">Pago</span></td>
                      <td><span className="status-badge status-paid">Pago</span></td>
                      <td><span className="status-badge status-paid">Pago</span></td>
                      <td><span className="status-badge status-paid">Pago</span></td>
                      <td><span className="status-badge status-paid">Pago</span></td>
                      <td><span className="status-badge status-paid">Pago</span></td>
                      <td><span className="status-badge status-paid">Pago</span></td>
                      <td><span className="status-badge status-paid">Pago</span></td>
                      <td><span className="status-badge status-paid">Pago</span></td>
                      <td><span className="status-badge status-pending">Pen</span></td>
                      <td><span className="status-badge status-late">Dev</span></td>
                    </tr>
                    {/* Mais linhas viriam aqui */}
                  </tbody>
                </table>
              </div>

              <div className="d-flex justify-content-end">
                <button className="btn-confirm" onClick={() => setShowManualDuesModal(true)}>
                  + Inserir Manualmente
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. INSERIR MENSALIDADE MANUALMENTE (Sobreposto ao anterior) */}
        {showManualDuesModal && (
          <div className="modal-overlay" style={{ zIndex: 1060 }}>
             <div className="custom-modal">
                <h4 className="fw-bold text-white mb-3">Inserir Pagamento</h4>
                <div className="form-group">
                   <label>Membro</label>
                   <select className="form-select-custom">
                      <option>Selecione...</option>
                      <option>Pedro Dourado</option>
                      <option>João Silva</option>
                   </select>
                </div>
                <div className="form-group">
                   <label>Mês de Referência</label>
                   <select className="form-select-custom">
                      <option>Janeiro</option>
                      <option>Fevereiro</option>
                      <option selected>Novembro</option>
                   </select>
                </div>
                <div className="form-group">
                   <label>Valor (R$)</label>
                   <input type="number" defaultValue="30.00" />
                </div>
                <div className="modal-actions">
                   <button type="button" className="btn-cancel" onClick={() => setShowManualDuesModal(false)}>Voltar</button>
                   <button type="button" className="btn-confirm">Confirmar</button>
                </div>
             </div>
          </div>
        )}

        {/* 4. BALANÇO SIMPLES */}
        {showBalanceModal && (
          <div className="modal-overlay">
            <div className="custom-modal modal-lg">
                <div className="d-flex justify-content-between align-items-center mb-4">
                   <h3 className="fw-bold text-white m-0">Balanço Recente</h3>
                   <div className="d-flex align-items-center">
                     <label className="me-2 text-white mb-0">Saldo Inicial</label>
                     <input
                       type="number"
                       className="form-control form-control-custom"
                       step="0.01"
                       value={initialBalance}
                       onChange={(e) => setInitialBalance(e.target.value)}
                     />
                     <button
                       type="button"
                       className="btn btn-confirm ms-2"
                       onClick={async () => {
                         try {
                           const payload = { initialValue: Number(initialBalance) || 0 };
                           let res;
                           if (cash && cash.id) {
                             res = await CashService.update(cash.id, payload);
                           } else {
                             res = await CashService.save(payload);
                           }
                           // eslint-disable-next-line no-console
                           console.debug('Cash save/update response', res);
                           if (res && res.data) {
                             setCash(res.data);
                             if (res.data && res.data.initialValue != null) setInitialBalance(String(res.data.initialValue));
                             alert('Saldo inicial salvo com sucesso.');
                           } else {
                             const current = await CashService.getCurrent();
                             setCash(current.data);
                             if (current.data && current.data.initialValue != null) setInitialBalance(String(current.data.initialValue));
                             alert('Saldo inicial salvo (fetch de confirmação).');
                           }
                         } catch (err) {
                           // eslint-disable-next-line no-console
                           console.error('Erro ao salvar cash', err);
                           if (err.response) {
                             alert(`Erro ao salvar saldo inicial: ${err.response.status} - ${err.response.data?.message || JSON.stringify(err.response.data)}`);
                           } else {
                             alert('Erro ao salvar saldo inicial. Veja o console para detalhes.');
                           }
                         }
                       }}
                     >Salvar</button>
                   </div>
                </div>
              <table className="table-custom">
                 <thead>
                    <tr>
                       <th>Data</th>
                       <th>Descrição</th>
                        <th>Documento</th>
                       <th>Tipo</th>
                       <th>Valor</th>
                    </tr>
                 </thead>
                 <tbody>
                    {movements && movements.length > 0 ? (
                      movements.map((m) => {
                        const date = m.date ? new Date(m.date) : null;
                        const dateStr = date ? date.toLocaleDateString() : '-';
                        const typeLabel = m.type === 'ENTRADA' || m.type === 'INCOMING' ? 'Entrada' : 'Saída';
                        const valueStr = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(m.value || 0);
                        const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:8080';
                        const docUrl = m.supportingDoc ? (m.supportingDoc.startsWith('http') ? m.supportingDoc : `${apiBase}${m.supportingDoc}`) : null;
                        return (
                          <tr key={m.id || Math.random()}>
                             <td>{dateStr}</td>
                             <td>{m.description || '-'}</td>
                             <td>{docUrl ? (<a href={docUrl} target="_blank" rel="noopener noreferrer">{m.supportingDoc}</a>) : '-'}</td>
                             <td>{m.type === 'ENTRADA' || m.type === 'INCOMING' ? <span className="text-success">{typeLabel}</span> : <span className="text-danger">{typeLabel}</span>}</td>
                             <td>{valueStr}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center' }}>Sem movimentações</td>
                      </tr>
                    )}
                 </tbody>
              </table>
                <div className="modal-actions mt-4 d-flex justify-content-between align-items-center">
                  <div className="text-white"><strong>Total:</strong> {formattedTotal}</div>
                  <button className="btn-cancel" onClick={() => setShowBalanceModal(false)}>Fechar</button>
                </div>
            </div>
          </div>
        )}

        {/* 5. RELATÓRIOS */}
        {showReportsModal && (
           <div className="modal-overlay">
              <div className="custom-modal">
                 <h3 className="fw-bold text-white mb-4">Gerar Relatório</h3>
                 <div className="row">
                    <div className="col-6">
                       <div className="form-group">
                          <label>Data Início</label>
                          <input type="date" className="form-control-custom" />
                       </div>
                    </div>
                    <div className="col-6">
                       <div className="form-group">
                          <label>Data Fim</label>
                          <input type="date" className="form-control-custom" />
                       </div>
                    </div>
                 </div>
                 <div className="modal-actions">
                    <button className="btn-cancel" onClick={() => setShowReportsModal(false)}>Cancelar</button>
                    <button className="btn-confirm">Baixar PDF</button>
                 </div>
              </div>
           </div>
        )}

      </main>
    </div>
  );
};

export default Treasury;