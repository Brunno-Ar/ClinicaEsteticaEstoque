import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
              <CheckCircle className="text-white w-12 h-12" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Pagamento Confirmado!
          </h1>
        </div>

        <div className="p-8 text-center">
          <p className="text-slate-600 mb-6">
            Seu acesso foi liberado com sucesso. Você já pode começar a usar o
            sistema.
          </p>

          <Link
            href="/dashboard"
            className="block w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Acessar o Sistema
          </Link>
        </div>
      </div>
    </div>
  );
}
