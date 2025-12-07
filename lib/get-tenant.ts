import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Gets the current user's tenant ID from the session.
 * This is the CORE security function for multi-tenancy.
 *
 * CRITICAL: ALWAYS use this function when querying data.
 * Never trust tenantId from client-side or URL params.
 */
export async function getTenantId(): Promise<string> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.tenantId) {
    redirect("/login");
  }

  return session.user.tenantId;
}

/**
 * Gets full session with tenant info
 */
export async function getAuthSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return session;
}
