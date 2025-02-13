'use client'
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, useMemo, Suspense } from "react";

interface Item {
  CODIGO: string;
  DESCRICAO: string;
  UNIDADE: string;
  CUSTO: number;
  FONTE: string; // Adicionado para indicar a fonte
}

const ITEMS_PER_PAGE_INITIAL = 30;
const ITEMS_PER_PAGE_SEARCH = 50;

const SearchPage: React.FC = () => {
    return (
      <Suspense fallback={<div/>}>
        <SearchContent />
      </Suspense>
    );
  };

const SearchContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialSource = searchParams.get("base") || "all";
  
  const [query, setQuery] = useState(initialQuery);
  const [selectedSource, setSelectedSource] = useState(initialSource);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sinapiData, setSinapiData] = useState<Item[]>([]);
  const [sicroData, setSicroData] = useState<Item[]>([]);
  const [pregaoData, setPregaoData] = useState<Item[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const sinapiResponse = await fetch("/sinapi.json");
      const sicroResponse = await fetch("/sicro.json");
      const pregaoResponse = await fetch("/pregao.json");
      const sinapi = (await sinapiResponse.json()).map((item: Item) => ({
        ...item,
        FONTE: "SINAPI",
      }));
      const sicro = (await sicroResponse.json()).map((item: Item) => ({
        ...item,
        FONTE: "SICRO",
      }));
      const pregao = (await pregaoResponse.json()).map((item: Item) => ({
        ...item,
        FONTE: "PREGÃO 133/2023 PMP",
      }));
      setSinapiData(sinapi);
      setSicroData(sicro);
      setPregaoData(pregao);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Atualiza a URL quando a pesquisa ou base muda
  useEffect(() => {
    const newUrl = `/search?base=${selectedSource}${query ? `&q=${encodeURIComponent(query)}` : ""}`;
    router.push(newUrl, { scroll: false });
  }, [query, selectedSource]);

  useEffect(() => {
    setQuery(initialQuery);
    setSelectedSource(initialSource);
  }, [searchParams]);

  const filteredItems = useMemo(() => {
    const queryWords = query.toLowerCase().split(" ").filter(Boolean);

    const sourceData =
      selectedSource === "sinapi"
        ? sinapiData
        : selectedSource === "sicro"
        ? sicroData
        : selectedSource === "pregao1332023"
        ? pregaoData
        :
        [...sinapiData, ...sicroData, ...pregaoData];

    return sourceData.filter((item) =>
      queryWords.every(
        (word) =>
          item.DESCRICAO.toLowerCase().includes(word) ||
          item.UNIDADE.toLowerCase().includes(word) ||
          item.CODIGO.includes(word)
      )
    );
  }, [query, selectedSource, sinapiData, sicroData, pregaoData]);

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
          <span className="text-gray-500 dark:text-gray-400 text-sm">
          Banco de Dados: SINAPI DEZ/2024 Piauí - SICRO JUL/2024 Nordeste - Pregão Eletrônico 133/2023 (PMP)
          </span>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-xl transition hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            {isDarkMode ? "Modo Claro" : "Modo Escuro"}
          </button>
        </div>
        <main>
          <div className="mb-6 flex items-center gap-4 flex-col">
            <Image src="/logo.png" width={200} height={200} alt="dataSIN"/>
            {/* <span>DataSIN - Seinfra Parnaíba</span> */}
            <form className="max-w-md mx-auto w-full">
              <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Buscar</label>
              <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
              </div>
                <input
                  type="text"
                  placeholder="Faça uma pesquisa..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </form>
            <span className="text-sm opacity-60">
              Pesquise por palavras-chave, unidades de medida e/ou código.
            </span>
            <form className="appearance-none flex flex-col items-center text-xs">
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 appearance-none cursor-pointer hover:scale-105 transition"
              >
                <option value="sinapi">SINAPI</option>
                <option value="sicro">SICRO</option>
                <option value="pregao1332023">PREGÃO 133/2023 PMP</option>
                <option value="all">Todas as bases de dados</option>
              </select>
            </form>
            <Link href={"/advanced"}>
              <span className="hover:underline text-blue-500">
                Pesquisa avançada
              </span>
            </Link>
          </div>
          <div>
            <span>
              ⚡︎ Powered by{" "}
              <a
                href="https://eduardovilar.com"
                className="hover:underline text-blue-700 dark:text-blue-200"
              >
                Eduardo Vilar
              </a>
            </span>
          </div>
          <hr className="my-4 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />
          {filteredItems.length > 0 && query && (
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              {filteredItems.length} correspondência
              {filteredItems.length > 1 ? "s" : ""}
            </p>
          )}
          {loading ? (
            <div role="status" className="animate-pulse">
              <span>Carregando...</span>
            </div>
          ) : (
            <div>
              {paginatedItems.length > 0 ? (
                <>
                  <table className="w-full border-collapse border dark:border-gray-700 transition">
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
                  {`Nenhum resultado para "` + query + `"`}
                </p>
              )}
            </div>
          )}
        </main>
        <footer className="mt-8 p-4 text-center text-gray-700 dark:text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} DataSIN. Made by {" "}
            <a
              href="https://eduardovilar.com"
              className="text-blue-700 hover:underline dark:text-blue-200"
            >
              Eduardo Vilar
            </a>
            <br/>
            <a
              href="/eula"
              className="text-blue-700 hover:underline dark:text-blue-200"
            >
              Termos de Uso
            </a>
            <span> | </span>
            <a
              href="/privacy"
              className="text-blue-700 hover:underline dark:text-blue-200"
            >
              Privacidade
            </a>
          </p>
          <span className="text-xs">
            Sugestões ou ideias? Entre em contato: <a href="mailto:contato@datasin.com.br" className="hover:underline text-blue-700 dark:text-blue-200">contato@datasin.com.br</a>
          </span>
        </footer>
      </div>
    </div>
  );
};

export default SearchPage;