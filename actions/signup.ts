"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

interface SignupData {
  clinicName: string;
  email: string;
  password: string;
  ownerName: string;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function signupAction(data: SignupData) {
  // 1. Validate input
  if (!data.email || !data.password || !data.clinicName) {
    return { error: "Todos os campos são obrigatórios" };
  }

  if (data.password.length < 8) {
    return { error: "A senha deve ter no mínimo 8 caracteres" };
  }

  // 2. Check if email already exists
  const existingUser = await db.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    return { error: "Este email já está cadastrado" };
  }

  // 3. Generate unique slug for tenant
  let slug = generateSlug(data.clinicName);
  const existingTenant = await db.tenant.findUnique({ where: { slug } });
  if (existingTenant) {
    slug = `${slug}-${Date.now()}`;
  }

  // 4. Hash password
  const hashedPassword = await bcrypt.hash(data.password, 12);

  // 5. Create Tenant and User in a transaction
  try {
    await db.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: data.clinicName,
          slug: slug,
          subscriptionStatus: "PENDING", // Starts as PENDING until payment
        },
      });

      await tx.user.create({
        data: {
          email: data.email,
          name: data.ownerName,
          password: hashedPassword,
          tenantId: tenant.id,
        },
      });
    });
  } catch (error) {
    console.error("Signup error:", error);
    return { error: "Erro ao criar conta. Tente novamente." };
  }

  // 6. Redirect to payment page
  // User should pay BEFORE accessing the system
  redirect("/payment-required?welcome=true");
}
