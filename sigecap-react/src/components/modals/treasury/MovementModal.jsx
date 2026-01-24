import React, { useState, useEffect } from 'react';

const MovementModal = ({ isOpen, onClose, onSave, loading, initialData }) => {
  const [type, setType] = useState('entrada');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [date, setDate] = useState('');
  const [file, setFile] = useState(null);

  // Efeito para preencher o formulário quando for Edição
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // MODO EDIÇÃO: Preenche os campos
        // Normaliza tipos vindos da API (ENTRADA/SAIDA) para os valores de UI (entrada/saida)
        const normalizedType = (initialData.type === 'ENTRADA' || initialData.type === 'INCOMING') ? 'entrada' : (initialData.type === 'SAIDA' || initialData.type === 'OUTGOING') ? 'saida' : (initialData.type === 'entrada' || initialData.type === 'saida') ? initialData.type : 'entrada';
        setType(normalizedType);
        setDescription(initialData.description || '');
        setValue(initialData.value || '');
        // Formata a data para YYYY-MM-DD se necessário, assumindo que vem ISO
        const formattedDate = initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : '';
        setDate(formattedDate);
        setFile(null); // Arquivo geralmente não vem preenchido por segurança/complexidade
      } else {
        // MODO CRIAÇÃO: Limpa os campos
        setType('entrada');
        setDescription('');
        setValue('');
        setDate('');
        setFile(null);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    // Retorna o objeto com ID se for edição, ou sem ID se for novo
    onSave({ 
      id: initialData?.id, 
      type, 
      description, 
      value, 
      date,
      file,
      // Envia o caminho/URL atual do documento caso exista; backend pode requerer em atualização
      supportingDoc: initialData?.supportingDoc
    });
  };

  return (
    <div className="modal-overlay">
      {/* Aumentei o maxWidth para 600px para ficar mais largo */}
      <div className="custom-modal" style={{ width: '100%', maxWidth: '600px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold text-white m-0">
                {initialData ? 'Editar Movimentação' : 'Nova Movimentação'}
            </h3>
            <button className="btn-close btn-close-white" onClick={onClose}></button>
        </div>

        <form>
          {/* Linha Tipo */}
          <div className="form-group mb-3">
            <label className="text-white mb-2">Tipo de Operação</label>
            <div className="d-flex gap-2">
              <button type="button" 
                className={`btn w-50 fw-bold ${type === 'entrada' ? 'btn-success' : 'btn-outline-secondary text-white'}`}
                onClick={() => setType('entrada')}
              >
                <i className="bi bi-arrow-up-circle me-2"></i> Entrada
              </button>
              <button type="button" 
                className={`btn w-50 fw-bold ${type === 'saida' ? 'btn-danger' : 'btn-outline-secondary text-white'}`}
                onClick={() => setType('saida')}
              >
                <i className="bi bi-arrow-down-circle me-2"></i> Saída
              </button>
            </div>
          </div>

          {/* Descrição */}
          <div className="form-group mb-3">
            <label className="text-white">Descrição</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ex: Velas para iniciação"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="row">
            {/* Valor */}
            <div className="col-md-6 mb-3">
              <div className="form-group">
                <label className="text-white">Valor (R$)</label>
                <input 
                    type="number" 
                    className="form-control"
                    step="0.01" 
                    placeholder="0,00"
                    value={value} 
                    onChange={(e) => setValue(e.target.value)} 
                />
              </div>
            </div>
          
          </div>

          {/* Documento */}
          <div className="form-group mb-4">
            <label className="text-white">Anexo / Comprovante</label>
            <input 
                type="file" 
                className="form-control form-control-custom" 
                onChange={(e) => setFile(e.target.files[0])} 
            />
            {initialData && <small className="text-secondary">Deixe vazio para manter o arquivo atual.</small>}
          </div>

          {/* Ações */}
          <div className="d-flex justify-content-end gap-2 pt-3 border-top border-secondary">
            <button type="button" className="btn btn-secondary px-4" onClick={onClose}>
                Cancelar
            </button>
            <button 
                type="button" 
                className={`btn px-4 fw-bold ${type === 'entrada' ? 'btn-success' : 'btn-danger'}`} 
                onClick={handleSubmit} 
                disabled={loading}
            >
              {loading ? 'Salvando...' : (initialData ? 'Atualizar' : 'Salvar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovementModal;