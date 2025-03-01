import axios from "axios";

export interface Base {
  id: string;
  name: string;
  url: string;
}

export interface Item {
  CODIGO: string;
  DESCRICAO: string;
  UNIDADE: string;
  CUSTO: number;
  FONTE: string;
}

/**
 * Função para carregar as bases de dados e seus itens.
 * @returns {Promise<{ bases: Base[], data: Item[] }>} Retorna as bases disponíveis e os dados carregados.
 */
export const fetchData = async (): Promise<{ bases: Base[]; data: Item[] }> => {
  try {
    // Buscar a lista de bases disponíveis
    const response = await axios.get<Base[]>(
      "https://raw.githubusercontent.com/EduardoVilar23/datasin-db/refs/heads/master/bases.json"
    );
    const bases = response.data;

    // Criar um array de promessas para buscar os dados de cada base
    const fetchPromises = bases.map(async (base) => {
      try {
        const baseResponse = await axios.get<Item[]>(base.url);
        return baseResponse.data.map((item) => ({
          ...item,
          FONTE: base.name,
        }));
      } catch (baseError) {
        console.error(`Erro ao carregar a base ${base.name}:`, baseError);
        return []; // Retorna um array vazio caso haja erro em uma base específica
      }
    });

    // Aguarda todas as bases serem carregadas
    const loadedData = await Promise.all(fetchPromises);

    return { bases, data: loadedData.flat() };
  } catch (error) {
    console.error("Erro ao buscar as bases:", error);
    throw new Error("Falha ao carregar as bases de dados.");
  }
};