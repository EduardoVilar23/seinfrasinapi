'use client'
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useMemo } from "react";
import { fetchData, Base } from "../utils/fetchData";
import { filterData } from "../utils/filterData";

interface Item {
  CODIGO: string;
  DESCRICAO: string;
  UNIDADE: string;
  CUSTO: number;
  FONTE: string;
}

const ITEMS_PER_PAGE = 50;

const AdvancedSearchPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [unitQuery, setUnitQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [loadedData, setLoadedData] = useState<Item[]>([]);
  const [availableBases, setAvailableBases] = useState<Base[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState("all"); // Default: Todas
  const [currentPage, setCurrentPage] = useState(1); // Página atual

  useEffect(() => {
    const loadBases = async () => {
      setLoading(true);
      setError(null);
  
      try {
        const { bases, data } = await fetchData();
        setAvailableBases(bases);
        setLoadedData(data);
      } catch (error: any) {
        setError(error.message);
      }
  
      setLoading(false);
    };
  
    loadBases();
  }, []);

  // const filteredItems = useMemo(() => {
  //   const baseFiltered = filterData(query, selectedSource, loadedData);
  //   return baseFiltered.filter(
  //     (item) =>
  //       (!unitQuery || item.UNIDADE.toLowerCase().includes(unitQuery.toLowerCase())) &&
  //       item.CUSTO >= priceRange.min &&
  //       item.CUSTO <= priceRange.max
  //   );
  // }, [query, unitQuery, priceRange, selectedSource, loadedData]);

  const filteredItems = useMemo(() => {
    console.log("🔍 Parâmetros passados para filterData:");
    console.log("Query:", query);
    console.log("Selected Source:", selectedSource);
    console.log("Loaded Data:", loadedData);
    console.log("Unit Query:", unitQuery);
    console.log("Price Range:", priceRange);
  
    const filtered = filterData(query, selectedSource, loadedData, unitQuery, priceRange);
    console.log("Itens filtrados:", filtered); // ✅ Verifica os itens após a filtragem
    return filtered;
  }, [query, unitQuery, priceRange, selectedSource, loadedData]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, currentPage]);

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6 font-sans dark:bg-gray-900 dark:text-white bg-white text-gray-900 min-h-screen">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-4">
      <span className="text-gray-500 dark:text-gray-400 text-sm">
          Bases de Dados:{' '}

          {
            loading ? 
            <span>Carregando...</span>
            :
            availableBases ?
            availableBases.map((item) => {
              return(
                <span key={item.id}>{item.name} | </span>
              )
            })
            :
            <span>Indisponível</span>
          }
          
          </span>
        </div>
      <header className="flex flex-col items-center mb-6">
        <Link href={'/'}>
          <Image
            src="/logo.png"
            width={200}
            height={200}
            alt="dataSIN"
            className="mb-4"
          />
        </Link>
        <h1 className="text-2xl font-bold">Pesquisa Avançada</h1>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Busque por palavras-chave, unidades e intervalo de custos.
        </span>
      </header>

      <main>
        <div className="flex flex-col gap-4">
          {/* Campo de pesquisa por descrição */}
          <input
            type="text"
            placeholder="Pesquisar descrição..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 dark:border-gray-700 rounded-md p-2 w-full max-w-md mx-auto"
          />

          {/* Campo de pesquisa por unidade */}
          <input
            type="text"
            placeholder="Pesquisar unidade..."
            value={unitQuery}
            onChange={(e) => {
              setUnitQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 dark:border-gray-700 rounded-md p-2 w-full max-w-md mx-auto"
          />

          {/* Intervalo de preços */}
          <div className="flex gap-4 justify-center items-center">
            <input
              type="number"
              placeholder="Custo mínimo"
              value={priceRange.min === 0 ? "" : priceRange.min}
              onChange={(e) =>
                setPriceRange({
                  ...priceRange,
                  min: parseFloat(e.target.value) || 0,
                })
              }
              className="border border-gray-300 dark:border-gray-700 rounded-md p-2 w-32"
            />
            <span className="text-gray-700 dark:text-gray-400">até</span>
            <input
              type="number"
              placeholder="Custo máximo"
              value={priceRange.max === Infinity ? "" : priceRange.max}
              onChange={(e) =>
                setPriceRange({
                  ...priceRange,
                  max: parseFloat(e.target.value) || Infinity,
                })
              }
              className="border border-gray-300 dark:border-gray-700 rounded-md p-2 w-32"
            />
          </div>

          {/* Filtro por base de dados */}
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-md p-2 w-full max-w-md mx-auto appearance-none"
          >
            <option value="all">Todas as bases de dados</option>
            {availableBases.map((base) => (
              <option key={base.id} value={base.name}>
                {base.name}
              </option>
            ))}
          </select>
        </div>
        <hr className="my-6 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />

        {filteredItems.length > 0 && (
          <p className="mb-4 text-center text-gray-700 dark:text-gray-300">
            {filteredItems.length} {' '}
            {filteredItems.length > 1 ? "itens" : "item"} indexado
            {filteredItems.length > 1 ? "s" : ""}.
          </p>
        )}

        {loading ? (
          <div role="status" className="flex justify-center items-center">
          <div role="status">
              <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              <span className="sr-only">Loading...</span>
          </div>
        </div>
        ) : (
          <div>
            {paginatedItems.length > 0 ? (
              <>
                <table className="w-full border-collapse border dark:border-gray-700">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <th className="border p-2 text-left dark:border-gray-700">
                        Fonte
                      </th>
                      <th className="border p-2 text-left dark:border-gray-700">
                        Código
                      </th>
                      <th className="border p-2 text-left dark:border-gray-700">
                        Descrição
                      </th>
                      <th className="border p-2 text-left dark:border-gray-700">
                        Unidade
                      </th>
                      <th className="border p-2 text-left dark:border-gray-700">
                        Custo
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedItems.map((item, index) => (
                      <tr
                        key={index}
                        className={`hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          index % 2 === 0
                            ? "bg-white dark:bg-gray-900"
                            : "bg-gray-50 dark:bg-gray-800"
                        }`}
                      >
                        <td className="border p-2 dark:border-gray-700">
                          {item.FONTE}
                        </td>
                        <td className="border p-2 dark:border-gray-700">
                          {item.CODIGO}
                        </td>
                        <td className="border p-2 dark:border-gray-700">
                          {item.DESCRICAO}
                        </td>
                        <td className="border p-2 dark:border-gray-700">
                          {item.UNIDADE}
                        </td>
                        <td className="border p-2 dark:border-gray-700">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(item.CUSTO)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Paginação */}
                <div className="flex justify-center mt-6 gap-4">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => changePage(currentPage - 1)}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <span className="px-4 py-2 text-gray-700 dark:text-gray-400">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => changePage(currentPage + 1)}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-50"
                  >
                    Próxima
                  </button>
                </div>
              </>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                Nenhum resultado encontrado.
              </p>
            )}
          </div>
        )}
      </main>

      {/* Rodapé */}
      <footer className="mt-8 p-4 text-center text-gray-700 dark:text-gray-400">
        <p>
          &copy; {new Date().getFullYear()} DataSIN. Desenvolvido por{" "}
          <a
            href="https://eduardovilar.com"
            className="text-blue-700 hover:underline dark:text-blue-200"
          >
            Eduardo Vilar
          </a>
          <br />
          <a
            href="/eula"
            className="text-blue-700 hover:underline dark:text-blue-200"
          >
            Termos de Uso
          </a>
          <span> | </span>
          <a
            href="https://github.com/EduardoVilar23/seinfrasinapi"
            className="text-blue-700 hover:underline dark:text-blue-200"
          >
            GitHub
          </a>
        </p>
        <span className="text-xs">
          Sugestões ou ideias? Entre em contato:{" "}
          <a
            href="mailto:contato@datasin.com.br"
            className="hover:underline text-blue-700 dark:text-blue-200"
          >
            contato@datasin.com.br
          </a>
        </span>
      </footer>
    </div>
  );
};

export default AdvancedSearchPage;