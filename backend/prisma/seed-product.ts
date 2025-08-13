import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Find tenant1
  const tenant = await prisma.tenant.findUnique({ where: { code: 'tenant1' } });
  if (!tenant) throw new Error('tenant1 not found');

  // Upsert a product for tenant1
  const product = await prisma.product.upsert({
    where: { tenantId_sku: { tenantId: tenant.id, sku: 'PROD-001' } },
    update: {},
    create: {
      tenantId: tenant.id,
      sku: 'PROD-001',
      name: 'Sample Product',
      description: 'A sample product for testing',
      price: 10.0,
      cost: 5.0,
      category: 'General',
      brand: 'DemoBrand',
      attributes: '{}',
      isActive: true,
    },
  });

  console.log('Seeded product PROD-001 for tenant1:', product.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 