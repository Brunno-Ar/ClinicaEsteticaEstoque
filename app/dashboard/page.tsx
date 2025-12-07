import { db } from "@/lib/db";
import { getTenantId } from "@/lib/get-tenant";
import { DollarSign, TrendingDown, AlertTriangle, Package } from "lucide-react";

export default async function DashboardPage() {
  const tenantId = await getTenantId();

  const products = await db.product.findMany({
    where: { tenantId },
    include: { batches: true },
  });

  // Calculate Stats
  const totalValue = products.reduce((acc, p) => {
    const totalQty = p.batches.reduce((bAcc, b) => bAcc + b.quantity, 0);
    return acc + Number(p.price) * totalQty;
  }, 0);

  const lowStockCount = products.filter((p) => {
    const totalQty = p.batches.reduce((acc, b) => acc + b.quantity, 0);
    return totalQty <= p.minStockLevel;
  }).length;

  const now = new Date();
  const sixtyDays = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

  const expiringBatches = products
    .flatMap((p) => p.batches)
    .filter((b) => {
      const expDate = new Date(b.expirationDate);
      return expDate >= now && expDate <= sixtyDays;
    }).length;

  const expiredBatches = products
    .flatMap((p) => p.batches)
    .filter((b) => {
      return new Date(b.expirationDate) < now;
    }).length;

  const totalBatches = products.reduce((acc, p) => acc + p.batches.length, 0);

  // Category Data for Charts
  const categoryData = products.reduce(
    (acc: { name: string; value: number }[], curr) => {
      const existing = acc.find((i) => i.name === curr.category);
      const value =
        Number(curr.price) *
        curr.batches.reduce((sum, b) => sum + b.quantity, 0);
      if (existing) {
        existing.value += value;
      } else if (value > 0) {
        acc.push({ name: curr.category, value });
      }
      return acc;
    },
    []
  );

  const totalCategoryValue = categoryData.reduce((acc, c) => acc + c.value, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const COLORS = ["#0d9488", "#14b8a6", "#2dd4bf", "#5eead4", "#99f6e4"];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Valor Total em Estoque
              </p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                {formatCurrency(totalValue)}
              </h3>
            </div>
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Produtos Baixo Estoque
              </p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                {lowStockCount}
              </h3>
            </div>
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full">
              <TrendingDown size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Lotes Vencendo (60d)
              </p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                {expiringBatches}
              </h3>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Total de Lotes
              </p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                {totalBatches}
              </h3>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
              <Package size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Alert for expired batches */}
      {expiredBatches > 0 && (
        <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 p-4 rounded-lg flex items-center text-rose-800 dark:text-rose-300">
          <AlertTriangle className="mr-3" />
          <span className="font-semibold">
            Atenção: Você possui {expiredBatches} lote(s) vencido(s). Verifique
            seu estoque imediatamente para descarte seguro.
          </span>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Value by Category */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-96 transition-colors flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
            Valor por Categoria
          </h3>
          <div className="flex-1 flex items-end justify-between px-4 gap-4">
            {categoryData.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                Nenhum produto cadastrado
              </div>
            ) : (
              categoryData.map((item, index) => {
                const maxValue = Math.max(...categoryData.map((c) => c.value));
                const height = maxValue > 0 ? (item.value / maxValue) * 250 : 0;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1"
                  >
                    <div
                      className="w-full rounded-t-lg transition-all"
                      style={{
                        height: `${height}px`,
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
                    <span className="text-xs text-slate-500 mt-2 truncate w-full text-center">
                      {item.name}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Pie Chart - Distribution */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-96 transition-colors flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
            Distribuição do Estoque (Valor)
          </h3>
          <div className="flex items-center h-full">
            {categoryData.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                Nenhum produto cadastrado
              </div>
            ) : (
              <>
                {/* Simple Donut Chart via CSS */}
                <div className="flex-1 flex items-center justify-center">
                  <div
                    className="relative w-40 h-40 rounded-full"
                    style={{
                      background: `conic-gradient(${categoryData
                        .map((item, i) => {
                          const start = categoryData
                            .slice(0, i)
                            .reduce(
                              (acc, c) =>
                                acc + (c.value / totalCategoryValue) * 100,
                              0
                            );
                          const end =
                            start + (item.value / totalCategoryValue) * 100;
                          return `${
                            COLORS[i % COLORS.length]
                          } ${start}% ${end}%`;
                        })
                        .join(", ")})`,
                    }}
                  >
                    <div className="absolute inset-6 bg-white dark:bg-slate-800 rounded-full" />
                  </div>
                </div>

                {/* Legend */}
                <div className="w-48 pl-4 space-y-3 overflow-y-auto max-h-full">
                  {categoryData.map((entry, index) => (
                    <div key={index} className="flex items-start">
                      <div
                        className="w-3 h-3 rounded-full mt-1.5 mr-2 flex-shrink-0"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          {entry.name}
                        </p>
                        <p className="text-sm font-bold text-slate-800 dark:text-white">
                          {formatCurrency(entry.value)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
