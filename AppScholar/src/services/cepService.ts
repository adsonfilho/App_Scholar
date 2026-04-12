import axios from 'axios';
import { API_CONFIG } from '../config/config'; 

const viaCepApi = axios.create({
  baseURL: API_CONFIG.VIA_CEP_URL,
  timeout: 5000, 
});

export interface ICepResponse {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export const getAddressByCep = async (cep: string): Promise<ICepResponse | null> => {
  const cleanedCep = cep.replace(/\D/g, '');

  if (cleanedCep.length !== 8) return null;

  try {
    const response = await viaCepApi.get(`${cleanedCep}/json/`);
    
    if (response.data.erro) {
      return null;
    }

    return response.data;
  } catch (error) {
    console.error("Erro na requisição Axios:", error);
    return null;
  }
};