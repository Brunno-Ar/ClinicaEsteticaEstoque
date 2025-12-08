"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { LoginForm } from "../auth/login-form";
import { RegisterForm } from "../auth/register-form";
import { Sparkles, Moon, Sun } from "lucide-react";

type AuthMode = "login" | "register";

export const AuthSwitch = ({
  defaultMode = "login",
}: {
  defaultMode?: AuthMode;
}) => {
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [theme, setTheme] = useState<"light" | "dark">("dark"); // Default to dark as per design preference

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
    // In a real app, this would use a ThemeProvider context
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center p-4 relative transition-colors duration-300",
        theme === "dark" ? "bg-slate-900" : "bg-slate-50"
      )}
    >
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-full bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white backdrop-blur-sm transition-all shadow-lg z-50"
        title="Alternar Tema"
      >
        {theme === "dark" ? <Moon size={24} /> : <Sun size={24} />}
      </button>

      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-teal-500/10 blur-3xl"></div>
        <div className="absolute bottom-[0%] right-[0%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-3xl"></div>
      </div>

      <div
        className={cn(
          "w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative z-10 animate-fade-in-up transition-all duration-300",
          theme === "dark" ? "bg-slate-800" : "bg-white"
        )}
      >
        {/* Header with Switcher Tabs */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-8 pb-0 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm shadow-inner">
              <Sparkles className="text-white w-8 h-8" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            EstéticaStock SaaS
          </h1>
          <p className="text-teal-100 text-sm mb-6">
            Gerencie sua clínica com inteligência.
          </p>

          {/* Tabs */}
          <div className="flex w-full bg-black/20 p-1 rounded-t-xl mt-4">
            <button
              onClick={() => setMode("login")}
              className={cn(
                "flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                mode === "login"
                  ? "bg-white text-teal-700 shadow-md transform scale-[1.02]"
                  : "text-teal-100 hover:bg-white/10"
              )}
            >
              Entrar
            </button>
            <button
              onClick={() => setMode("register")}
              className={cn(
                "flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                mode === "register"
                  ? "bg-white text-teal-700 shadow-md transform scale-[1.02]"
                  : "text-teal-100 hover:bg-white/10"
              )}
            >
              Criar Conta
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div
          className={cn(
            "transition-opacity duration-300",
            theme === "dark" ? "text-white" : "text-slate-900"
          )}
        >
          {mode === "login" ? (
            <LoginForm onRegisterClick={() => setMode("register")} />
          ) : (
            <RegisterForm onLoginClick={() => setMode("login")} />
          )}
        </div>

        {/* Footer */}
        <div
          className={cn(
            "p-4 text-center border-t",
            theme === "dark"
              ? "bg-slate-800 border-slate-700"
              : "bg-slate-50 border-slate-100"
          )}
        >
          <p className="text-xs text-slate-400">
            © 2024 EstéticaStock SaaS. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};
