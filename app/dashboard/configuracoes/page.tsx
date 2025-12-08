import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ConfigClient } from "./config-client";

export const dynamic = "force-dynamic";

export default async function ConfiguracoesClinicaPage() {
  const session = await getServerSession(authOptions);

  return <ConfigClient session={session} />;
}
