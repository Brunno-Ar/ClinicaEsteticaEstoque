"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
} from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    const result = await signIn("credentials", {
      email: email,
      password: formData.get("password") as string,
      redirect: false,
    });

    if (result?.error) {
      setError("Email ou senha inválidos");
      setLoading(false);
    } else {
      // Check if super admin
      if (
        email.includes("suporte@") ||
        email.includes("admin@saas") ||
        email.includes("@esteticastock")
      ) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    }
  }

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative transition-colors duration-300">
      {/* Theme Selector - Top Right */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all shadow-lg z-50"
        title="Alternar Tema"
      >
        {theme === "dark" ? <Moon size={24} /> : <Sun size={24} />}
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
            Gerencie sua clínica com inteligência.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-3 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-sm rounded-lg flex items-start">
              <span className="mr-2">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <span>{loading ? "Entrando..." : "Entrar no Sistema"}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Não tem uma conta?
              <Link
                href="/register"
                className="ml-2 text-teal-600 dark:text-teal-400 font-semibold hover:text-teal-700 dark:hover:text-teal-300 hover:underline"
              >
                Cadastre sua clínica
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
