import { db } from "@/lib/db";
import { getTenantId } from "@/lib/get-tenant";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function LotesPage() {
  const tenantId = await getTenantId();

  const batches = await db.batch.findMany({
    where: { tenantId },
    include: { product: true },
    orderBy: { expirationDate: "asc" },
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
  };

  const getDaysUntilExpiry = (date: Date) => {
    const now = new Date();
    const expDate = new Date(date);
    const diffTime = expDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (days: number) => {
    if (days < 0)
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    if (days <= 30)
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
    if (days <= 60)
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
  };

  const getStatusText = (days: number) => {
    if (days < 0) return "Vencido";
    if (days <= 30) return "Crítico";
    if (days <= 60) return "Atenção";
    return "OK";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Lotes
        </h1>
        <Link
          href="/dashboard/lotes/novo"
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          Novo Lote
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
                  Quantidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Validade
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {batches.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
                  >
                    Nenhum lote cadastrado. Adicione produtos e seus lotes.
                  </td>
                </tr>
              ) : (
                batches.map((batch) => {
                  const days = getDaysUntilExpiry(batch.expirationDate);
                  return (
                    <tr
                      key={batch.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 dark:text-white">
                          {batch.product.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-semibold">
                        {batch.quantity} un
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {formatDate(batch.expirationDate)}
                        <span className="text-xs text-slate-400 ml-2">
                          ({days >= 0 ? `${days}d` : `${Math.abs(days)}d atrás`}
                          )
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            days
                          )}`}
                        >
                          {getStatusText(days)}
                        </span>
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
