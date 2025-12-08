import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Diagnóstico de Login Admin...");

  const email = "brunnoaraujoc@gmail.com";
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.error("❌ Usuário NÃO encontrado no banco de dados!");
    return;
  }

  console.log("✅ Usuário encontrado:", user.email);
  console.log("   Role:", user.role);
  console.log("   TenantId:", user.tenantId);

  // Testando a senha
  const passwordToTest = "Brunno10z!";
  const isMatch = await bcrypt.compare(passwordToTest, user.password || "");

  if (isMatch) {
    console.log(
      "✅ Senha correta! O hash no banco corresponde a 'Brunno10z!'."
    );
  } else {
    console.error(
      "❌ Senha INCORRETA! O hash no banco NÃO bate com a senha informada."
    );
    console.log("   Recriando hash para corrigir...");

    // Auto-fix
    const newHash = await bcrypt.hash(passwordToTest, 12);
    await prisma.user.update({
      where: { email },
      data: { password: newHash },
    });
    console.log(
      "✅ Senha atualizada forçadamente para 'Brunno10z!'. Tente logar agora."
    );
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
