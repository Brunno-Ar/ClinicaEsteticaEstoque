"use client";

import { db } from "@/lib/db";
import {
  DollarSign,
  Building2,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
} from "lucide-react";

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
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Mock Growth Chart Data
  const growthData = [
    { name: "Jan", mrr: 2 * PLAN_PRICE },
    { name: "Fev", mrr: 3 * PLAN_PRICE },
    { name: "Mar", mrr: 5 * PLAN_PRICE },
    { name: "Abr", mrr: mrr },
  ];

  const maxMrr = Math.max(...growthData.map((d) => d.mrr));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          Visão Geral SaaS
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Métricas principais e saúde do negócio.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                MRR (Receita Mensal)
              </p>
              <h3 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                {formatCurrency(mrr)}
              </h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center mt-2">
                <TrendingUp size={14} className="mr-1" /> +12% esse mês
              </p>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Total de Clínicas Ativas
              </p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {activeTenants}
              </h3>
              <p className="text-xs text-slate-400 mt-2">Plano Único (PRO)</p>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Building2 size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Solicitações Pendentes
              </p>
              <h3 className="text-3xl font-bold text-amber-500 dark:text-amber-400 mt-2">
                {pendingTenants.length}
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                Aguardando aprovação
              </p>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400 rounded-lg">
              <Clock size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-96 transition-colors">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-6">
            Crescimento de Receita
          </h3>
          <div className="h-64 flex items-end justify-between px-4 gap-8">
            {growthData.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-gradient-to-t from-teal-600 to-emerald-400 rounded-t-lg transition-all"
                  style={{ height: `${(item.mrr / maxMrr) * 200}px` }}
                />
                <span className="text-sm text-slate-500 mt-2">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending List */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex justify-between items-center">
            <span>Pendências Recentes</span>
            <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-full">
              {pendingTenants.length} novas
            </span>
          </h3>

          {pendingTenants.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <CheckCircle
                size={48}
                className="text-slate-200 dark:text-slate-700 mb-2"
              />
              <p>Tudo em dia! Nenhuma solicitação pendente.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingTenants.slice(0, 4).map((tenant) => {
                const owner = tenant.users[0];
                return (
                  <div
                    key={tenant.id}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-100 dark:border-slate-700"
                  >
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        {tenant.name}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {owner?.name || "N/A"}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {owner?.email || "N/A"}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded hover:bg-emerald-200 dark:hover:bg-emerald-900/50">
                        <CheckCircle size={18} />
                      </button>
                      <button className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded hover:bg-rose-200 dark:hover:bg-rose-900/50">
                        <XCircle size={18} />
                      </button>
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
