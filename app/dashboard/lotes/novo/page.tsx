import { db } from "@/lib/db";
import { getTenantId } from "@/lib/get-tenant";
import { NewBatchForm } from "./form";

export default async function NovoLotePage() {
  const tenantId = await getTenantId();

  const products = await db.product.findMany({
    where: { tenantId },
    orderBy: { name: "asc" },
  });

  return <NewBatchForm products={products} />;
}
