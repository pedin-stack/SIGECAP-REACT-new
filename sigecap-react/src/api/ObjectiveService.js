import api from './axiosConfig';

const BASE = '/objectives';

const ObjectiveService = {

  getAll: (params) => api.get(BASE, { params }),
  getById: (id) => api.get(`${BASE}/${id}`),
  create: (objective) => api.post(BASE, objective),
  update: (id, objective) => api.put(`${BASE}/${id}`, objective),
  delete: (id) => api.delete(`${BASE}/${id}`),

  addContribution: (id, contributionData) => {

    return api.post(`${BASE}/${id}/contribution`, contributionData);
  }
};

export default ObjectiveService;