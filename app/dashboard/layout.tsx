import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Sidebar } from "@/components/layout/sidebar";
import { TrialBanner } from "@/components/ui/trial-banner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Get tenant info
  const tenant = session.user?.tenantId
    ? await db.tenant.findUnique({ where: { id: session.user.tenantId } })
    : null;

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <TrialBanner />

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto pt-16 md:pt-4">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Dashboard da Clínica
              </h1>
              <p className="text-muted-foreground text-sm">
                Bem-vindo ao sistema EstéticaStock.
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-card px-4 py-2 rounded-full shadow-sm border border-border">
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold bg-primary/20 text-primary">
                {tenant?.name?.charAt(0) || "C"}
              </div>
              <span className="text-sm font-medium text-foreground">
                {tenant?.name || "Clínica"}
              </span>
            </div>
          </header>
          {children}
        </main>
      </div>

      {/* IA Assistente Button */}
      <button className="fixed bottom-6 right-6 px-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg flex items-center space-x-2 transition-colors z-30">
        <span className="text-lg">✨</span>
        <span className="font-medium hidden sm:inline">IA Assistente</span>
      </button>
    </div>
  );
}
