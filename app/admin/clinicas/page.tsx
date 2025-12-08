import { db } from "@/lib/db";
import { ClinicasClient } from "./clinicas-client";

export default async function ClinicasPage() {
  const tenants = await db.tenant.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      subscriptionStatus: true,
      trialEndsAt: true,
      createdAt: true,
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

  return <ClinicasClient tenants={tenants} />;
}
