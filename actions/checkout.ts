"use server";

import { redirect } from "next/navigation";
import MercadoPagoConfig, { PreApproval } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function createCheckoutSession(tenantId: string, email: string) {
  // We use PreApproval to create a subscription flow linked to the specific Plan ID
  const subscription = new PreApproval(client);

  try {
    const result = await subscription.create({
      body: {
        reason: "Assinatura EstéticaStock Pro",
        external_reference: tenantId, // CRITICAL: Links payment to Tenant
        payer_email: email,
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: 29.9,
          currency_id: "BRL",
        },
        back_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?status=success`,
        status: "pending",
        preapproval_plan_id: process.env.NEXT_PUBLIC_MP_PLAN_ID, // Connects to your specific plan
      },
    });

    if (!result.init_point) {
      throw new Error("Failed to create subscription init_point");
    }

    // Redirect user to the subscription checkout
    redirect(result.init_point);
  } catch (error) {
    // If redirect throws (Next.js way), let it pass
    if ((error as any).message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Mercado Pago Subscription Error:", error);
    // Fallback or error handling
    redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/payment-required?error=creation_failed`
    );
  }
}
