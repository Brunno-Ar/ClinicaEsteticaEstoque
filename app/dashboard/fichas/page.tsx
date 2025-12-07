import { Layers } from "lucide-react";

export default function FichasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Painel
        </h1>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-16 flex flex-col items-center justify-center min-h-[400px]">
        <Layers size={64} className="text-slate-300 dark:text-slate-600 mb-4" />
        <p className="text-slate-500 dark:text-slate-400 text-center">
          Módulo de Fichas Técnicas em desenvolvimento.
        </p>
      </div>
    </div>
  );
}
