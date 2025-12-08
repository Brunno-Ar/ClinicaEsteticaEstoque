import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await db.product.findMany({
    where: { tenantId: session.user.tenantId },
    include: { batches: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name,
      description,
      price,
      imageUrl,
      sku,
      category,
      unit,
      minStockLevel,
      lotCode,
      quantity,
      expirationDate,
      totalCost,
      unitCost,
    } = body;

    if (!name || price === undefined) {
      return NextResponse.json(
        { error: "Nome e preço são obrigatórios" },
        { status: 400 }
      );
    }

    const productData: any = {
      name,
      description,
      price,
      imageUrl,
      sku,
      category: category || "Geral",
      unit: unit || "unidade",
      minStockLevel: minStockLevel || 5,
      tenantId: session.user.tenantId,
    };

    if (quantity && quantity > 0 && expirationDate) {
      productData.batches = {
        create: {
          lotCode,
          quantity,
          expirationDate: new Date(expirationDate),
          totalCost,
          unitCost,
          tenantId: session.user.tenantId,
        },
      };
    }

    const product = await db.product.create({
      data: productData,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Erro ao criar produto" },
      { status: 500 }
    );
  }
}
