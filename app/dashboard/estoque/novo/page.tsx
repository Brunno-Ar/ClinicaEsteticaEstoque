"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

const CATEGORIES = [
  "Toxinas",
  "Preenchedores",
  "Bioestimuladores",
  "Descartáveis",
  "Geral",
];

export default function NovoProdutoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          description: formData.get("description"),
          price: formData.get("price")
            ? parseFloat(formData.get("price") as string)
            : 0,
          sku: formData.get("sku") || null,
          category: formData.get("category"),
          unit: formData.get("unit"),
          minStockLevel: parseInt(formData.get("minStockLevel") as string) || 5,
          // Batch info
          lotCode: formData.get("lotCode") || null,
          quantity: formData.get("quantity")
            ? parseInt(formData.get("quantity") as string)
            : 0,
          expirationDate: formData.get("expirationDate") || null,
          totalCost: formData.get("totalCost")
            ? parseFloat(formData.get("totalCost") as string)
            : null,
          unitCost: formData.get("unitCost")
            ? parseFloat(formData.get("unitCost") as string)
            : null,
        }),
      });

      if (response.ok) {
        router.push("/dashboard/estoque");
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.error || "Erro ao criar produto");
      }
    } catch (err) {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/estoque"
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-slate-600 dark:text-slate-300" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Novo Produto
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Nome do Produto *
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Ex: Toxina Botulínica Tipo A"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              SKU
            </label>
            <input
              type="text"
              name="sku"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Ex: TOX-001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Categoria *
            </label>
            <select
              name="category"
              required
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Price field removed as per user request */}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Unidade
            </label>
            <select
              name="unit"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="frasco">Frasco</option>
              <option value="seringa">Seringa</option>
              <option value="caixa">Caixa</option>
              <option value="unidade">Unidade</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Estoque Mínimo
            </label>
            <input
              type="number"
              name="minStockLevel"
              min="0"
              defaultValue={5}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Descrição
            </label>
            <textarea
              name="description"
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Descrição do produto..."
            />
          </div>

          <div className="md:col-span-2 border-t border-slate-200 dark:border-slate-700 pt-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
              Informações do Primeiro Lote
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Número do Lote
                </label>
                <input
                  type="text"
                  name="lotCode"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Ex: LOTE123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Quantidade Inicial
                </label>
                <input
                  type="number"
                  name="quantity"
                  min="0"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="0"
                  onChange={(e) => {
                    const qty = parseFloat(e.target.value);
                    const totalInput = document.querySelector(
                      'input[name="totalCost"]'
                    ) as HTMLInputElement;
                    const unitInput = document.querySelector(
                      'input[name="unitCost"]'
                    ) as HTMLInputElement;

                    if (totalInput.value && qty > 0) {
                      unitInput.value = (
                        parseFloat(totalInput.value) / qty
                      ).toFixed(2);
                    }
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Validade
                </label>
                <input
                  type="date"
                  name="expirationDate"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Custo Total do Lote (R$)
                </label>
                <input
                  type="number"
                  name="totalCost"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="0.00"
                  onChange={(e) => {
                    const total = parseFloat(e.target.value);
                    const qtyInput = document.querySelector(
                      'input[name="quantity"]'
                    ) as HTMLInputElement;
                    const unitInput = document.querySelector(
                      'input[name="unitCost"]'
                    ) as HTMLInputElement;

                    const qty = parseFloat(qtyInput.value);
                    if (qty > 0 && !isNaN(total)) {
                      unitInput.value = (total / qty).toFixed(2);
                    }
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Custo por Unidade (R$)
                </label>
                <input
                  type="number"
                  name="unitCost"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="0.00"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Calculado automaticamente (pode ser ajustado)
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Link
            href="/dashboard/estoque"
            className="px-6 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-600/50 text-white rounded-lg font-medium transition-colors"
          >
            <Save size={20} />
            {loading ? "Salvando..." : "Salvar Produto"}
          </button>
        </div>
      </form>
    </div>
  );
}
