'use client'
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useMemo } from "react";

interface Item {
  CODIGO: string;
  DESCRICAO: string;
  UNIDADE: string;
  CUSTO: number;
}

const AdvancedSearchPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [unitQuery, setUnitQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [sinapiData, setSinapiData] = useState<Item[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/data.json");
      const data: Item[] = await response.json();
      setSinapiData(data);
    };

    fetchData();
  }, []);

  const filteredItems = useMemo(() => {
    const queryWords = query.toLowerCase().split(" ").filter(Boolean);

    return sinapiData.filter((item) => {
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
  }, [query, unitQuery, priceRange, sinapiData]);

  return (
    <div className="p-6 font-sans dark:bg-gray-900 dark:text-white bg-white text-gray-900 min-h-screen">
      {/* Cabeçalho */}
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
            onChange={(e) => setQuery(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-md p-2 w-full max-w-md mx-auto"
          />

          {/* Campo de pesquisa por unidade */}
          <input
            type="text"
            placeholder="Pesquisar unidade..."
            value={unitQuery}
            onChange={(e) => setUnitQuery(e.target.value)}
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
        </div>
        <hr className="my-6 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />
        
        {/* Exibir resultados somente após a pesquisa */}
        {query || unitQuery || priceRange.min !== 0 || priceRange.max !== Infinity ? (
          <div>
            {filteredItems.length > 0 ? (
              <>
                <p className="mb-4 text-center text-gray-700 dark:text-gray-300">
                  {filteredItems.length} correspondência
                  {filteredItems.length > 1 ? "s" : ""} encontrada
                  {filteredItems.length > 1 ? "s" : ""}.
                </p>
                <table className="w-full border-collapse border dark:border-gray-700">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800">
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
                    {filteredItems.map((item, index) => (
                      <tr
                        key={index}
                        className={`hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          index % 2 === 0
                            ? "bg-white dark:bg-gray-900"
                            : "bg-gray-50 dark:bg-gray-800"
                        }`}
                      >
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
              </>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                Nenhum resultado encontrado.
              </p>
            )}
          </div>
        ) : null}
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