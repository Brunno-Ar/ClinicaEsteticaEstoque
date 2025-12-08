"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoginForm({
  className,
  onRegisterClick,
}: {
  className?: string;
  onRegisterClick?: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    // Demo/Mock Check
    if (email.includes("suporte@") || email.includes("admin@")) {
      // Allow standard flow
    }

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
      if (email.includes("suporte@") || email.includes("admin@saas")) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    }
  }

  return (
    <div className={cn("p-8 w-full", className)}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Bem-vindo de volta!
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Acesse sua conta para continuar.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-sm rounded-lg flex items-start">
          <span className="mr-2">⚠️</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
          <span>{loading ? "Entrando..." : "Entrar"}</span>
          <ArrowRight size={18} />
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Não tem uma conta?
          <button
            onClick={onRegisterClick}
            className="ml-2 text-teal-600 dark:text-teal-400 font-semibold hover:text-teal-700 dark:hover:text-teal-300 hover:underline bg-transparent border-none p-0 cursor-pointer"
          >
            Cadastre-se
          </button>
        </p>
      </div>
    </div>
  );
}
