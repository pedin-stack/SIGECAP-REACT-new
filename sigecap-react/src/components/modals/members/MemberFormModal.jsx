import React, { useState, useEffect } from 'react';
import { USER_TYPES, OCCUPATIONS } from '../../../use/UseMembers';
import { 
  CreateButton,  
  ExcludeButton, 
  CancelButton,
  EditButton
} from '../../buttons/Buttons';

const MemberFormModal = ({ isOpen, onClose, onSave, initialData, isEditing }) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="custom-modal large-modal">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold text-white m-0">
            {isEditing ? 'Editar Membro' : 'Novo Membro'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
           {/* Linha 1 */}
           <div className="row">
             <div className="col-md-6 form-group">
               <label>Nome Completo</label>
               <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Ex: João da Silva" />
             </div>
             <div className="col-md-6 form-group">
               <label>CPF</label>
               <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} required placeholder="000.000.000-00" />
             </div>
           </div>

           {/* Linha 2 */}
           <div className="row">
             <div className="col-md-6 form-group">
               <label>Data de Nascimento</label>
               <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
             </div>
             <div className="col-md-6 form-group">
               <label>Telefone</label>
               <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="(00) 00000-0000" />
             </div>
           </div>

           {/* Linha 3 */}
           <div className="row">
             <div className="col-md-6 form-group">
               <label>Email</label>
               <input type="email" name="email" value={formData.email} onChange={handleChange} required />
             </div>
             <div className="col-md-6 form-group">
               <label>Senha</label>
               <input type="password" name="password" value={formData.password} onChange={handleChange} required={!isEditing} placeholder={isEditing ? "Deixe em branco para manter" : ""} />
             </div>
           </div>

           <hr className="border-secondary my-3" />

           {/* Linha 4: Tipo e Cargo */}
           <div className="row">
             <div className="col-md-6 form-group">
               <label>Tipo de Usuário</label>
               <select name="type" value={formData.type} onChange={handleChange} required className="form-select custom-select-dark">
                 <option value="">Selecione...</option>
                 {Object.entries(USER_TYPES).map(([key, label]) => (
                   <option key={key} value={key}>{label}</option>
                 ))}
               </select>
             </div>
             <div className="col-md-6 form-group">
               <label>Ocupação / Cargo</label>
               <select name="occupation" value={formData.occupation} onChange={handleChange} required className="form-select custom-select-dark">
                 <option value="">Selecione...</option>
                 {Object.entries(OCCUPATIONS).map(([key, label]) => (
                   <option key={key} value={key}>{label}</option>
                 ))}
               </select>
             </div>
           </div>

           {/* Status */}
           <div className="form-group mt-3">
             <label className="d-block mb-2">Status</label>
             <div className="d-flex gap-4">
               <div className="form-check">
                 <input className="custom-radio-btn" type="radio" name="status" id="statusAtivo" value="ativo" checked={formData.status === 'ativo'} onChange={handleChange} />
                 <label className="form-check-label text-white" htmlFor="statusAtivo">Ativo</label>
               </div>
               <div className="form-check">
                 <input className="custom-radio-btn" type="radio" name="status" id="statusInativo" value="inativo" checked={formData.status === 'inativo'} onChange={handleChange} />
                 <label className="form-check-label text-white" htmlFor="statusInativo">Inativo</label>
               </div>
             </div>
           </div>

           <div className="d-flex justify-content-end gap-2 mt-4">
            <CancelButton onClick={onClose} label="Cancelar" />
             <CreateButton type="submit" label={isEditing ? "Salvar Alterações" : "Criar Membro"} />
           </div>
        </form>
      </div>
    </div>
  );
};

export default MemberFormModal;