"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Building2, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/theme-provider";

// Social Icons
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#1877F2]">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#1DA1F2]">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#0A66C2]">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default function AuthSwitch() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  // Sign In Handler
  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    const result = await signIn("credentials", {
      email,
      password: formData.get("password") as string,
      redirect: false,
    });

    console.log("Resultado do Login:", result);

    if (result?.error) {
      console.error("Erro no login:", result.error);
      setError("Email ou senha inválidos");
      setLoading(false);
    } else {
      if (
        email.includes("suporte@") ||
        email.includes("@esteticastock") ||
        email === "brunnoaraujoc@gmail.com"
      ) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    }
  }

  // Sign Up Handler
  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

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

      let data;
      const text = await response.text();

      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("Resposta não-JSON do servidor:", text);
        setError("Erro fatal no servidor. Verifique o console.");
        setLoading(false);
        return;
      }

      if (response.ok) {
        setSuccess("Cadastro realizado! Autenticando...");

        // Auto-login
        const loginResult = await signIn("credentials", {
          email: formData.get("email") as string,
          password: formData.get("password") as string,
          redirect: false,
        });

        if (loginResult?.ok) {
          router.push("/dashboard"); // TRIAL permite acesso ao dashboard
        } else {
          // Fallback if auto-login fails
          router.push("/login?registered=true");
        }
      } else {
        console.error("Erro retornado pela API:", data);
        setError(data.error || "Erro ao cadastrar");
      }
    } catch (err) {
      console.error("Erro na requisição (catch):", err);
      setError("Erro de conexão ao servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-full bg-secondary hover:bg-accent text-foreground transition-all z-50 shadow-sm"
        title={
          theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"
        }
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Background Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/4 w-[80%] h-[80%] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 w-[60%] h-[60%] rounded-full bg-accent/20 blur-3xl" />
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-[850px] h-[520px] bg-card rounded-[30px] shadow-lg overflow-hidden border border-border">
        {/* Forms Container */}
        <div className="absolute inset-0 flex">
          {/* Sign In Form - Right Side */}
          <div
            className={cn(
              "absolute right-0 w-1/2 h-full flex flex-col items-center justify-center px-10 transition-all duration-700 ease-in-out",
              isSignUp
                ? "opacity-0 pointer-events-none translate-x-full"
                : "opacity-100"
            )}
          >
            <h2 className="text-3xl font-bold text-card-foreground mb-8">
              Login
            </h2>

            {error && !isSignUp && (
              <div className="w-full mb-4 p-3 bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-lg">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSignIn} className="w-full space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-muted rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  name="password"
                  placeholder="Senha"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-muted rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl shadow-md hover:opacity-90 transition-all duration-300 disabled:opacity-50 active:scale-[0.98]"
              >
                {loading ? "ENTRANDO..." : "ENTRAR"}
              </button>
            </form>

            <p className="text-muted-foreground text-sm mt-6">
              Ou entre com redes sociais
            </p>

            <div className="flex gap-4 mt-4">
              {[GoogleIcon, FacebookIcon, TwitterIcon, LinkedInIcon].map(
                (Icon, i) => (
                  <button
                    key={i}
                    type="button"
                    className="w-11 h-11 rounded-full border-2 border-border flex items-center justify-center hover:border-primary hover:scale-110 transition-all duration-200"
                  >
                    <Icon />
                  </button>
                )
              )}
            </div>
          </div>

          {/* Sign Up Form - Left Side (hidden initially) */}
          <div
            className={cn(
              "absolute left-0 w-1/2 h-full flex flex-col items-center justify-center px-10 transition-all duration-700 ease-in-out",
              isSignUp
                ? "opacity-100"
                : "opacity-0 pointer-events-none -translate-x-full"
            )}
          >
            <h2 className="text-3xl font-bold text-card-foreground mb-6">
              Criar Conta
            </h2>

            {error && isSignUp && (
              <div className="w-full mb-4 p-3 bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-lg">
                ⚠️ {error}
              </div>
            )}
            {success && (
              <div className="w-full mb-4 p-3 bg-accent/30 border border-accent text-accent-foreground text-sm rounded-lg">
                ✅ {success}
              </div>
            )}

            <form onSubmit={handleSignUp} className="w-full space-y-3">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  name="name"
                  placeholder="Seu Nome"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-muted rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  name="clinicName"
                  placeholder="Nome da Clínica"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-muted rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-muted rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  name="password"
                  placeholder="Senha"
                  required
                  minLength={6}
                  className="w-full pl-12 pr-4 py-3 bg-muted rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl shadow-md hover:opacity-90 transition-all duration-300 disabled:opacity-50 active:scale-[0.98]"
              >
                {loading ? "CRIANDO..." : "CADASTRAR"}
              </button>
            </form>

            <p className="text-muted-foreground text-sm mt-4">
              Ou cadastre-se com redes sociais
            </p>

            <div className="flex gap-4 mt-3">
              {[GoogleIcon, FacebookIcon, TwitterIcon, LinkedInIcon].map(
                (Icon, i) => (
                  <button
                    key={i}
                    type="button"
                    className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center hover:border-primary hover:scale-110 transition-all duration-200"
                  >
                    <Icon />
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Overlay Panel - Animated */}
        <div
          className={cn(
            "absolute top-0 w-1/2 h-full bg-primary transition-transform duration-700 ease-in-out flex flex-col items-center justify-center text-primary-foreground px-10 z-10",
            isSignUp
              ? "translate-x-full rounded-l-[150px]"
              : "translate-x-0 rounded-r-[150px]"
          )}
        >
          <h2 className="text-3xl font-bold mb-3">
            {isSignUp ? "Já tem uma conta?" : "Novo por aqui?"}
          </h2>
          <p className="text-center text-primary-foreground/80 mb-6 max-w-[250px]">
            {isSignUp
              ? "Entre para acessar o painel da sua clínica e gerenciar seu estoque."
              : "Junte-se a nós hoje e descubra um mundo de possibilidades. Crie sua conta em segundos!"}
          </p>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setSuccess(null);
            }}
            className="px-8 py-3 border-2 border-primary-foreground rounded-full font-semibold hover:bg-primary-foreground hover:text-primary transition-all duration-300 active:scale-95 text-sm uppercase tracking-wider"
          >
            {isSignUp ? "ENTRAR" : "CADASTRAR"}
          </button>
        </div>
      </div>

      {/* Copyright */}
      <p className="absolute bottom-4 text-muted-foreground text-sm">
        © 2024 EstéticaStock SaaS
      </p>
    </div>
  );
}
