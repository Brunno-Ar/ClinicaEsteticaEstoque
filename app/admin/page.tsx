import { db } from "@/lib/db";
import { AdminDashboardClient } from "./dashboard-client";

const PLAN_PRICE = 49.9;

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const tenants = await db.tenant.findMany({
    include: {
      users: {
        select: { name: true, email: true },
        take: 1,
      },
      _count: {
        select: { products: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const activeTenantsList = tenants.filter(
    (t) => t.subscriptionStatus === "ACTIVE"
  );
  const pendingTenantsList = tenants.filter(
    (t) => t.subscriptionStatus === "PENDING"
  );

  const mrr = activeTenantsList.length * PLAN_PRICE;

  return (
    <AdminDashboardClient
      tenants={tenants}
      mrr={mrr}
      activeTenants={activeTenantsList.length}
      pendingTenants={pendingTenantsList}
    />
  );
}
