"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Package } from "lucide-react";

interface Batch {
  id: string;
  quantity: number;
  expirationDate: string;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  unit: string;
  batches: Batch[];
}

export default function GerenciarLotesPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  async function fetchProduct() {
    try {
      const response = await fetch(`/api/products/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      } else {
        setError("Produto não encontrado");
      }
    } catch (err) {
      setError("Erro ao carregar produto");
    } finally {
      setFetching(false);
    }
  }

  async function handleAddBatch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: params.id,
          quantity: parseInt(formData.get("quantity") as string),
          expirationDate: formData.get("expirationDate"),
        }),
      });

      if (response.ok) {
        setShowAddForm(false);
        fetchProduct();
      } else {
        const data = await response.json();
        setError(data.error || "Erro ao adicionar lote");
      }
    } catch (err) {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteBatch(batchId: string) {
    if (!confirm("Tem certeza que deseja excluir este lote?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/batches/${batchId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchProduct();
      } else {
        const data = await response.json();
        setError(data.error || "Erro ao excluir lote");
      }
    } catch (err) {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
  };

  const getExpiryStatus = (date: string) => {
    const expiry = new Date(date);
    const today = new Date();
    const diffDays = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0)
      return {
        label: "Vencido",
        color: "text-rose-600 bg-rose-100 dark:bg-rose-900/30",
      };
    if (diffDays <= 30)
      return {
        label: "Crítico",
        color: "text-red-600 bg-red-100 dark:bg-red-900/30",
      };
    if (diffDays <= 60)
      return {
        label: "Atenção",
        color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30",
      };
    return {
      label: "OK",
      color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30",
    };
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Carregando...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-slate-500 mb-4">
          {error || "Produto não encontrado"}
        </div>
        <Link
          href="/dashboard/estoque"
          className="text-teal-600 hover:underline"
        >
          Voltar ao Estoque
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/estoque"
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ArrowLeft
              size={24}
              className="text-slate-600 dark:text-slate-300"
            />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              Gerenciar Lotes
            </h1>
            <p className="text-slate-500 dark:text-slate-400">{product.name}</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          Novo Lote
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Add Batch Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
            Adicionar Novo Lote
          </h2>
          <form
            onSubmit={handleAddBatch}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Quantidade *
              </label>
              <input
                type="number"
                name="quantity"
                min="1"
                required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Data de Validade *
              </label>
              <input
                type="date"
                name="expirationDate"
                required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-600/50 text-white rounded-lg font-medium transition-colors"
              >
                {loading ? "Salvando..." : "Adicionar"}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-3 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Batches List */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Package size={20} />
            Lotes Cadastrados ({product.batches.length})
          </h2>
        </div>

        {product.batches.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            Nenhum lote cadastrado. Clique em "Novo Lote" para adicionar.
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4">ID do Lote</th>
                <th className="px-6 py-4">Quantidade</th>
                <th className="px-6 py-4">Validade</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Entrada</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {product.batches.map((batch) => {
                const status = getExpiryStatus(batch.expirationDate);
                return (
                  <tr
                    key={batch.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-sm text-slate-600 dark:text-slate-400">
                      {batch.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800 dark:text-white">
                      {batch.quantity} {product.unit}s
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {formatDate(batch.expirationDate)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm">
                      {formatDate(batch.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteBatch(batch.id)}
                        disabled={loading}
                        className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                        title="Excluir Lote"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
