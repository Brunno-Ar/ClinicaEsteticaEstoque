"use client";

import { useTheme } from "@/components/providers/theme-provider";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon, CreditCard, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Session } from "next-auth";

interface ConfigClientProps {
  session: Session | null;
}

export function ConfigClient({ session }: ConfigClientProps) {
  const { theme, setTheme } = useTheme();

  // Dados de assinatura do usuário logado via prop
  const tenantStatus = (session?.user as any)?.tenantStatus || "PENDING";
  const trialEndsAt = (session?.user as any)?.trialEndsAt;

  // Calcula dias restantes se for TRIAL
  let trialDaysLeft = 0;
  if (trialEndsAt) {
    const diffTime = Math.max(
      0,
      new Date(trialEndsAt).getTime() - new Date().getTime()
    );
    trialDaysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as preferências da sua clínica e assinatura.
        </p>
      </div>

      {/* Seção de Assinatura */}
      <div className="bg-card p-6 md:p-8 rounded-xl border border-border shadow-sm">
        <h3 className="text-lg font-bold mb-6 text-foreground flex items-center">
          <CreditCard className="mr-2 text-primary" size={20} />
          Minha Assinatura
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card de Status */}
          <div
            className={`p-6 rounded-lg border ${
              tenantStatus === "ACTIVE"
                ? "bg-emerald-500/10 border-emerald-500/20"
                : tenantStatus === "TRIAL"
                ? "bg-indigo-500/10 border-indigo-500/20"
                : "bg-amber-500/10 border-amber-500/20"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Status Atual
              </span>
              <span
                className={`px-2 py-1 rounded text-xs font-bold ${
                  tenantStatus === "ACTIVE"
                    ? "bg-emerald-500 text-white"
                    : tenantStatus === "TRIAL"
                    ? "bg-indigo-500 text-white"
                    : "bg-amber-500 text-white"
                }`}
              >
                {tenantStatus === "ACTIVE"
                  ? "ATIVO"
                  : tenantStatus === "TRIAL"
                  ? "PERÍODO DE TESTE"
                  : "PENDENTE"}
              </span>
            </div>

            <div className="mb-4">
              <p className="text-3xl font-bold text-foreground">Plano PRO</p>
              <p className="text-muted-foreground text-sm">
                Acesso completo a todos os recursos
              </p>
            </div>

            {tenantStatus === "TRIAL" && (
              <div className="flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-4">
                <Clock size={16} className="mr-1.5" />
                {trialDaysLeft > 0
                  ? `${trialDaysLeft} dias restantes`
                  : "Expirou hoje"}
              </div>
            )}

            {tenantStatus === "ACTIVE" && (
              <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-4">
                <CheckCircle size={16} className="mr-1.5" />
                Assinatura em dia
              </div>
            )}
          </div>

          {/* Detalhes e Ação */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted-foreground">Valor Mensal</span>
                <span className="font-semibold text-foreground">R$ 49,90</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted-foreground">Próxima Cobrança</span>
                <span className="font-medium text-foreground">
                  {tenantStatus === "TRIAL"
                    ? new Date(trialEndsAt).toLocaleDateString("pt-BR")
                    : "30 dias após pagamento"}
                </span>
              </div>
            </div>

            <div className="mt-6">
              {tenantStatus === "TRIAL" || tenantStatus === "PENDING" ? (
                <Link
                  href="/payment-required"
                  className="block w-full text-center bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-lg shadow transition-colors"
                >
                  Assinar Agora
                </Link>
              ) : (
                <button className="w-full text-center border border-border hover:bg-muted text-muted-foreground font-medium py-3 rounded-lg transition-colors">
                  Gerenciar Assinatura (Mercado Pago)
                </button>
              )}
              <p className="text-center text-xs text-muted-foreground mt-2">
                Pagamento processado de forma segura pelo Mercado Pago
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card p-6 md:p-8 rounded-xl border border-border shadow-sm transition-colors">
        <h3 className="text-lg font-bold mb-6 text-foreground">
          Configurações da Clínica
        </h3>

        <div className="mb-0">
          <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            Aparência
          </h4>
          <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/30">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-background rounded-full border border-border shadow-sm text-foreground">
                {theme === "dark" ? (
                  <Moon size={20} className="text-primary" />
                ) : (
                  <Sun size={20} className="text-primary" />
                )}
              </div>
              <div>
                <p className="font-medium text-foreground">Tema do Sistema</p>
                <p className="text-sm text-muted-foreground">
                  Alternar entre modo claro e escuro
                </p>
              </div>
            </div>

            <Switch
              checked={theme === "dark"}
              onCheckedChange={(c) => setTheme(c ? "dark" : "light")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
