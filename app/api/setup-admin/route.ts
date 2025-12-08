import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

// ROTA TEMPORÁRIA - REMOVER APÓS CRIAR O ADMIN!
// Acesse: /api/setup-admin para criar o admin
export async function GET() {
  try {
    // Verificar se já existe um SUPER_ADMIN
    const existingAdmin = await db.user.findFirst({
      where: { role: "SUPER_ADMIN" },
    });

    if (existingAdmin) {
      return NextResponse.json({
        message: "Super Admin já existe!",
        email: existingAdmin.email,
      });
    }

    // Criar o Super Admin
    const hashedPassword = await bcrypt.hash("Brunno10z!", 12);

    const admin = await db.user.create({
      data: {
        email: "brunnoaraujoc@gmail.com",
        name: "Bruno Araujo",
        password: hashedPassword,
        role: "SUPER_ADMIN",
        tenantId: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Super Admin criado com sucesso!",
      email: admin.email,
      hint: "REMOVA ESTA ROTA APÓS O PRIMEIRO USO!",
    });
  } catch (error) {
    console.error("Erro ao criar admin:", error);
    return NextResponse.json(
      { error: "Erro ao criar admin", details: String(error) },
      { status: 500 }
    );
  }
}
