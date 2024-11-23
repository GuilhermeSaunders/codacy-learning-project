import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createSeed() {
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password',
    },
  });
}

createSeed()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
