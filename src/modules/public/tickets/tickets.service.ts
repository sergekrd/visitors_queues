import * as moment from 'moment';
import { Injectable } from '@nestjs/common';

import { ServicesEntity } from 'src/entities/service.entity';
import { TicketsEntity } from 'src/entities/ticket.entity';
import { PrismaService } from '@prisma/prisma.service';
import { SettingsEntity } from '@entities/settings.entity';

@Injectable()
export class TicketsService {
    constructor(private prisma: PrismaService) { }

    private ticketTimers: Map<string, NodeJS.Timeout> = new Map();

    async initializeTimers(): Promise<void> {
        const servicesEntity = new ServicesEntity(this.prisma);
        const services = await servicesEntity.getAllServices();
        const ticketEntity = new TicketsEntity(this.prisma);
        services.forEach(async service => {
            const currentTicket = await ticketEntity.getCurrentTicket(service.id);
            if (currentTicket) {
                const diff = moment(currentTicket.end_time).diff(moment());
                this.setTicketCloseTimer(currentTicket.service_id, diff);
            }
        });
    }

    private async setTicketCloseTimer(serviceId: string, delay: number = 0): Promise<void> {
        if (!delay) {
            const settingsEntity = new SettingsEntity(this.prisma);
            const settings = await settingsEntity.get();
            delay = settings.processing_time * 60 * 1000;
        }
        const timerId = setTimeout(async () => {
            await this.closeTicket(serviceId, 1);
        }, delay);

        this.ticketTimers.set(serviceId, timerId);
    }

    async createTicket(serviceId: string): Promise<{ service: string, ticket: number }> {
        try {
            const serviceEntity = new ServicesEntity(this.prisma);
            const service = await serviceEntity.getService(serviceId);

            if (!service) {
                const services = await serviceEntity.getAllServices();
                throw new Error(`Service with ID ${serviceId} not found, servicesIds: ${services.
                    map(({ id }) => id)} `);
            }
            const ticketEntity = new TicketsEntity(this.prisma);
            const lastTicket = await ticketEntity.getLastTicket(serviceId);
            const startTime = lastTicket && lastTicket.end_time > moment().toDate()
                ? lastTicket.end_time
                : moment().toDate();

            const ticketNumber = await ticketEntity.getCurrentTodayNumber();

            const settingsEntity = new SettingsEntity(this.prisma);
            const settings = await settingsEntity.get();
            const endTime = moment(startTime).add(settings.processing_time, 'minute').toDate();
            const ticket = await ticketEntity.createTicket(serviceId, startTime, endTime, ticketNumber,);

            if (!this.ticketTimers.has(serviceId)) {
                this.setTicketCloseTimer(serviceId);
            }
            return { service: service.name, ticket: ticket.today_number };
        } catch (error) {
            console.error('Error creating ticket:', error.message);
            return error.message;
        }
    }

    async closeTicket(serviceId: string, reasonId: number): Promise<{
        service: string,
        ticket: number, nextTicket: number
    }> {
        try {
            const serviceEntity = new ServicesEntity(this.prisma);
            const service = await serviceEntity.getService(serviceId);

            if (!service) {
                throw new Error(`Service with ID ${serviceId} not found`);
            }
            const ticketEntity = new TicketsEntity(this.prisma);
            const currentTicket = await ticketEntity.getCurrentTicket(serviceId);
            if (!currentTicket) {
                throw new Error('No tickets at work');
            }
            const diff = moment(currentTicket.end_time).diff(moment());
            await ticketEntity.closeTicket(currentTicket.id, reasonId);
            if (diff > 0) await ticketEntity.decreaseTicketTimes(diff);
            const nextTicket = await ticketEntity.getCurrentTicket(serviceId);
            if (!nextTicket) {
                const result = {
                    service: service.name,
                    ticket: currentTicket.today_number,
                    nextTicket: 0
                };
                const output = JSON.stringify(result, null, 2);
                process.stdout.write(output + '\n');
                return result;
            }
            this.ticketTimers.delete(serviceId);
            this.setTicketCloseTimer(serviceId);
            const result = {
                service: service.name,
                ticket: currentTicket.today_number,
                nextTicket: nextTicket.today_number
            };
            const output = JSON.stringify(result, null, 2);
            process.stdout.write(output + '\n');
            return result;
        } catch (error) {
            console.error('Error closing ticket:', error);
            throw new Error('Could not close ticket. Please try again later.');
        }
    }
}
