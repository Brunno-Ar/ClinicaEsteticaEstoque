import React, { useState } from 'react';
import { Sparkles, Send, X } from 'lucide-react';
import { Product } from '../types';
import { analyzeStockWithAI } from '../services/geminiService';

interface AssistantProps {
  inventory: Product[];
}

export const Assistant: React.FC<AssistantProps> = ({ inventory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResponse(null);
    const result = await analyzeStockWithAI(inventory, query);
    setResponse(result);
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-teal-500 to-emerald-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 z-50 flex items-center space-x-2"
      >
        <Sparkles size={24} />
        <span className="font-medium pr-2">IA Assistente</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden animate-fade-in-up">
      <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
        <div className="flex items-center space-x-2">
          <Sparkles size={18} className="text-teal-400" />
          <h3 className="font-semibold">Estética AI Analyst</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
          <X size={18} />
        </button>
      </div>

      <div className="p-4 h-80 overflow-y-auto bg-slate-50 flex flex-col space-y-4">
        <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm border border-slate-100 text-sm text-slate-700 self-start max-w-[90%]">
          Olá! Sou sua IA de estoque. Pergunte sobre produtos vencendo, sugestões de compras ou análise de valor.
        </div>
        
        {response && (
           <div className="bg-teal-50 p-3 rounded-lg rounded-tl-none shadow-sm border border-teal-100 text-sm text-slate-800 self-start max-w-[90%] animate-pulse-once">
             {response.split('\n').map((line, i) => <p key={i} className="mb-1">{line}</p>)}
           </div>
        )}

        {loading && (
          <div className="flex items-center space-x-2 text-slate-400 text-xs self-start ml-2">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75" />
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150" />
            <span>Analisando estoque...</span>
          </div>
        )}
      </div>

      <div className="p-3 bg-white border-t border-slate-200">
        <div className="flex items-center bg-slate-100 rounded-full px-4 py-2">
          <input 
            type="text"
            className="bg-transparent flex-1 outline-none text-sm text-slate-700 placeholder-slate-400"
            placeholder="Ex: Quais lotes vencem esse mês?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          />
          <button 
            onClick={handleAsk}
            disabled={loading || !query}
            className="ml-2 text-teal-600 hover:text-teal-700 disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};