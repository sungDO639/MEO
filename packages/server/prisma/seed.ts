import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default admin user
  const adminEmail = 'admin@meo.local';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin User',
        role: 'admin',
        isActive: true,
      },
    });
    console.log('✅ Admin user created:', admin.email);
  } else {
    console.log('⏭️  Admin user already exists');
  }

  // Create test user
  const testEmail = 'test@meo.local';
  const existingTest = await prisma.user.findUnique({
    where: { email: testEmail },
  });

  if (!existingTest) {
    const hashedPassword = await bcrypt.hash('test123', 10);
    const testUser = await prisma.user.create({
      data: {
        email: testEmail,
        password: hashedPassword,
        name: 'Test User',
        role: 'user',
        isActive: true,
      },
    });
    console.log('✅ Test user created:', testUser.email);
  } else {
    console.log('⏭️  Test user already exists');
  }

  console.log('✅ Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
