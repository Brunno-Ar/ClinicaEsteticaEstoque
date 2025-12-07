import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const hashedPassword = await bcrypt.hash("admin123", 12);

  // =====================
  // SUPER ADMIN (YOU - SaaS Owner)
  // =====================
  await prisma.user.upsert({
    where: { email: "suporte@esteticastock.com" },
    update: {},
    create: {
      email: "suporte@esteticastock.com",
      name: "Super Admin",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      tenantId: null, // Super admin doesn't belong to a tenant
    },
  });

  console.log("✅ Created SUPER ADMIN account:");
  console.log("   Email: suporte@esteticastock.com");
  console.log("   Password: admin123");
  console.log("   Role: SUPER_ADMIN");

  // =====================
  // TEST TENANT: ACTIVE (For testing the full system)
  // =====================
  const hashedTestPassword = await bcrypt.hash("teste123", 12);

  const activeTenant = await prisma.tenant.upsert({
    where: { slug: "clinica-teste-ativa" },
    update: {},
    create: {
      name: "Clínica Teste Ativa",
      slug: "clinica-teste-ativa",
      subscriptionStatus: "ACTIVE",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@teste.com" },
    update: {},
    create: {
      email: "admin@teste.com",
      name: "Admin Teste",
      password: hashedTestPassword,
      role: "CLINIC_ADMIN",
      tenantId: activeTenant.id,
    },
  });

  console.log("✅ Created ACTIVE test tenant:");
  console.log("   Email: admin@teste.com");
  console.log("   Password: teste123");

  // =====================
  // TEST TENANT: PENDING
  // =====================
  const pendingTenant = await prisma.tenant.upsert({
    where: { slug: "clinica-beleza-total" },
    update: {},
    create: {
      name: "Clínica Beleza Total",
      slug: "clinica-beleza-total",
      subscriptionStatus: "PENDING",
    },
  });

  await prisma.user.upsert({
    where: { email: "contato@belezatotal.com" },
    update: {},
    create: {
      email: "contato@belezatotal.com",
      name: "Maria Silva",
      password: hashedTestPassword,
      role: "CLINIC_ADMIN",
      tenantId: pendingTenant.id,
    },
  });

  console.log("✅ Created PENDING test tenant: Clínica Beleza Total");

  // =====================
  // SAMPLE PRODUCTS FOR ACTIVE TENANT
  // =====================
  const product1 = await prisma.product.upsert({
    where: { id: "sample-product-1" },
    update: {},
    create: {
      id: "sample-product-1",
      name: "Botox 50U",
      description: "Toxina Botulínica 50 unidades",
      price: 250.0,
      tenantId: activeTenant.id,
    },
  });

  await prisma.batch.create({
    data: {
      quantity: 10,
      expirationDate: new Date("2025-12-31"),
      productId: product1.id,
      tenantId: activeTenant.id,
    },
  });

  console.log("✅ Created sample products");

  console.log("\n🎉 Seeding completed!");
  console.log("\n📌 SUAS CREDENCIAIS DE ADMIN:");
  console.log("   URL: http://localhost:3000/admin");
  console.log("   Email: suporte@esteticastock.com");
  console.log("   Senha: admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
