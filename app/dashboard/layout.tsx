import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Sidebar } from "@/components/layout/sidebar";

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
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">
              Dashboard da Clínica
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Bem-vindo ao sistema EstéticaStock.
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300">
              {tenant?.name?.charAt(0) || "C"}
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {tenant?.name || "Clínica"}
            </span>
          </div>
        </header>
        {children}
      </main>

      {/* IA Assistente Button */}
      <button className="fixed bottom-6 right-6 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-lg flex items-center space-x-2 transition-colors">
        <span className="text-lg">✨</span>
        <span className="font-medium">IA Assistente</span>
      </button>
    </div>
  );
}
