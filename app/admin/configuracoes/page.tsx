"use client";

import { useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ConfiguracoesPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Configurações
        </h1>
      </div>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
        <h3 className="text-lg font-bold mb-6 text-slate-800 dark:text-slate-100">
          Configurações Globais SaaS
        </h3>

        <div className="mb-8">
          <h4 className="text-sm font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-4">
            Aparência
          </h4>
          <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm text-slate-700 dark:text-slate-300">
                {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  Tema do Sistema
                </p>
                <p className="text-sm text-teal-600 dark:text-teal-400">
                  Alternar entre modo claro e escuro
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                theme === "dark" ? "bg-teal-600" : "bg-slate-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
                  theme === "dark" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
