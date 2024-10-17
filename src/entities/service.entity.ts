
import { Injectable } from '@nestjs/common';
import { services } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class ServicesEntity {
    constructor(private prisma: PrismaService) { }

    async getAllServices(): Promise<services[]> {
        return this.prisma.services.findMany();
    }

    async createService(name: string): Promise<services> {
        return this.prisma.services.create({
            data: { name },
        });
    }

    async getService(id: string): Promise<services> {
        return this.prisma.services.findUnique({
            where: { id },
        });
    }
}
