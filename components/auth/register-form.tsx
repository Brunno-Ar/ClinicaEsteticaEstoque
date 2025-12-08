"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  User,
  Building2,
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function RegisterForm({
  className,
  onLoginClick,
}: {
  className?: string;
  onLoginClick?: () => void;
}) {
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
        setSuccess("Cadastro realizado! Redirecionando...");
        e.currentTarget.reset();
        setTimeout(() => {
          router.push("/payment-required");
        }, 1500);
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
    <div className={cn("p-8 w-full", className)}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Crie sua conta
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Comece a gerenciar sua clínica hoje.
        </p>
      </div>

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
            Responsável
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
            <input
              type="text"
              name="name"
              required
              placeholder="Dr. Nome"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
            Clínica
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
            <input
              type="text"
              name="clinicName"
              required
              placeholder="Nome da Clínica"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
            <input
              type="email"
              name="email"
              required
              placeholder="email@clinica.com"
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
          <span>{loading ? "Cadastrando..." : "Criar Conta"}</span>
          <ArrowRight size={18} />
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Já tem conta?
          <button
            onClick={onLoginClick}
            className="ml-2 text-teal-600 dark:text-teal-400 font-semibold hover:text-teal-700 dark:hover:text-teal-300 hover:underline bg-transparent border-none p-0 cursor-pointer"
          >
            Fazer login
          </button>
        </p>
      </div>
    </div>
  );
}
