import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Проверка и создание сервисов
  let servicesData = [
    { name: 'Сервис 1' },
    { name: 'Сервис 2' },
  ];
  
  const existingServices = await prisma.services.findMany();
  if (existingServices.length > 0) {
    const existingServiceNames = existingServices.map(({ name }) => name);
    servicesData = servicesData.filter(item => !existingServiceNames.includes(item.name));
  }
  
  if (servicesData.length > 0) {
    const services = await prisma.services.createMany({ data: servicesData });
    console.log('Созданные сервисы:', services);
  } else {
    console.log('Таблица services заполнена ранее');
  }

  // Проверка и создание причин
  let reasonsData = [
    { name: 'timeExpired', description: 'Истекло время приема' },
    { name: 'success', description: 'Успешное решение' },
    { name: 'failed', description: 'Не успешное решение' },
  ];
  
  const existingReasons = await prisma.reasons.findMany();
  if (existingReasons.length > 0) {
    const existingReasonNames = existingReasons.map(({ name }) => name);
    reasonsData = reasonsData.filter(item => !existingReasonNames.includes(item.name));
  }
  
  if (reasonsData.length > 0) {
    const reasons = await prisma.reasons.createMany({ data: reasonsData });
    console.log('Созданные причины:', reasons);
  } else {
    console.log('Таблица reasons заполнена ранее');
  }

  // Проверка и создание настроек
  const existingSettings = await prisma.settings.findMany();
  if (existingSettings.length > 0) {
    console.log('Настройки уже существуют:', existingSettings);
  } else {
    const settingsData = {
      start_work: '9:00',
      end_work: '18:00',
      processing_time: 1
    };
  
    const settings = await prisma.settings.create({
      data: settingsData,
    });
    console.log('Созданные настройки:', settings);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
