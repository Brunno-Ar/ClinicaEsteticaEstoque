import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Sparkles className="text-teal-500 w-8 h-8" />
          <span className="text-xl font-bold text-white">EstéticaStock</span>
        </div>
        <div className="flex space-x-4">
          <Link
            href="/login"
            className="text-slate-300 hover:text-white transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Começar Grátis
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-3xl">
          <h1 className="text-5xl font-bold text-white mb-6">
            Gestão de Estoque para
            <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
              {" "}
              Clínicas Estéticas
            </span>
          </h1>
          <p className="text-xl text-slate-400 mb-8">
            Controle seus produtos, lotes e validades com inteligência. Sistema
            completo para clínicas de estética.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/register"
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors"
            >
              Começar Agora
            </Link>
            <Link
              href="/login"
              className="border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 px-8 py-4 rounded-lg font-medium transition-colors"
            >
              Já tenho conta
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-slate-500 text-sm">
        © 2024 EstéticaStock SaaS. Todos os direitos reservados.
      </footer>
    </div>
  );
}
