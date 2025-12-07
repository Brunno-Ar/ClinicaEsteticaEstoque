"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  User,
  Building2,
  Mail,
  Lock,
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
} from "lucide-react";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          clinicName: formData.get("clinicName"),
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(
          "Cadastro realizado com sucesso! Sua conta está aguardando aprovação do administrador."
        );
        // Clear form
        e.currentTarget.reset();
      } else {
        setError(data.error || "Erro ao cadastrar");
      }
    } catch (err) {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative transition-colors duration-300">
      {/* Theme Selector - Top Right */}
      <button
        className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all shadow-lg z-50"
        title="Alternar Tema"
      >
        <Moon size={24} />
      </button>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-teal-500/10 blur-3xl"></div>
        <div className="absolute bottom-[0%] right-[0%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-3xl"></div>
      </div>

      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative z-10 animate-fade-in-up transition-colors duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Sparkles className="text-white w-8 h-8" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            EstéticaStock SaaS
          </h1>
          <p className="text-teal-100 text-sm">
            Junte-se às melhores clínicas.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-3 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-sm rounded-lg flex items-start">
              <span className="mr-2">⚠️</span> {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-3 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-sm rounded-lg flex items-start">
              <span className="mr-2">✅</span> {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Nome do Responsável
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Dr. João Silva"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-white placeholder-slate-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Nome da Clínica
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  name="clinicName"
                  required
                  placeholder="Clínica Estética..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-white placeholder-slate-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Email Corporativo
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="contato@clinica.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-white placeholder-slate-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-white placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-600/50 text-white font-bold py-3 rounded-lg shadow-lg shadow-teal-500/30 transition-all active:scale-95 flex items-center justify-center space-x-2"
            >
              <span>{loading ? "Cadastrando..." : "Solicitar Acesso"}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Já possui cadastro?
              <Link
                href="/login"
                className="ml-2 text-teal-600 dark:text-teal-400 font-semibold hover:text-teal-700 dark:hover:text-teal-300 hover:underline"
              >
                Fazer Login
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 dark:bg-slate-800 p-4 text-center border-t border-slate-100 dark:border-slate-700">
          <p className="text-xs text-slate-400">
            © 2024 EstéticaStock SaaS. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
