"use client";

import React, { useEffect, useState } from "react";
import { fetchBasesFromNocoDB, fetchItemsFromBase } from "@/app/utils/fetchDatav2";
import { Base } from "../types/Base";
import { PrecoItem } from "../types/PrecoItem";

export default function V2TestPage() {
  const [bases, setBases] = useState<Base[]>([]);
  const [items, setItems] = useState<PrecoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(25);
  const [totalRows, setTotalRows] = useState(0);
  const [selectedBase, setSelectedBase] = useState<Base | null>(null);
  const [selectedBaseName, setSelectedBaseName] = useState("SINAPI");

  const loadItems = async (page: number) => {
    if (!selectedBase) return;
    try {
      setLoading(true);
      const offset = (page - 1) * limit;
      const result = await fetchItemsFromBase(
        selectedBase.tableId,
        selectedBase.viewId,
        offset,
        limit
      );
      setItems(result.items);
      setTotalRows(result.total);
      setCurrentPage(page);
    } catch (err) {
      setError("Erro ao carregar itens.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadBasesAndItems = async () => {
      try {
        const data = await fetchBasesFromNocoDB();
        setBases(data);

        const base = data.find((b) => b.name === selectedBaseName);
        if (base) {
          setSelectedBase(base);
        }
      } catch (err) {
        setError("Erro ao carregar bases.");
      }
    };

    loadBasesAndItems();
  }, [selectedBaseName]);

  useEffect(() => {
    if (selectedBase) {
      loadItems(1);
    }
  }, [selectedBase]);

  const totalPages = Math.ceil(totalRows / limit);

  const switchDb = () => {
    selectedBaseName == "SINAPI" ?
    setSelectedBaseName("SICRO")
    :
    setSelectedBaseName("SINAPI")
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">DataSIN V2 - Teste de Fetch</h1>
      {loading && <p className="text-blue-500">Carregando bases e itens...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <>
          <h2 className="text-xl font-semibold mt-6 mb-2">Bases</h2>
          <ul className="list-disc list-inside mb-4">
            {bases.map((base: Base) => (
              <li key={base.uuid}>
                <span className="font-medium">{base.name}</span> - {base.description}
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">Itens da Base {selectedBaseName}</h2>
          <span className="text-blue-500 hover:underline cursor-pointer" onClick={() =>  switchDb()}>Alternar SICRO/SINAPI</span>
          <p className="mb-2 text-gray-600">
            Exibindo página {currentPage} de {totalPages} ({totalRows} itens)
          </p>
          <ul className="space-y-1 text-sm">
            {items.map((item) => (
              <li key={item.Id} className="border-b py-2">
                <strong>{item.CODIGO}</strong> - {item.DESCRICAO} ({item.UNIDADE}) -{" "}
                <span className="text-green-600 font-semibold">R$ {item.CUSTO}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-4 mt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => loadItems(currentPage - 1)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-700">
              Página {currentPage} de {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => loadItems(currentPage + 1)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </>
      )}
    </div>
  );
}