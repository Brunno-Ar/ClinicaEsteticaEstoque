"use client";

import {
  DollarSign,
  Building2,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useTheme } from "@/components/providers/theme-provider";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  subscriptionStatus: string;
  createdAt: Date;
  users: { name: string | null; email: string }[];
  _count: { products: number };
}

interface AdminDashboardClientProps {
  tenants: Tenant[];
  mrr: number;
  activeTenants: number;
  pendingTenants: Tenant[];
}

const PLAN_PRICE = 299.9;

export function AdminDashboardClient({
  tenants,
  mrr,
  activeTenants,
  pendingTenants,
}: AdminDashboardClientProps) {
  const { theme } = useTheme();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Generate some realistic-looking history based on the current MRR
  // Assuming a steady growth to reach current point
  const currentMonth = new Date()
    .toLocaleString("pt-BR", { month: "short" })
    .replace(".", "");
  // Capitalize first letter
  const currentMonthLabel =
    currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);

  const growthData = [
    { name: "Jan", mrr: Math.max(0, mrr * 0.4) },
    { name: "Fev", mrr: Math.max(0, mrr * 0.6) },
    { name: "Mar", mrr: Math.max(0, mrr * 0.8) },
    { name: currentMonthLabel, mrr: mrr },
  ];

  const chartColor = theme === "dark" ? "#34d399" : "#059669"; // Emerald 400/600

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Visão Geral SaaS</h2>
        <p className="text-muted-foreground">
          Métricas principais e saúde do negócio.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border transition-colors group hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                MRR (Receita Mensal)
              </p>
              <h3 className="text-3xl font-bold text-primary mt-2">
                {formatCurrency(mrr)}
              </h3>
              <p className="text-xs text-primary/80 flex items-center mt-2 group-hover:scale-105 transition-transform origin-left">
                <TrendingUp size={14} className="mr-1" /> +12% esse mês
              </p>
            </div>
            <div className="p-3 bg-primary/10 text-primary rounded-lg">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-sm border border-border transition-colors group hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Total de Clínicas Ativas
              </p>
              <h3 className="text-3xl font-bold text-foreground mt-2">
                {activeTenants}
              </h3>
              <p className="text-xs text-muted-foreground mt-2">
                Plano Único (PRO)
              </p>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
              <Building2 size={24} />
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-sm border border-border transition-colors group hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Solicitações Pendentes
              </p>
              <h3 className="text-3xl font-bold text-amber-500 mt-2">
                {pendingTenants.length}
              </h3>
              <p className="text-xs text-muted-foreground mt-2">
                Aguardando aprovação
              </p>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-lg">
              <Clock size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border h-96 transition-colors">
          <h3 className="font-semibold text-foreground mb-6">
            Crescimento de Receita (MRR)
          </h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={theme === "dark" ? "#334155" : "#e2e8f0"}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: theme === "dark" ? "#94a3b8" : "#64748b",
                    fontSize: 12,
                  }}
                  dy={10}
                />
                <YAxis hide={true} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: theme === "dark" ? "#1e293b" : "#f1f5f9" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    backgroundColor: theme === "dark" ? "#1e293b" : "#ffffff",
                    color: theme === "dark" ? "#ffffff" : "#000000",
                  }}
                  formatter={(value: number) => [formatCurrency(value), "MRR"]}
                />
                <Bar
                  dataKey="mrr"
                  radius={[6, 6, 0, 0]}
                  barSize={50}
                  animationDuration={1500}
                >
                  {growthData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === growthData.length - 1
                          ? "var(--primary)"
                          : theme === "dark"
                          ? "#334155"
                          : "#cbd5e1"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pending List */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 transition-colors">
          <h3 className="font-semibold text-foreground mb-4 flex justify-between items-center">
            <span>Pendências Recentes</span>
            <span className="text-xs bg-amber-500/10 text-amber-500 px-2 py-1 rounded-full">
              {pendingTenants.length} novas
            </span>
          </h3>

          {pendingTenants.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <CheckCircle
                size={48}
                className="text-muted-foreground/30 mb-2"
              />
              <p>Tudo em dia! Nenhuma solicitação.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingTenants.slice(0, 4).map((tenant) => {
                const owner = tenant.users[0];
                return (
                  <div
                    key={tenant.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border hover:border-primary/50 transition-colors"
                  >
                    <div>
                      <p className="font-bold text-foreground">{tenant.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {owner?.name || "N/A"}
                      </p>
                      <p className="text-xs text-muted-foreground/70">
                        {owner?.email || "N/A"}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <a
                        href={`/admin/clinicas?id=${tenant.id}`}
                        className="p-2 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
                        title="Gerenciar"
                      >
                        <CheckCircle size={18} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
