import api from './axiosConfig';

const BASE = '/financial-movements';

const FinancialMovementService = {
  getAll: (params) => api.get(BASE, { params }),
  create: (movement) => api.post(BASE, movement),
  
  createWithFile: (formData) => api.post(BASE, formData, { headers: { 'Content-Type': undefined } }),
};

export default FinancialMovementService;
