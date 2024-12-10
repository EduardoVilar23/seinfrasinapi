'use client'
import React, { useState, useEffect, useMemo } from "react";

interface Item {
  CODIGO: string;
  DESCRICAO: string;
  UNIDADE: string;
  CUSTO: number;
}

const ITEMS_PER_PAGE_INITIAL = 30;
const ITEMS_PER_PAGE_SEARCH = 50;

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sinapiData, setSinapiData] = useState<Item[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/data.json");
      const data: Item[] = await response.json();
      setSinapiData(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredItems = useMemo(() => {
    const queryWords = query.toLowerCase().split(" ").filter(Boolean);
    return sinapiData.filter((item) =>
      queryWords.every(
        (word) =>
          item.DESCRICAO.toLowerCase().includes(word) ||
          item.UNIDADE.toLowerCase().includes(word)
      )
    );
  }, [query, sinapiData]);

  const itemsPerPage = query ? ITEMS_PER_PAGE_SEARCH : ITEMS_PER_PAGE_INITIAL;

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const range = [];
    const maxButtons = 5;
    const halfRange = Math.floor(maxButtons / 2);
    let start = Math.max(1, currentPage - halfRange);
    let end = Math.min(totalPages, currentPage + halfRange);

    if (currentPage <= halfRange) {
      end = Math.min(totalPages, maxButtons);
    } else if (currentPage + halfRange >= totalPages) {
      start = Math.max(1, totalPages - maxButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  };

  return (
    <div className={`${isDarkMode ? "dark" : ""}`}>
      <div className="p-6 font-sans dark:bg-gray-900 dark:text-white bg-white text-gray-900 min-h-screen transition">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-500 dark:text-gray-400">
            SINAPI Outubro de 2024 (Seriviços Desonerado Piauí) - SEINFRA Parnaíba
            <span className="animate-pulse">🎄</span>
          </span>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            {isDarkMode ? "Modo Claro" : "Modo Escuro"}
          </button>
        </div>
        <main>
          <h1 className="text-2xl font-bold mb-4">SEINFRA Parnaíba - SINAPI</h1>
          <div className="mb-6 flex items-center gap-4">
            <input
              type="text"
              placeholder="Faça uma pesquisa..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="border dark:text-black border-gray-300 dark:border-gray-700 rounded-md p-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-3">
            <span>
              🌐 Powerd by <a href="https://eduardovilar.com" className="underline text-blue-700 dark:text-blue-200">eduardovilar.com</a>
            </span>
          </div>

          {loading ? (
            <div role="status" className="animate-pulse">
              <span>🤓🤚 Carregando...</span>
            </div>
          ) : (
            <div>
              {paginatedItems.length > 0 ? (
                <>
                  <table className="w-full border-collapse border dark:border-gray-700">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800">
                        <th className="border p-2 text-left dark:border-gray-700">Código</th>
                        <th className="border p-2 text-left dark:border-gray-700">Descrição</th>
                        <th className="border p-2 text-left dark:border-gray-700">Unidade</th>
                        <th className="border p-2 text-left dark:border-gray-700">Custo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedItems.map((item, index) => (
                        <tr
                          key={index}
                          className={`hover:bg-gray-100 dark:hover:bg-gray-700 ${
                            index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"
                          }`}
                        >
                          <td className="border p-2 dark:border-gray-700">{item.CODIGO}</td>
                          <td className="border p-2 dark:border-gray-700">{item.DESCRICAO}</td>
                          <td className="border p-2 dark:border-gray-700">{item.UNIDADE}</td>
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

                  <div className="flex justify-center items-center mt-4 gap-2">
                    <button
                      className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                      onClick={() => changePage(1)}
                      disabled={currentPage === 1}
                    >
                      Primeira
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                      onClick={() => changePage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </button>
                    {getPageNumbers().map((page) => (
                      <button
                        key={page}
                        onClick={() => changePage(page)}
                        className={`px-4 py-2 rounded ${
                          currentPage === page
                            ? "bg-blue-500 text-white"
                            : "bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                      onClick={() => changePage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Próxima
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                      onClick={() => changePage(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      Última
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  {`Nenhum resultado para "` + query + `" 😔`}
                </p>
              )}
            </div>
        )}
        </main>
      </div>
    </div>
  );
};

export default SearchPage;