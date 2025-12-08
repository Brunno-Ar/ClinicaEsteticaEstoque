import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Verify user is SUPER_ADMIN
  const user = await db.user.findUnique({
    where: { email: session.user?.email || "" },
  });

  if (user?.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto pt-16 md:pt-4">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-xl font-bold text-foreground">
                SaaS Master Dashboard
              </h1>
              <p className="text-muted-foreground text-sm">
                Bem-vindo ao sistema EstéticaStock.
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-card px-4 py-2 rounded-full shadow-sm border border-border">
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold bg-primary/20 text-primary">
                A
              </div>
              <span className="text-sm font-medium text-foreground">
                EstéticaStock HQ
              </span>
            </div>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
