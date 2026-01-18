import api from './axiosConfig';

const BASE = '/attendances';

const AttendanceService = {
  // GET /attendances with params (eventId, page, size)
  findAll: (params) => api.get(BASE, { params }),

  // GET /attendances/{id}
  findById: (id) => api.get(`${BASE}/${id}`),

  // PUT /attendances/{id}
  update: (id, payload) => api.put(`${BASE}/${id}`, payload),

  // POST /attendances
  create: (payload) => api.post(BASE, payload),

  // DELETE /attendances/{id}
  remove: (id) => api.delete(`${BASE}/${id}`),
};

export default AttendanceService;
