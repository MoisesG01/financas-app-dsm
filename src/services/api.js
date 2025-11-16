import api from '../config/api';

// ========== AUTENTICAÇÃO ==========
export const authService = {
  async login(email, senha) {
    const response = await api.post('/usuarios/login', { email, senha });
    return response.data;
  },

  async cadastrar(nome, email, senha) {
    const response = await api.post('/usuarios/cadastrar', {
      nome,
      email,
      senha,
    });
    return response.data;
  },
};

// ========== USUÁRIOS ==========
export const usuarioService = {
  async getPerfil() {
    const response = await api.get('/usuarios/perfil');
    return response.data;
  },

  async atualizar(nome, email) {
    const response = await api.put('/usuarios/atualizar', { nome, email });
    return response.data;
  },

  async deletar() {
    const response = await api.delete('/usuarios/deletar');
    return response.data;
  },
};

// ========== CATEGORIAS ==========
export const categoriaService = {
  async listar() {
    const response = await api.get('/categorias');
    return response.data;
  },

  async buscarPorId(id) {
    const response = await api.get(`/categorias/${id}`);
    return response.data;
  },

  async criar(nome, tipo) {
    const response = await api.post('/categorias', { nome, tipo });
    return response.data;
  },

  async atualizar(id, nome, tipo) {
    const response = await api.put(`/categorias/${id}`, { nome, tipo });
    return response.data;
  },

  async deletar(id) {
    const response = await api.delete(`/categorias/${id}`);
    return response.data;
  },
};

// ========== TRANSAÇÕES ==========
export const transacaoService = {
  async listar(filtros = {}) {
    const params = new URLSearchParams();
    if (filtros.tipo) params.append('tipo', filtros.tipo);
    if (filtros.data_inicio) params.append('data_inicio', filtros.data_inicio);
    if (filtros.data_fim) params.append('data_fim', filtros.data_fim);
    if (filtros.id_categoria) params.append('id_categoria', filtros.id_categoria);

    const queryString = params.toString();
    const url = `/transacoes${queryString ? `?${queryString}` : ''}`;
    const response = await api.get(url);
    return response.data;
  },

  async buscarPorId(id) {
    const response = await api.get(`/transacoes/${id}`);
    return response.data;
  },

  async criar(descricao, valor, data, tipo, id_categoria) {
    const response = await api.post('/transacoes', {
      descricao,
      valor: parseFloat(valor),
      data,
      tipo,
      id_categoria: parseInt(id_categoria),
    });
    return response.data;
  },

  async atualizar(id, descricao, valor, data, tipo, id_categoria) {
    const response = await api.put(`/transacoes/${id}`, {
      descricao,
      valor: parseFloat(valor),
      data,
      tipo,
      id_categoria: parseInt(id_categoria),
    });
    return response.data;
  },

  async deletar(id) {
    const response = await api.delete(`/transacoes/${id}`);
    return response.data;
  },

  async getResumo(dataInicio, dataFim) {
    const response = await api.get(
      `/transacoes/resumo?data_inicio=${dataInicio}&data_fim=${dataFim}`
    );
    return response.data;
  },
};

