import api from './axiosConfig';

const BASE_URL = '/monthly-dues';

const MonthlyDuesService = {

  findAll: async (page = 0, size = 500) => {
    try {
      const response = await api.get(`${BASE_URL}`, { params: { page, size } });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar mensalidades:', error);
      throw error;
    }
  },

  findById: async (id) => {
    try {
      const response = await api.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar mensalidade com ID ${id}:`, error);
      throw error;
    }
  },

  save: async (data) => {
    try {
      const response = await api.post(`${BASE_URL}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao salvar mensalidade:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`${BASE_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar mensalidade ${id}:`, error);
      throw error;
    }
  },

  remove: async (id) => {
    try {
      await api.delete(`${BASE_URL}/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar mensalidade ${id}:`, error);
      throw error;
    }
  }

};

export default MonthlyDuesService;
