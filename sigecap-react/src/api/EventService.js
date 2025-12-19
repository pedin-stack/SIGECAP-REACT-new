import api from './axiosConfig';

const BASE_URL = '/events';

const EventService = {

  findAll: async (page = 0, size = 20) => {
    try {
      const response = await api.get(`${BASE_URL}`, { params: { page, size } });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      throw error;
    }
  },

  findById: async (id) => {
    try {
      const response = await api.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar evento com ID ${id}:`, error);
      throw error;
    }
  },

  save: async (eventData) => {
    try {
      const response = await api.post(`${BASE_URL}`, eventData);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Erro ao salvar evento: status=', error.response.status, 'data=', error.response.data);
      } else {
        console.error('Erro ao salvar evento:', error.message);
      }
      throw error;
    }
  },

  update: async (id, eventData) => {
    try {
      const response = await api.put(`${BASE_URL}/${id}`, eventData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar evento com ID ${id}:`, error);
      throw error;
    }
  },

  remove: async (id) => {
    try {
      await api.delete(`${BASE_URL}/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar evento com ID ${id}:`, error);
      throw error;
    }
  }

};

export default EventService;
