import api from './axiosConfig';

// Define a rota base conforme seu UserTypeController.java
const ENDPOINT = '/user-types';

export const getAll = async (page = 0, size = 100) => {
    // Pede 100 itens para garantir que venham todos no select
    const response = await api.get(`${ENDPOINT}?page=${page}&size=${size}`);
    return response.data;
};

export const getById = async (id) => {
    const response = await api.get(`${ENDPOINT}/${id}`);
    return response.data;
};

export const save = async (data) => {
    const response = await api.post(ENDPOINT, data);
    return response.data;
};

export const update = async (id, data) => {
    const response = await api.put(`${ENDPOINT}/${id}`, data);
    return response.data;
};

export const remove = async (id) => {
    await api.delete(`${ENDPOINT}/${id}`);
};

// --- BUSCAS ESPECÍFICAS ---

export const findByTypeName = async (typeName) => {
    const response = await api.get(`${ENDPOINT}/search/typeName`, {
        params: { typeName: typeName }
    });
    return response.data;
};