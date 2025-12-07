import React, { useState } from 'react';
import { Tenant } from '../types';
import { Building2, DollarSign, CheckCircle, XCircle, Clock, TrendingUp, Search, CreditCard, AlertOctagon, X, User, Mail, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface SaaSAdminProps {
  view: 'saas_dashboard' | 'tenants';
  tenants: Tenant[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const SaaSAdmin: React.FC<SaaSAdminProps> = ({ view, tenants, onApprove, onReject }) => {
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const PLAN_PRICE = 299.90; // Single Plan Price

  const activeTenants = tenants.filter(t => t.status === 'ACTIVE');
  const pendingTenants = tenants.filter(t => t.status === 'PENDING');
  
  // Exclude the SaaS admin account itself from revenue calc if it's in the list
  const payingTenantsCount = activeTenants.filter(t => t.id !== 'admin-saas').length;
  const mrr = payingTenantsCount * PLAN_PRICE;

  // Mock Data for Growth Chart
  const growthData = [
    { name: 'Jan', active: 2, mrr: 2 * PLAN_PRICE },
    { name: 'Fev', active: 3, mrr: 3 * PLAN_PRICE },
    { name: 'Mar', active: 5, mrr: 5 * PLAN_PRICE },
    { name: 'Abr', active: payingTenantsCount, mrr: mrr },
  ];

  // --- MODAL DE GERENCIAMENTO ---
  const renderTenantModal = () => {
    if (!selectedTenant) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
        <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transform transition-all scale-100">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-start bg-slate-50 dark:bg-slate-900/50">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
                <Building2 className="mr-2 text-teal-600 dark:text-teal-400" />
                {selectedTenant.name}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">ID: {selectedTenant.id}</p>
            </div>
            <button 
              onClick={() => setSelectedTenant(null)}
              className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Dados do Responsável</h3>
              <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                <User className="text-slate-400" size={20} />
                <div>
                   <p className="text-xs text-slate-400">Nome</p>
                   <p className="font-medium text-slate-800 dark:text-white">{selectedTenant.ownerName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                <Mail className="text-slate-400" size={20} />
                <div>
                   <p className="text-xs text-slate-400">Email</p>
                   <p className="font-medium text-slate-800 dark:text-white">{selectedTenant.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Status Financeiro</h3>
              <div className={`p-4 rounded-lg border flex flex-col items-center justify-center text-center h-[120px] ${
                selectedTenant.status === 'SUSPENDED' 
                  ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800' 
                  : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
              }`}>
                {selectedTenant.paymentStatus === 'OVERDUE' ? (
                  <>
                    <AlertOctagon className="text-rose-500 mb-2" size={32} />
                    <span className="font-bold text-rose-700 dark:text-rose-400">Pagamento Atrasado</span>
                    <p className="text-xs text-rose-600/80 mt-1">Acesso Suspenso</p>
                  </>
                ) : (
                  <>
                    <CheckCircle className="text-emerald-500 mb-2" size={32} />
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">Em dia</span>
                    <p className="text-xs text-emerald-600/80 mt-1">Renova em 30 dias</p>
                  </>
                )}
              </div>
            </div>

             <div className="col-span-1 md:col-span-2 space-y-2 mt-2">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Ações Administrativas</h3>
                <div className="grid grid-cols-2 gap-4">
                   <button className="py-2 px-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                     Redefinir Senha
                   </button>
                   {selectedTenant.status === 'SUSPENDED' ? (
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
               <Calendar size={14} className="mr-1"/>
               Membro desde {new Date(selectedTenant.joinedDate).toLocaleDateString('pt-BR')}
             </div>
             <span>Plano {selectedTenant.plan}</span>
          </div>
        </div>
      </div>
    );
  };

  // --- VIEW: DASHBOARD (Overview) ---
  if (view === 'saas_dashboard') {
    return (
      <div className="space-y-8 animate-fade-in relative">
        {renderTenantModal()}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Visão Geral SaaS</h2>
          <p className="text-slate-500 dark:text-slate-400">Métricas principais e saúde do negócio.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">MRR (Receita Mensal)</p>
                <h3 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(mrr)}
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
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total de Clínicas Ativas</p>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{payingTenantsCount}</h3>
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
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Solicitações Pendentes</p>
                <h3 className="text-3xl font-bold text-amber-500 dark:text-amber-400 mt-2">{pendingTenants.length}</h3>
                <p className="text-xs text-slate-400 mt-2">Aguardando aprovação</p>
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
            <h3 className="font-semibold text-slate-800 dark:text-white mb-6">Crescimento de Receita</h3>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(value) => `R$${value}`} />
                <Tooltip 
                  formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#fff'}}
                />
                <Area type="monotone" dataKey="mrr" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorMrr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Pending List (Mini) */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors">
             <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex justify-between items-center">
               <span>Pendências Recentes</span>
               <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-full">{pendingTenants.length} novas</span>
             </h3>
             
             {pendingTenants.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                 <CheckCircle size={48} className="text-slate-200 dark:text-slate-700 mb-2" />
                 <p>Tudo em dia! Nenhuma solicitação pendente.</p>
               </div>
             ) : (
               <div className="space-y-4">
                 {pendingTenants.slice(0, 4).map(t => (
                   <div key={t.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-100 dark:border-slate-700">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{t.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{t.ownerName}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{t.email}</p>
                      </div>
                      <div className="flex space-x-2">
                         <button onClick={() => onApprove(t.id)} className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded hover:bg-emerald-200 dark:hover:bg-emerald-900/50"><CheckCircle size={18} /></button>
                         <button onClick={() => onReject(t.id)} className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded hover:bg-rose-200 dark:hover:bg-rose-900/50"><XCircle size={18} /></button>
                      </div>
                   </div>
                 ))}
                 {pendingTenants.length > 4 && (
                   <p className="text-center text-sm text-slate-500 mt-4">E mais {pendingTenants.length - 4} solicitações na aba Clínicas...</p>
                 )}
               </div>
             )}
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: TENANTS (List & Management) ---
  return (
    <div className="space-y-6 animate-fade-in relative">
      {renderTenantModal()}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Gestão de Clínicas</h2>
          <p className="text-slate-500 dark:text-slate-400">Gerencie o acesso e o status de todas as empresas cadastradas.</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center px-3 py-2 w-64 shadow-sm transition-colors">
          <Search size={18} className="text-slate-400 mr-2" />
          <input type="text" placeholder="Buscar clínica..." className="bg-transparent outline-none text-sm w-full text-slate-700 dark:text-slate-200" />
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
            {tenants.map(t => (
              <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800 dark:text-white">{t.name}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{t.ownerName}</div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                  {t.email}
                </td>
                <td className="px-6 py-4">
                  <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded text-xs font-bold border border-slate-200 dark:border-slate-600">
                    {t.plan}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col items-start">
                    {t.status === 'SUSPENDED' && t.paymentStatus === 'OVERDUE' ? (
                      <div className="flex flex-col space-y-1">
                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 w-fit">
                           Suspenso
                         </span>
                         <div className="flex items-center text-rose-600 dark:text-rose-400 font-bold text-xs bg-white dark:bg-slate-900 px-2 py-1 rounded border border-rose-100 dark:border-rose-900/50 shadow-sm w-fit">
                            <div className="relative mr-1.5">
                              <CreditCard size={14} />
                              <div className="absolute -top-1 -right-1 bg-rose-600 rounded-full p-[1px] border border-white dark:border-slate-900">
                                <X size={8} className="text-white" strokeWidth={3} />
                              </div>
                            </div>
                            <span>Pagto. Atrasado</span>
                         </div>
                      </div>
                    ) : (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${t.status === 'ACTIVE' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300' : 
                          t.status === 'PENDING' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300'}`}>
                        {t.status === 'ACTIVE' ? 'Ativo' : t.status === 'PENDING' ? 'Pendente' : 'Suspenso'}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                  {new Date(t.joinedDate).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 text-right">
                  {t.status === 'PENDING' ? (
                    <div className="flex justify-end space-x-2">
                       <button 
                        onClick={() => onApprove(t.id)}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-medium transition-colors shadow-sm"
                       >
                         <CheckCircle size={14} /> <span>Aprovar</span>
                       </button>
                       <button 
                        onClick={() => onReject(t.id)}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-white dark:bg-slate-700 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-md text-xs font-medium transition-colors"
                       >
                         <XCircle size={14} /> <span>Rejeitar</span>
                       </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setSelectedTenant(t)}
                      className="text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 text-xs font-medium transition-colors"
                    >
                      Gerenciar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};