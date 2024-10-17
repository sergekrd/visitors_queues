import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { SettingsEntity } from 'src/entities/settings.entity';

@Injectable()
export class SettingsService {
    constructor(private prisma: PrismaService) { }

    async setProcessingTime(time: number): Promise<void> {
        try {
            const serviceEntity = new SettingsEntity(this.prisma);
            await serviceEntity.setProcessingTime(time);
        } catch (error) {
            console.error('Error creating ticket:', error);
            throw new Error('Could not create ticket. Please try again later.');
        }
    }

    async setWorkTime(start: string, end: string): Promise<void> {
        try {
            const serviceEntity = new SettingsEntity(this.prisma);
            await serviceEntity.setWorkTime(start, end);
        } catch (error) {
            console.error('Error creating ticket:', error);
            throw new Error('Could not create ticket. Please try again later.');
        }
    }
}
