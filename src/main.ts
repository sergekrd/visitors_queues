import { NestFactory } from '@nestjs/core';

import { TicketsService } from './modules/public/tickets/tickets.service';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const ticketsService = app.get(TicketsService);
    await ticketsService.initializeTimers(); 
    app.useGlobalPipes(new ValidationPipe({
        transform: true, // Автоматически преобразует входящие данные в DTO
        whitelist: true, // Убирает лишние свойства
    }));
    await app.listen(process.env.PORT ?? 3010);
}
bootstrap();
