import axios from "axios";
import { PrecoItem } from "../types/PrecoItem";
import { Base } from "../types/Base";
import { PrecoItemResponse } from "../types/PrecoItemResponse";

const NOCODB_TOKEN = "PyBte6xcMT733Wcuoko1e6TARUnQzlNMQXmK5xZy";

// Função de carregar a lista de bases de preços
export const fetchBasesFromNocoDB = async (): Promise<Base[]> => {
  try {
    const response = await axios.get<{ list: Base[] }>(
      "https://app.nocodb.com/api/v2/tables/m03f89ojgondgk7/records",
      {
        params: {
          offset: "0",
          limit: "25",
          where: "",
          viewId: "vwtokg7ljcce7ssx",
        },
        headers: {
          "xc-token": NOCODB_TOKEN,
        },
      }
    );

    return response.data.list;
  } catch (error) {
    console.error("Erro ao buscar as bases do NocoDB:", error);
    throw new Error("Falha ao carregar as bases de dados.");
  }
};

// Função de carregar individualmente uma base de preços
export const fetchItemsFromBase = async (
  tableId: string,
  viewId: string,
  offset = 0,
  limit = 25,
): Promise<PrecoItemResponse> => {
  try {
    const url = `https://app.nocodb.com/api/v2/tables/${tableId}/records`;

    const response = await axios.get<{ list: PrecoItem[]; pageInfo: { totalRows: number } }>(url, {
      params: {
        offset,
        limit,
        where: "",
        viewId,
      },
      headers: {
        "xc-token": NOCODB_TOKEN,
      },
    });

    return {
      items: response.data.list,
      total: response.data.pageInfo.totalRows,
    };
  } catch (error) {
    console.error("Erro ao buscar itens da base:", error);
    throw new Error("Falha ao carregar os itens.");
  }
};