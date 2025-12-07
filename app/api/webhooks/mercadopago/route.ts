import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Mercado Pago Webhook Handler
// Este webhook é chamado automaticamente pelo Mercado Pago quando:
// - Um pagamento é aprovado
// - Uma assinatura é criada
// - O status da assinatura muda

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log(
      "📩 Mercado Pago Webhook received:",
      JSON.stringify(body, null, 2)
    );

    const { type, data } = body;

    // Tipos de eventos do Mercado Pago
    // - payment: quando um pagamento é processado
    // - subscription_preapproval: quando uma assinatura recorrente é criada/atualizada

    if (type === "payment") {
      // Buscar detalhes do pagamento na API do Mercado Pago
      const paymentId = data.id;

      const paymentResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          },
        }
      );

      if (!paymentResponse.ok) {
        console.error("❌ Failed to fetch payment from Mercado Pago");
        return NextResponse.json(
          { error: "Failed to fetch payment" },
          { status: 500 }
        );
      }

      const payment = await paymentResponse.json();
      console.log("💳 Payment details:", payment);

      // Se o pagamento foi aprovado
      if (payment.status === "approved") {
        // O external_reference deve conter o tenantId
        const tenantId = payment.external_reference;

        if (tenantId) {
          // Atualizar o status do tenant para ACTIVE
          await db.tenant.update({
            where: { id: tenantId },
            data: {
              subscriptionStatus: "ACTIVE",
              mercadoPagoCustomerId: payment.payer?.id?.toString() || null,
            },
          });

          console.log(`✅ Tenant ${tenantId} activated after payment approval`);

          // Criar registro de subscription
          await db.subscription.create({
            data: {
              mercadoPagoId: paymentId.toString(),
              amount: payment.transaction_amount,
              status: "ACTIVE",
              tenantId,
            },
          });
        }
      }
    }

    if (type === "subscription_preapproval") {
      // Buscar detalhes da assinatura
      const preapprovalId = data.id;

      const preapprovalResponse = await fetch(
        `https://api.mercadopago.com/preapproval/${preapprovalId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          },
        }
      );

      if (!preapprovalResponse.ok) {
        console.error("❌ Failed to fetch preapproval from Mercado Pago");
        return NextResponse.json(
          { error: "Failed to fetch preapproval" },
          { status: 500 }
        );
      }

      const preapproval = await preapprovalResponse.json();
      console.log("📋 Preapproval details:", preapproval);

      // Se a assinatura está autorizada/ativa
      if (
        preapproval.status === "authorized" ||
        preapproval.status === "active"
      ) {
        const tenantId = preapproval.external_reference;

        if (tenantId) {
          await db.tenant.update({
            where: { id: tenantId },
            data: {
              subscriptionStatus: "ACTIVE",
              mercadoPagoCustomerId: preapproval.payer_id?.toString() || null,
            },
          });

          console.log(
            `✅ Tenant ${tenantId} activated after subscription approval`
          );
        }
      }

      // Se a assinatura foi cancelada ou pausada
      if (
        preapproval.status === "cancelled" ||
        preapproval.status === "paused"
      ) {
        const tenantId = preapproval.external_reference;

        if (tenantId) {
          await db.tenant.update({
            where: { id: tenantId },
            data: { subscriptionStatus: "SUSPENDED" },
          });

          console.log(
            `⚠️ Tenant ${tenantId} suspended after subscription cancellation`
          );
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// GET para verificação do webhook
export async function GET() {
  return NextResponse.json({
    status: "Mercado Pago webhook endpoint active",
    message: "Use POST to receive webhooks",
  });
}
