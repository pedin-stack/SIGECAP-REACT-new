import api from './axiosConfig'; 

const BASE_URL = '/users';

const UserService = {

    findAll: async (page = 0, size = 20) => {
        try {
            const response = await api.get(`${BASE_URL}`, {
                params: { page, size }
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
            throw error;
        }
    },

    // Consome: GET /users/{id}
    findById: async (id) => {
        try {
            const response = await api.get(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar usuário com ID ${id}:`, error);
            throw error;
        }
    },

    // Consome: POST /users
    // O objeto userData deve corresponder aos campos do UserRequestDTO
    save: async (userData) => {
        try {
            const response = await api.post(`${BASE_URL}`, userData);
            return response.data;
        } catch (error) {
            // Log detalhado para facilitar debug de 4xx/5xx
            if (error.response) {
                console.error("Erro ao salvar usuário: status=", error.response.status, "data=", error.response.data);
            } else {
                console.error("Erro ao salvar usuário:", error.message);
            }
            throw error;
        }
    },

    // Consome: PUT /users/{id}
    update: async (id, userData) => {
        try {
            const response = await api.put(`${BASE_URL}/${id}`, userData);
            return response.data;
        } catch (error) {
            console.error(`Erro ao atualizar usuário com ID ${id}:`, error);
            throw error;
        }
    },

    // Consome: DELETE /users/{id}
    delete: async (id) => {
        try {
            // O backend retorna 204 No Content, então não precisamos retornar dados
            await api.delete(`${BASE_URL}/${id}`);
        } catch (error) {
            console.error(`Erro ao deletar usuário com ID ${id}:`, error);
            throw error;
        }
    },

    // --- Métodos de Busca Específicos ---

    // Consome: GET /users/search/email?email={email}
    findByEmail: async (email) => {
        try {
            const response = await api.get(`${BASE_URL}/search/email`, {
                params: { email }
            });
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar usuário pelo e-mail ${email}:`, error);
            throw error;
        }
    },

    // Consome: GET /users/search/status?active={active}
    findByStatus: async (active) => {
        try {
            // 'active' deve ser um booleano (true/false)
            const response = await api.get(`${BASE_URL}/search/status`, {
                params: { active }
            });
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar usuários pelo status active=${active}:`, error);
            throw error;
        }
    },

    // Consome: GET /users/search/type?typeId={typeId}
    findByUserType: async (typeId) => {
        try {
            const response = await api.get(`${BASE_URL}/search/type`, {
                params: { typeId }
            });
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar usuários pelo tipo ID ${typeId}:`, error);
            throw error;
        }
    }
};

export default UserService;