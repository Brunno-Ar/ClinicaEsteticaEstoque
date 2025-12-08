"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, Check, CreditCard, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PaymentRequiredPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/payment/create", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        } else {
          setError("Erro: URL de pagamento não retornada.");
        }
      } else {
        if (response.status === 401) {
          setError("Sessão expirada. Faça login novamente.");
          setTimeout(() => router.push("/login"), 2000);
        } else {
          setError(data.error || "Erro ao iniciar pagamento");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-8 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Ative sua Conta</h1>
            <p className="opacity-90">
              Libere o acesso total ao sistema agora mesmo.
            </p>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl transform -translate-x-10 translate-y-10"></div>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <div className="flex items-baseline justify-center mb-4">
              <span className="text-5xl font-extrabold text-slate-900">
                R$ 49
              </span>
              <span className="text-xl text-slate-500 font-medium">,90</span>
              <span className="text-slate-400 ml-2">/mês</span>
            </div>

            <ul className="space-y-4 mb-2">
              {[
                "Controle de Estoque Completo",
                "Gestão de Lotes e Validade",
                "Alertas de Vencimento",
                "Suporte Prioritário",
                "Atualizações Gratuitas",
              ].map((item, i) => (
                <li key={i} className="flex items-center text-slate-600">
                  <div className="bg-teal-100 p-1 rounded-full mr-3 text-teal-600">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-500/30 flex items-center justify-center transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" /> Processando...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2" /> ASSINAR AGORA
                </>
              )}
            </button>

            <p className="text-xs text-center text-slate-400">
              Pagamento seguro via Mercado Pago. Cancele quando quiser.
            </p>

            <div className="pt-4 border-t border-slate-100 flex justify-center">
              <Link
                href="/login"
                className="text-sm text-slate-500 hover:text-teal-600 py-2"
              >
                Sair e voltar depois
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
