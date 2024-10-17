import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SettingsController } from './settings.controller';

@Module({
    imports: [],
    controllers: [SettingsController],
    providers: [SettingsService, PrismaService],
})
export class SettingsModule { }
