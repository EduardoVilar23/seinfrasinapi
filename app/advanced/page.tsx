'use client'
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useMemo } from "react";

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
  const [loading, setLoading] = useState(true);
  const [sinapiData, setSinapiData] = useState<Item[]>([]);
  const [sicroData, setSicroData] = useState<Item[]>([]);
  const [selectedSource, setSelectedSource] = useState("both"); // Default: Ambos
  const [currentPage, setCurrentPage] = useState(1); // Página atual

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const sinapiResponse = await fetch("/sinapi.json");
      const sicroResponse = await fetch("/sicro.json");
      const sinapi = (await sinapiResponse.json()).map((item: Item) => ({
        ...item,
        FONTE: "SINAPI",
      }));
      const sicro = (await sicroResponse.json()).map((item: Item) => ({
        ...item,
        FONTE: "SICRO",
      }));
      setSinapiData(sinapi);
      setSicroData(sicro);
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredItems = useMemo(() => {
    const queryWords = query.toLowerCase().split(" ").filter(Boolean);

    const sourceData =
      selectedSource === "sinapi"
        ? sinapiData
        : selectedSource === "sicro"
        ? sicroData
        : [...sinapiData, ...sicroData];

    return sourceData.filter((item) => {
      const matchesDescription = queryWords.every((word) =>
        item.DESCRICAO.toLowerCase().includes(word)
      );
      const matchesUnit = unitQuery
        ? item.UNIDADE.toLowerCase().includes(unitQuery.toLowerCase())
        : true;
      const matchesPrice =
        item.CUSTO >= priceRange.min && item.CUSTO <= priceRange.max;

      return matchesDescription && matchesUnit && matchesPrice;
    });
  }, [query, unitQuery, priceRange, selectedSource, sinapiData, sicroData]);

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
            Banco de Dados: PCI.817-01 - SINAPI OUT/2024 PIAUÍ e SICRO JUL/2024 NORDESTE
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
        <h1 className="text-2xl font-bold">Pesquisa Avançada - DataSIN</h1>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Busque por palavras-chave, unidades e intervalo de preços.
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
            onChange={(e) => {
              setSelectedSource(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 dark:border-gray-700 rounded-md p-2 w-full max-w-md mx-auto"
          >
            <option value="both">Todas as bases de dados</option>
            <option value="sinapi">SINAPI</option>
            <option value="sicro">SICRO</option>
          </select>
        </div>
        <hr className="my-6 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />

        {filteredItems.length > 0 && (
          <p className="mb-4 text-center text-gray-700 dark:text-gray-300">
            {filteredItems.length} correspondência
            {filteredItems.length > 1 ? "s" : ""} encontrada
            {filteredItems.length > 1 ? "s" : ""}.
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