import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, clinicName, email, password } = body;

    // Validate required fields
    if (!name || !clinicName || !email || !password) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter no mínimo 6 caracteres" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email já está cadastrado" },
        { status: 400 }
      );
    }

    // Create slug from clinic name
    const slug =
      clinicName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") +
      "-" +
      Date.now().toString(36);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create tenant and user in a transaction
    const result = await db.$transaction(async (tx) => {
      // Create tenant with TRIAL status (14 days)
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 14);

      const tenant = await tx.tenant.create({
        data: {
          name: clinicName,
          slug,
          subscriptionStatus: "TRIAL",
          trialEndsAt: trialEndsAt,
        },
      });

      // Create user as CLINIC_ADMIN
      const user = await tx.user.create({
        data: {
          name,
          email: email.toLowerCase(),
          password: hashedPassword,
          role: "CLINIC_ADMIN",
          tenantId: tenant.id,
        },
      });

      return { tenant, user };
    });

    return NextResponse.json(
      {
        success: true,
        message: "Cadastro realizado com sucesso! Aguarde aprovação.",
        tenantId: result.tenant.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ ERRO CRÍTICO NO REGISTRO:", error);
    // @ts-ignore
    if (error.code) console.error("Código do erro:", error.code);

    return NextResponse.json(
      { error: "Erro interno no servidor ao processar cadastro." },
      { status: 500 }
    );
  }
}
