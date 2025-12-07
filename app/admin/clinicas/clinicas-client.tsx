"use client";

import { useState } from "react";
import {
  Building2,
  Search,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Calendar,
  X,
  CreditCard,
  AlertOctagon,
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

export function ClinicasClient({ tenants }: { tenants: Tenant[] }) {
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTenants = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.users[0]?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
  };

  const handleApprove = async (tenantId: string) => {
    await fetch(`/api/admin/tenants/${tenantId}/approve`, { method: "POST" });
    window.location.reload();
  };

  const handleReject = async (tenantId: string) => {
    if (confirm("Tem certeza que deseja rejeitar esta clínica?")) {
      await fetch(`/api/admin/tenants/${tenantId}/reject`, { method: "POST" });
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Modal */}
      {selectedTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-start bg-slate-50 dark:bg-slate-900/50">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
                  <Building2 className="mr-2 text-teal-600 dark:text-teal-400" />
                  {selectedTenant.name}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  ID: {selectedTenant.slug}
                </p>
              </div>
              <button
                onClick={() => setSelectedTenant(null)}
                className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Dados do Responsável
                </h3>
                <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                  <User className="text-slate-400" size={20} />
                  <div>
                    <p className="text-xs text-slate-400">Nome</p>
                    <p className="font-medium text-slate-800 dark:text-white">
                      {selectedTenant.users[0]?.name || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                  <Mail className="text-slate-400" size={20} />
                  <div>
                    <p className="text-xs text-slate-400">Email</p>
                    <p className="font-medium text-slate-800 dark:text-white">
                      {selectedTenant.users[0]?.email || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Status Financeiro
                </h3>
                <div
                  className={`p-4 rounded-lg border flex flex-col items-center justify-center text-center h-[120px] ${
                    selectedTenant.subscriptionStatus === "SUSPENDED"
                      ? "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800"
                      : "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
                  }`}
                >
                  {selectedTenant.subscriptionStatus === "SUSPENDED" ? (
                    <>
                      <AlertOctagon className="text-rose-500 mb-2" size={32} />
                      <span className="font-bold text-rose-700 dark:text-rose-400">
                        Suspenso
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle
                        className="text-emerald-500 mb-2"
                        size={32}
                      />
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">
                        Em dia
                      </span>
                      <p className="text-xs text-emerald-600/80 mt-1">
                        Renova em 30 dias
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 space-y-2 mt-2">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Ações Administrativas
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <button className="py-2 px-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                    Redefinir Senha
                  </button>
                  {selectedTenant.subscriptionStatus === "SUSPENDED" ? (
                    <button className="py-2 px-4 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm">
                      Reativar Acesso
                    </button>
                  ) : (
                    <button className="py-2 px-4 bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 rounded-lg font-medium hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors">
                      Suspender Acesso
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs text-slate-500">
              <div className="flex items-center">
                <Calendar size={14} className="mr-1" />
                Membro desde {formatDate(selectedTenant.createdAt)}
              </div>
              <span>Plano PRO</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Gestão de Clínicas
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Gerencie o acesso e o status de todas as empresas cadastradas.
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center px-3 py-2 w-64 shadow-sm transition-colors">
          <Search size={18} className="text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Buscar clínica..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none text-sm w-full text-slate-700 dark:text-slate-200"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-xs uppercase border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-4 font-semibold">Clínica / Responsável</th>
              <th className="px-6 py-4 font-semibold">Contato</th>
              <th className="px-6 py-4 font-semibold">Plano</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Cadastro</th>
              <th className="px-6 py-4 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {filteredTenants.map((tenant) => {
              const owner = tenant.users[0];
              return (
                <tr
                  key={tenant.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 dark:text-white">
                      {tenant.name}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {owner?.name || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {owner?.email || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded text-xs font-bold border border-slate-200 dark:border-slate-600">
                      PRO
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        tenant.subscriptionStatus === "ACTIVE"
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300"
                          : tenant.subscriptionStatus === "PENDING"
                          ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300"
                          : "bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300"
                      }`}
                    >
                      {tenant.subscriptionStatus === "ACTIVE"
                        ? "Ativo"
                        : tenant.subscriptionStatus === "PENDING"
                        ? "Pendente"
                        : "Suspenso"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                    {formatDate(tenant.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {tenant.subscriptionStatus === "PENDING" ? (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleApprove(tenant.id)}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-medium transition-colors shadow-sm"
                        >
                          <CheckCircle size={14} /> <span>Aprovar</span>
                        </button>
                        <button
                          onClick={() => handleReject(tenant.id)}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-white dark:bg-slate-700 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-md text-xs font-medium transition-colors"
                        >
                          <XCircle size={14} /> <span>Rejeitar</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedTenant(tenant)}
                        className="text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 text-xs font-medium transition-colors"
                      >
                        Gerenciar
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
