// prisma/seed.ts

import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import { PrismaClient } from 'src/generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  const salt_rounds = Number(process.env.SALT_ROUNDS) || 12;

  const adminEmail = 'admin@mehedi.com';
  const adminPlainPassword = 'ChangeMe123';

  const hashedPassword = await bcrypt.hash(adminPlainPassword, salt_rounds);

  try {
    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        password: hashedPassword,
        role: 'ADMIN',
      },
      create: {
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('✅ Admin user created / updated:');
    console.log(`   Email:    ${admin.email}`);
    console.log(`   Role:     ${admin.role}`);
    console.log(`   Password: ${adminPlainPassword}  (CHANGE IMMEDIATELY!)`);
  } catch (err) {
    console.error('❌ Failed to seed admin:', err);
    process.exit(1);
  }

  // Optional: seed test users, categories, etc.
  // await prisma.user.createMany({ data: [...] });

  console.log('🌱 Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
