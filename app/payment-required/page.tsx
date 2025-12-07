import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function PaymentRequiredPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
              <AlertTriangle className="text-white w-12 h-12" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Acesso Pendente
          </h1>
        </div>

        <div className="p-8 text-center">
          <p className="text-slate-600 mb-6">
            Sua conta está aguardando aprovação ou pagamento.
          </p>

          <div className="space-y-4">
            <a
              href="mailto:suporte@esteticastock.com"
              className="block w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg"
            >
              Contatar Suporte
            </a>

            <Link
              href="/login"
              className="block text-slate-500 hover:text-teal-600 py-2"
            >
              Voltar ao Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
