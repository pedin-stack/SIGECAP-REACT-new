import api from './axiosConfig';

const BASE_URL = '/monthly-dues/dues';

const PaymentService = {
  // Gera PIX para uma mensalidade específica (monthlyDuesId)
  generatePixForDues: async (monthlyDuesId) => {
    try {
      const response = await api.post(`${BASE_URL}/${monthlyDuesId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao gerar pagamento PIX para a mensalidade ${monthlyDuesId}:`, error);
      throw error;
    }
  }
};

export default PaymentService;
