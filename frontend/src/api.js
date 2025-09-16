import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/"
});

export const getProdutos = () => API.get("produtos/");
export const getCarrinho = () => API.get("carrinho/");
export const adicionarCarrinho = (produto_id, quantidade=1) => API.post("carrinho/adicionar/", { produto_id, quantidade });
export const removerCarrinho = (produto_id) => API.post("carrinho/remover/", { produto_id });
