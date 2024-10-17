
import { Injectable } from '@nestjs/common';
import { settings } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';


@Injectable()
export class SettingsEntity {
    constructor(private prisma: PrismaService) { }

    async setProcessingTime(time: number): Promise<settings> {
        const setting = await this.get();
        return this.prisma.settings.update({ data: { processing_time: time }, where: { id: setting.id } });
    }
    async setWorkTime(start: string, end: string): Promise<settings> {
        const setting = await this.get();
        return this.prisma.settings.update({ data: { start_work: start, end_work: end }, where: { id: setting.id } });
    }

    async get(): Promise<settings> {
        return this.prisma.settings.findFirst();
    }

}
