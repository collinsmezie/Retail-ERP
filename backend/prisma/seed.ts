import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.tenant.upsert({
      where: { code: 'tenant1' },
      update: {},
      create: {
        code: 'tenant1',
        name: 'Demo Store 1',
        isActive: true,
        modules: 'inventory,sales,accounting',
      },
    });
    const found = await prisma.tenant.findUnique({ where: { code: 'tenant1' } });
    console.log('Seeded default tenant: tenant1', found);
    process.exit(0);
  } catch (e) {
    console.error('Error seeding tenant:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 