import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify user is SUPER_ADMIN
  const user = await db.user.findUnique({
    where: { email: session.user?.email || "" },
  });

  if (user?.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await db.tenant.update({
      where: { id: params.id },
      data: { subscriptionStatus: "SUSPENDED" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error rejecting tenant:", error);
    return NextResponse.json({ error: "Erro ao rejeitar" }, { status: 500 });
  }
}
