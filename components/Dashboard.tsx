import React from 'react';
import { Product } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { AlertTriangle, TrendingDown, Package, DollarSign } from 'lucide-react';

interface DashboardProps {
  products: Product[];
}

// Tooltip personalizado para garantir legibilidade em ambos os temas
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50">
        <p className="font-semibold text-slate-800 dark:text-white text-sm mb-1">{label || payload[0].name}</p>
        <p className="text-teal-600 dark:text-teal-400 font-bold text-sm">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export const Dashboard: React.FC<DashboardProps> = ({ products }) => {
  // Calculate Stats
  const totalValue = products.reduce((acc, p) => acc + (p.price * p.batches.reduce((bAcc, b) => bAcc + b.quantity, 0)), 0);
  const lowStockCount = products.filter(p => {
    const totalQty = p.batches.reduce((acc, b) => acc + b.quantity, 0);
    return totalQty <= p.minStockLevel;
  }).length;
  
  const expiringBatches = products.flatMap(p => p.batches).filter(b => {
    const days = Math.ceil((new Date(b.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    return days <= 60 && days >= 0;
  }).length;

  const expiredBatches = products.flatMap(p => p.batches).filter(b => {
     return new Date(b.expiryDate) < new Date();
  }).length;

  // Chart Data: Value by Category
  const categoryData = products.reduce((acc: any[], curr) => {
    const existing = acc.find(i => i.name === curr.category);
    const value = curr.price * curr.batches.reduce((sum, b) => sum + b.quantity, 0);
    if (existing) {
      existing.value += value;
    } else {
      acc.push({ name: curr.category, value });
    }
    return acc;
  }, []);

  const COLORS = ['#0d9488', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4'];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Valor Total em Estoque</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
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
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Produtos Baixo Estoque</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{lowStockCount}</h3>
            </div>
             <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full">
              <TrendingDown size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Lotes Vencendo (60d)</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{expiringBatches}</h3>
            </div>
             <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>

         <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total de Lotes</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                {products.reduce((acc, p) => acc + p.batches.length, 0)}
              </h3>
            </div>
             <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
              <Package size={24} />
            </div>
          </div>
        </div>
      </div>

      {expiredBatches > 0 && (
         <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 p-4 rounded-lg flex items-center text-rose-800 dark:text-rose-300">
            <AlertTriangle className="mr-3" />
            <span className="font-semibold">Atenção: Você possui {expiredBatches} lote(s) vencido(s). Verifique seu estoque imediatamente para descarte seguro.</span>
         </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-96 transition-colors flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Valor por Categoria</h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: 'currentColor' }}
                  className="text-slate-500 dark:text-slate-400"
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `R$${value/1000}k`}
                  tick={{ fill: 'currentColor' }}
                  className="text-slate-500 dark:text-slate-400"
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

         <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-96 transition-colors flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Distribuição do Estoque (Valor)</h3>
          <div className="flex items-center h-full">
            {/* Chart */}
            <div className="flex-1 h-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData} 
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Custom Legend - Much more readable than SVG Legend */}
            <div className="w-48 pl-4 space-y-3 overflow-y-auto max-h-full custom-scrollbar">
              {categoryData.map((entry, index) => (
                <div key={index} className="flex items-start">
                  <div 
                    className="w-3 h-3 rounded-full mt-1.5 mr-2 flex-shrink-0" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{entry.name}</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(entry.value)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};