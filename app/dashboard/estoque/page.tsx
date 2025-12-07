import { db } from "@/lib/db";
import { getTenantId } from "@/lib/get-tenant";
import { EstoqueClient } from "./estoque-client";

export default async function EstoquePage() {
  const tenantId = await getTenantId();

  const products = await db.product.findMany({
    where: { tenantId },
    include: { batches: true },
    orderBy: { name: "asc" },
  });

  return <EstoqueClient products={products} />;
}
