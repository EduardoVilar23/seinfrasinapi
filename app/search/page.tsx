'use client'
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, useMemo, Suspense } from "react";
import { fetchData, Item } from "../utils/fetchData";
import { filterData } from "../utils/filterData";
import Popup from "../components/popup";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);
  const [aboutData, setAboutData] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDarkMode(localStorage.getItem("theme") === "dark");
    }
  }, []);
  interface Base {
    id: string;
    name: string;
    url: string;
  }
  const [availableBases, setAvailableBases] = useState<Base[]>([]); // Lista das bases disponíveis
  const [loadedData, setLoadedData] = useState<Item[]>([]); // Dados combinados das bases carregadas
  const [loading, setLoading] = useState(true); // Indica se os dados estão sendo carregados
  const [loadError, setLoadError] = useState<string | null>(null); // Para capturar e exibir erros de carregamento
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    }
  }, [isDarkMode]);

  //Carregar dados da DB
  useEffect(() => {
    const loadBases = async () => {
      setLoading(true);
      setLoadError(null);
      
      try {
        const { bases, data } = await fetchData();
        setAvailableBases(bases);
        setLoadedData(data);
      } catch (error) {
        setLoadError("Falha ao carregar as bases de dados.");
        console.log(error)
      }
      
      setLoading(false);
    };

    loadBases();
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

  //Função de busca/filtragem dos itens
  const filteredItems = useMemo(() => filterData(query, selectedSource, loadedData), [
    query,
    selectedSource,
    loadedData,
  ]);

  //Paginação dos itens
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
    <div className={isDarkMode === null ? "" : isDarkMode ? "dark" : ""}>
      <div className="p-6 font-sans dark:bg-gray-900 dark:text-white bg-white text-gray-900 min-h-screen transition">
        <div className="flex justify-between items-center mb-4">
          {/* <span className="text-gray-500 dark:text-gray-400 text-sm">
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
          
          </span> */}
          <div onClick={() => {setAboutData(true)}}>
              <span className="hover:underline text-blue-500 cursor-pointer">
                Sobre os Dados
                <Popup isOpen={aboutData} onClose={() => {setAboutData(false)}} title="Os dados do DataSIN">
                  O DataSIN combina dados públicos com informações provenientes de registros de preços para oferecer uma base de consulta abrangente e confiável.
                  <div className="mt-5 mb-5 flex flex-col gap-1">
                    {
                      loading ?
                      <span>Carregando...</span>
                      :
                      availableBases ?
                      availableBases.map((item) => {
                        return(
                          <span key={item.id} className="text-sm">• {item.name}</span>
                        )
                      })
                      :
                      <span>Indisponível</span>
                    }
                  </div>
                  Consulte <Link className="hover:underline text-blue-500" href={'https://www.caixa.gov.br/poder-publico/modernizacao-gestao/sinapi/Paginas/default.aspx'}>SINAPI</Link> e <Link className="hover:underline text-blue-500" href={'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/custos-e-pagamentos/custos-e-pagamentos-dnit/sistemas-de-custos/sicro'}>SICRO</Link>.
                </Popup>
              </span>
          </div>
          <button
            onClick={() => {
              if (isDarkMode !== null) {
                const newTheme = !isDarkMode;
                setIsDarkMode(newTheme);
                localStorage.setItem("theme", newTheme ? "dark" : "light");
              }
            }}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-xl transition hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            {isDarkMode === null ? "Carregando..." : isDarkMode ? "Modo Claro" : "Modo Escuro"}
          </button>
        </div>
        <main>
          <div className="mb-6 flex items-center gap-4 flex-col">
            <Image src="/logo2.png" width={200} height={200} alt="dataSIN"/>
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
            {
              loading == false ?
              <form className="appearance-none flex flex-col items-center text-xs">
                <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white appearance-none"
              >
                <option value="all">Todas as bases de dados</option>
                {availableBases.map((base) => (
                  <option key={base.id} value={base.name}>
                    {base.name}
                  </option>
                ))}
              </select>
              </form>
              :
                <select
                value="Carregando..."
                onChange={() => {}}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white appearance-none"
              >
                <option value="null">Carregando...</option>
              </select>
            }
            <Link href={"/advanced"}>
              <span className="hover:underline text-blue-500">
                Pesquisa avançada
              </span>
            </Link>
          </div>
          <div className="flex flex-row items-center gap-2">
            <Image src="/assets/eduardo.png" width={50} height={50} alt="image description" className="rounded-full w-7 h-7 transition hover:scale-125" />
            <span>
              Powered by{" "}
            </span>
              {/* <Image src="/logo.png" width={200} height={200} alt="dataSIN"/> */}
              <a
                href="https://eduardovilar.com"
                className="hover:underline text-blue-700 dark:text-blue-200"
              >
                Eduardo Vilar
              </a>
          </div>
          <hr className="my-4 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />
          {filteredItems.length > 0 && (
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              {filteredItems.length} correspondência
              {filteredItems.length > 1 ? "s" : ""}
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
                loadError ?
                <div id="toast-default" className="flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800" role="alert">
                    <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                        </svg>
                        <span className="sr-only">Alert icon</span>
                    </div>
                    <div className="ms-3 text-sm font-normal">Erro ao carregar os dados.</div>
                </div>
                :
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