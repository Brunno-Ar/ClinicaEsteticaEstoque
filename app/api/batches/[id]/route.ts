import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Verify batch belongs to tenant's product
    const batch = await db.batch.findFirst({
      where: {
        id: params.id,
        product: {
          tenantId: session.user.tenantId,
        },
      },
    });

    if (!batch) {
      return NextResponse.json(
        { error: "Lote não encontrado" },
        { status: 404 }
      );
    }

    await db.batch.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting batch:", error);
    return NextResponse.json(
      { error: "Erro ao excluir lote" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Verify batch belongs to tenant's product
    const existing = await db.batch.findFirst({
      where: {
        id: params.id,
        product: {
          tenantId: session.user.tenantId,
        },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Lote não encontrado" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { quantity, expirationDate } = body;

    const batch = await db.batch.update({
      where: { id: params.id },
      data: {
        quantity: quantity !== undefined ? parseInt(quantity) : undefined,
        expirationDate: expirationDate ? new Date(expirationDate) : undefined,
      },
    });

    return NextResponse.json(batch);
  } catch (error) {
    console.error("Error updating batch:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar lote" },
      { status: 500 }
    );
  }
}
