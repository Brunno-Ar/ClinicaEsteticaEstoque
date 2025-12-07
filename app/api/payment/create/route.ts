import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// API para criar link de pagamento via Mercado Pago
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tenant = await db.tenant.findUnique({
      where: { id: session.user.tenantId },
      include: { users: { take: 1 } },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // Criar preferência de pagamento no Mercado Pago
    const preference = {
      items: [
        {
          title: "EstéticaStock - Assinatura Mensal",
          description: "Sistema de gestão de estoque para clínicas estéticas",
          quantity: 1,
          currency_id: "BRL",
          unit_price: 299.9,
        },
      ],
      payer: {
        email: tenant.users[0]?.email || "",
        name: tenant.users[0]?.name || tenant.name,
      },
      external_reference: tenant.id, // Usado para identificar o tenant no webhook
      back_urls: {
        success: `${process.env.NEXTAUTH_URL}/payment-success`,
        failure: `${process.env.NEXTAUTH_URL}/payment-required`,
        pending: `${process.env.NEXTAUTH_URL}/payment-required`,
      },
      auto_return: "approved",
      notification_url: `${process.env.NEXTAUTH_URL}/api/webhooks/mercadopago`,
    };

    const response = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
        body: JSON.stringify(preference),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Mercado Pago error:", errorData);
      return NextResponse.json(
        { error: "Failed to create payment" },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      checkoutUrl: data.init_point,
      sandboxUrl: data.sandbox_init_point, // Para testes
      preferenceId: data.id,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
