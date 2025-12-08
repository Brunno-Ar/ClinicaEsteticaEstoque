import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando Reset do Banco...");

  // 1. Limpar as tabelas na ordem correta para evitar erros de FK
  console.log("🗑️ Apagando dados existentes...");
  try {
    await prisma.batch.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    await prisma.tenant.deleteMany();
    console.log("   Dados limpos.");
  } catch (error) {
    console.warn(
      "⚠️  Aviso ao limpar tabelas (pode ser a primeira execução):",
      error
    );
  }

  // 2. Criar o novo Super Admin
  const hashedPassword = await bcrypt.hash("Brunno10z!", 12);

  console.log("👤 Criando Super Admin...");
  await prisma.user.create({
    data: {
      email: "brunnoaraujoc@gmail.com",
      name: "Bruno Araujo",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      tenantId: null, // Admin global
    },
  });

  console.log("\n🎉 Reset Concluído com Sucesso!");
  console.log("\n📌 CREDENCIAIS DE ACESSO:");
  console.log("   Email: brunnoaraujoc@gmail.com");
  console.log("   Senha: Brunno10z!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
