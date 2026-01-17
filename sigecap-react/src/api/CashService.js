import api from './axiosConfig';

const BASE = '/cash';

const CashService = {
  getCurrent: () => api.get(BASE),
  save: (payload) => api.post(BASE, payload),
  update: (id, payload) => api.put(`${BASE}/${id}`, payload),
};

export default CashService;
