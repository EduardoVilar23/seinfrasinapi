import axios from "axios";

export interface Base {
  uuid: string;
  name: string;
  description: string;
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
export const fetchDataNew = async (): Promise<{ bases: Base[]; data: Item[] }> => {
  try {
    // Buscar a lista de bases disponíveis
    const response = await axios.get<{ list: Base[] }>(
      "https://app.nocodb.com/api/v2/tables/m03f89ojgondgk7/records?offset=0&limit=25&where=&viewId=vwtokg7ljcce7ssx",
      {
        headers: {
          'xc-token': 'PyBte6xcMT733Wcuoko1e6TARUnQzlNMQXmK5xZy',
        },
      }
    );

    const bases = response.data.list;

    // Criar um array de promessas para buscar os dados de cada base
    const fetchPromises = bases.map(async (base) => {
      try {
        const baseResponse = await axios.get<{ list: Item[] }>(base.url);
        return baseResponse.data.list.map((item) => ({
          ...item,
          FONTE: base.name,
        }));
      } catch (baseError) {
        console.error(`Erro ao carregar a base ${base.name}:`, baseError);
        return [];
      }
    });

    const loadedData = await Promise.all(fetchPromises);

    return { bases, data: loadedData.flat() };
  } catch (error) {
    console.error("Erro ao buscar as bases:", error);
    throw new Error("Falha ao carregar as bases de dados.");
  }
};