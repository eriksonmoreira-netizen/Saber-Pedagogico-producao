// @ts-ignore
import { PrismaClient } from '@prisma/client';
import process from 'node:process';

const prisma = new PrismaClient();

async function main() {
  const masterEmail = 'erikson.moreira@gmail.com';

  console.log('🌱 Iniciando Seed - Verificando Super Admin...');

  const admin = await prisma.user.upsert({
    where: { email: masterEmail },
    update: {
      role: 'admin',
      plan: 'gestor',
      status: 'active',
      full_name: 'Erikson Moreira'
    },
    create: {
      email: masterEmail,
      full_name: 'Erikson Moreira',
      role: 'admin',
      plan: 'gestor',
      status: 'active',
    },
  });

  console.log(`👑 Admin garantido no Banco: ${admin.email} [${admin.role}]`);
}

main()
  .catch((e) => {
    console.error('❌ Erro no Seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });