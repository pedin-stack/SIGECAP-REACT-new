import api from './axiosConfig';

const BASE = '/financial-movements';

const FinancialMovementService = {
  getAll: (params) => api.get(BASE, { params }),
  create: (movement) => api.post(BASE, movement),
  
  createWithFile: (formData) => api.post(BASE, formData, { headers: { 'Content-Type': undefined } } ),

  update: (id, movement) => api.put(`${BASE}/${id}`, movement),
  updateWithFile: (id, formData) => api.put(`${BASE}/${id}`, formData, { headers: { 'Content-Type': undefined } }),

  delete: (id) => api.delete(`${BASE}/${id}`),
};

export default FinancialMovementService;
