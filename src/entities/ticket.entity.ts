
import { Injectable } from '@nestjs/common';
import { tickets } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import * as moment from 'moment';

@Injectable()
export class TicketsEntity {
    constructor(private prisma: PrismaService) { }

    async getAllTickets(): Promise<tickets[]> {
        return this.prisma.tickets.findMany();
    }

    async getTicketById(ticketId: number): Promise<tickets> {
        return this.prisma.tickets.findUnique({ where: { id: ticketId } });
    }

    async getLastTicket(serviceId: string): Promise<tickets> {
        return this.prisma.tickets.findFirst({
            where: {
                service_id: serviceId,
                start_time: { gte: moment().startOf('day').toDate() },
                end_time: { lte: moment().endOf('day').toDate() }
            },
            orderBy: { start_time: 'desc' }
        });
    }

    async getCurrentTicket(serviceId: string): Promise<tickets> {
        return this.prisma.tickets.findFirst({
            where: {
                service_id: serviceId,
                end_reason_id: null
            },
            orderBy: { start_time: 'asc' }
        });
    }

    async getCurrentTodayNumber(): Promise<number> {
        const todayStart = moment().startOf('day').toDate();

        const ticketCount = await this.prisma.tickets.count({
            where: {
                createdAt: { gte: todayStart },
            },
        });

        return ticketCount + 1;
    }

    async createTicket(
        serviceId: string,
        startTime: Date,
        endTime: Date,
        todayNumber: number
    ): Promise<tickets> {
        return this.prisma.tickets.create({
            data: {
                start_time: startTime,
                end_time: endTime,
                services: { connect: { id: serviceId } },
                today_number: todayNumber
            },
        });
    }

    async closeTicket(
        ticketId: number,
        reasonId: number
    ): Promise<tickets> {
        return this.prisma.tickets.update({
            data: {
                end_time: moment().toDate(),
                reasons: { connect: { id: reasonId } },
            },
            where: { id: ticketId }
        });
    }

    async decreaseTicketTimes(ms: number): Promise<void> {
        const currentTime = moment().toDate();
        const seconds = ms / 1000;
        await this.prisma.$executeRaw`
      UPDATE tickets
      SET 
        start_time = start_time - INTERVAL '${seconds} seconds',
        end_time = end_time - INTERVAL '${seconds} seconds'
      WHERE 
        start_time > ${currentTime};
    `;
    }
}
