import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { productId, quantity, expirationDate } = body;

    if (!productId || !quantity || !expirationDate) {
      return NextResponse.json(
        { error: "Produto, quantidade e data de validade são obrigatórios" },
        { status: 400 }
      );
    }

    // Verify product belongs to tenant
    const product = await db.product.findFirst({
      where: {
        id: productId,
        tenantId: session.user.tenantId,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    const batch = await db.batch.create({
      data: {
        quantity: parseInt(quantity),
        expirationDate: new Date(expirationDate),
        productId,
        tenantId: session.user.tenantId,
      },
    });

    return NextResponse.json(batch, { status: 201 });
  } catch (error) {
    console.error("Error creating batch:", error);
    return NextResponse.json({ error: "Erro ao criar lote" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all batches for tenant's products
    const batches = await db.batch.findMany({
      where: {
        product: {
          tenantId: session.user.tenantId,
        },
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
      },
      orderBy: { expirationDate: "asc" },
    });

    return NextResponse.json(batches);
  } catch (error) {
    console.error("Error fetching batches:", error);
    return NextResponse.json(
      { error: "Erro ao buscar lotes" },
      { status: 500 }
    );
  }
}
