import { db } from "@/lib/db";
import { getTenantId } from "@/lib/get-tenant";
import { Plus } from "lucide-react";
import Link from "next/link";
import { DeleteProductButton } from "./delete-button";

export default async function ProdutosPage() {
  const tenantId = await getTenantId();

  const products = await db.product.findMany({
    where: { tenantId },
    include: { batches: true },
    orderBy: { createdAt: "desc" },
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Produtos
        </h1>
        <Link
          href="/dashboard/produtos/novo"
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          Novo Produto
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Produto
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Preço
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Estoque
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Lotes
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
                  >
                    Nenhum produto cadastrado. Clique em "Novo Produto" para
                    começar.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const totalQty = product.batches.reduce(
                    (acc, b) => acc + b.quantity,
                    0
                  );
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 dark:text-white">
                          {product.name}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {product.description || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {formatCurrency(Number(product.price))}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`font-semibold ${
                            totalQty === 0
                              ? "text-red-500"
                              : "text-slate-900 dark:text-white"
                          }`}
                        >
                          {totalQty} un
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {product.batches.length}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Link
                          href={`/dashboard/produtos/${product.id}`}
                          className="inline-flex px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded transition-colors"
                        >
                          Editar
                        </Link>
                        <DeleteProductButton
                          productId={product.id}
                          productName={product.name}
                        />
                      </td>
                    </tr>
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
