import { Item } from "./fetchData";

/**
 * Filtra os dados com base na pesquisa do usuário e na base de dados selecionada.
 * 
 * @param query - O termo de pesquisa digitado pelo usuário.
 * @param selectedSource - A base de dados selecionada ("all" para todas as bases).
 * @param loadedData - A lista completa de itens carregados.
 * @param unitQuery - A unidade que deve ser filtrada.
 * @param priceRange - Intervalo de preço selecionado.
 * @returns {Item[]} - Retorna a lista filtrada de itens.
 */
export const filterData = (
    query: string,
    selectedSource: string,
    loadedData: Item[],
    unitQuery: string = "", // Valor padrão: string vazia
    priceRange: { min: number; max: number } = { min: 0, max: Infinity } // Valor padrão: intervalo completo
  ): Item[] => {
    if (!loadedData.length) return [];

  // Filtra pela base de dados selecionada
  const sourceFiltered =
    selectedSource === "all"
      ? loadedData
      : loadedData.filter((item) => item.FONTE === selectedSource);

  // Se não houver pesquisa, retorna apenas os itens filtrados pela base de dados
  if (!query && !unitQuery && priceRange.min === 0 && priceRange.max === Infinity) {
    return sourceFiltered;
  }

  const queryWords = query.toLowerCase().split(" ").filter(Boolean);

  return sourceFiltered.filter((item) => {
    // Filtro por código, descrição e unidade
    const matchesSearch = queryWords.every((word) =>
      item.CODIGO.toLowerCase().includes(word) ||
      item.DESCRICAO.toLowerCase().includes(word) ||
      item.UNIDADE.toLowerCase().includes(word)
    );

    // Filtro por unidade (se houver)
    const matchesUnit = unitQuery
      ? item.UNIDADE.toLowerCase().includes(unitQuery.toLowerCase())
      : true;

    // Filtro por intervalo de preço
    const matchesPrice =
      item.CUSTO >= priceRange.min && item.CUSTO <= priceRange.max;

    return matchesSearch && matchesUnit && matchesPrice;
  });
};