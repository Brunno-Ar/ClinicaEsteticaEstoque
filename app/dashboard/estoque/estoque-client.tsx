"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Edit,
  ChevronDown,
  ChevronRight,
  Package as PackageIcon,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";

interface Batch {
  id: string;
  lotCode?: string | null;
  quantity: number;
  expirationDate: Date;
  totalCost?: number | null;
  unitCost?: number | null;
}

interface Product {
  id: string;
  name: string;
  sku: string | null;
  category: string;
  price: number | any;
  unit: string;
  minStockLevel: number;
  imageUrl: string | null;
  batches: Batch[];
}

export function EstoqueClient({ products }: { products: Product[] }) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const router = useRouter();

  const toggleRow = (id: string) => {
    const newSet = new Set(expandedRows);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedRows(newSet);
  };

  const getStockStatus = (product: Product) => {
    const totalQty = product.batches.reduce((acc, b) => acc + b.quantity, 0);
    if (totalQty === 0)
      return {
        label: "Sem Estoque",
        color:
          "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-800",
      };
    if (totalQty <= product.minStockLevel)
      return {
        label: "Baixo Estoque",
        color:
          "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800",
      };
    return {
      label: "Normal",
      color:
        "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800",
    };
  };

  const isExpired = (date: Date) => new Date(date) < new Date();
  const isExpiringSoon = (date: Date) => {
    const today = new Date();
    const expiry = new Date(date);
    const diffDays = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays > 0 && diffDays <= 60;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Gerenciamento de Estoque
          </h2>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              Inventário Geral
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Gerencie produtos, lotes e validade.
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard/estoque/novo")}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors font-medium shadow-sm active:scale-95"
          >
            <Plus size={18} />
            <span>Novo Produto</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-700">
                <th className="px-6 py-4 w-12"></th>
                <th className="px-6 py-4">Produto / SKU</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4 text-center">Total em Estoque</th>
                <th className="px-6 py-4 text-center">Lotes Ativos</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
                  >
                    Nenhum produto cadastrado. Clique em "Novo Produto" para
                    começar.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const isExpanded = expandedRows.has(product.id);
                  const status = getStockStatus(product);
                  const totalQty = product.batches.reduce(
                    (acc, b) => acc + b.quantity,
                    0
                  );

                  return (
                    <>
                      <tr
                        key={product.id}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${
                          isExpanded
                            ? "bg-slate-50/50 dark:bg-slate-700/20"
                            : ""
                        }`}
                      >
                        <td
                          className="px-6 py-4 text-center cursor-pointer"
                          onClick={() => toggleRow(product.id)}
                        >
                          {isExpanded ? (
                            <ChevronDown size={18} className="text-slate-400" />
                          ) : (
                            <ChevronRight
                              size={18}
                              className="text-slate-400"
                            />
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-10 h-10 rounded-md object-cover border border-slate-200 dark:border-slate-600"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-md bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                <PackageIcon
                                  size={20}
                                  className="text-slate-400"
                                />
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-white">
                                {product.name}
                              </div>
                              {product.sku && (
                                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded inline-block mt-0.5">
                                  {product.sku}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 text-center font-medium text-slate-700 dark:text-slate-300">
                          {totalQty}{" "}
                          <span className="text-slate-400 text-xs">
                            {product.unit}s
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full text-xs font-semibold">
                            {product.batches.length}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${status.color}`}
                          >
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() =>
                                router.push(
                                  `/dashboard/estoque/${product.id}/lotes`
                                )
                              }
                              className="p-2 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-lg transition-colors"
                              title="Gerenciar Lotes"
                            >
                              <Plus size={18} />
                            </button>
                            <button
                              onClick={() =>
                                router.push(`/dashboard/estoque/${product.id}`)
                              }
                              className="p-2 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                              title="Editar Produto"
                            >
                              <Edit size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Batch View */}
                      {isExpanded && (
                        <tr className="bg-slate-50/50 dark:bg-slate-700/20">
                          <td colSpan={7} className="px-6 py-4 pb-6">
                            <div className="ml-12 p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center">
                                <PackageIcon size={16} className="mr-2" />{" "}
                                Detalhes dos Lotes
                              </h4>
                              {product.batches.length === 0 ? (
                                <div className="text-sm text-slate-400 italic">
                                  Nenhum lote registrado.
                                </div>
                              ) : (
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="text-xs text-slate-400 uppercase text-left border-b border-slate-100 dark:border-slate-800">
                                      <th className="pb-2 pl-2">ID do Lote</th>
                                      <th className="pb-2">Validade</th>
                                      <th className="pb-2 text-right">Qtd.</th>
                                      <th className="pb-2">Status</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {product.batches.map((batch) => {
                                      const expired = isExpired(
                                        batch.expirationDate
                                      );
                                      const soon = isExpiringSoon(
                                        batch.expirationDate
                                      );

                                      return (
                                        <tr
                                          key={batch.id}
                                          className="text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                                        >
                                          <td className="py-3 pl-2 font-mono font-medium">
                                            {batch.lotCode ||
                                              batch.id.slice(0, 8)}
                                          </td>
                                          <td className="py-3 font-medium">
                                            {formatDate(batch.expirationDate)}
                                          </td>
                                          <td className="py-3 text-right font-semibold">
                                            {batch.quantity}
                                          </td>
                                          <td className="py-3 pl-4">
                                            {expired ? (
                                              <span className="flex items-center text-rose-600 dark:text-rose-400 text-xs font-bold">
                                                <AlertCircle
                                                  size={14}
                                                  className="mr-1"
                                                />{" "}
                                                VENCIDO
                                              </span>
                                            ) : soon ? (
                                              <span className="flex items-center text-amber-600 dark:text-amber-400 text-xs font-bold">
                                                <AlertTriangle
                                                  size={14}
                                                  className="mr-1"
                                                />{" "}
                                                VENCE EM BREVE
                                              </span>
                                            ) : (
                                              <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                                                VIGENTE
                                              </span>
                                            )}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
