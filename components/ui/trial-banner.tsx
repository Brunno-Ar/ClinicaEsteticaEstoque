"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Clock, AlertCircle } from "lucide-react";

export function TrialBanner() {
  const { data: session } = useSession();

  // Se não estiver logado ou não tiver status, não mostra nada
  if (!session?.user) return null;

  const status = (session.user as any).tenantStatus;
  const trialEndsAt = (session.user as any).trialEndsAt;

  // Só mostra se for TRIAL
  if (status !== "TRIAL" || !trialEndsAt) return null;

  const endDate = new Date(trialEndsAt);
  const now = new Date();

  // Calcula dias restantes
  const diffTime = Math.max(0, endDate.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Define cor baseada na urgência
  const isUrgent = diffDays <= 3;

  return (
    <div
      className={`${
        isUrgent ? "bg-red-500" : "bg-indigo-600"
      } text-white px-4 py-3 shadow-md transition-colors`}
    >
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between text-sm sm:text-base">
        <div className="flex items-center mb-2 sm:mb-0">
          {isUrgent ? (
            <AlertCircle className="mr-2" />
          ) : (
            <Clock className="mr-2" />
          )}
          <span className="font-medium">
            {diffDays > 0
              ? `Você tem ${diffDays} dias restantes no seu teste grátis.`
              : "Seu período de teste acabou."}
          </span>
        </div>

        <Link
          href="/payment-required"
          className="bg-white text-indigo-600 font-bold py-1 px-4 rounded-full text-xs sm:text-sm hover:bg-slate-100 transition-colors shadow-sm whitespace-nowrap"
        >
          Assinar Agora
        </Link>
      </div>
    </div>
  );
}
