import { PrismaService } from 'prisma';
import { Injectable } from '@nestjs/common';
import { reasons } from '@prisma/client';

@Injectable()
export class ReasonsEntity {
    constructor(private prisma: PrismaService) { }

    async getAllReasons(): Promise<reasons[]> {
        return this.prisma.reason.findMany();
    }

    async createReason(name: string, description: string): Promise<reasons> {
        return this.prisma.reason.create({
            data: { name, description },
        });
    }

    async getReason(id: number): Promise<reasons> {
        return this.prisma.reason.findUnique({
            where: { id },
        });
    }
}
