import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import { ServicesEntity } from 'src/entities/service.entity';
import { TicketsEntity } from 'src/entities/ticket.entity';
import * as moment from 'moment';
import { tickets } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';

jest.mock('src/entities/service.entity');
jest.mock('src/entities/ticket.entity');

describe('TicketsService', () => {
    let service: TicketsService;
    let prismaService: PrismaService;
    const mockService = {
        id: 'service1',
        name: 'Service 1', createdAt: moment('2024-10-16 20:52:48+03').toDate()
    };
    const mockTicket = (id: number, todayNumber: number): tickets => {
        return {
            id,
            today_number: todayNumber,
            start_time: moment().toDate(),
            end_time: moment().toDate(),
            createdAt: moment('2024-10-16 20:52:48+03').toDate(),
            updatedAt: moment('2024-10-16 20:52:48+03').toDate(),
            service_id: 'service1',
            end_reason_id: null
        };


    };
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TicketsService,
                {
                    provide: PrismaService,
                    useValue: {
                        tickets: {
                            findMany: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<TicketsService>(TicketsService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('initializeTimers', () => {
        it('should initialize timers for tickets without end reason', async () => {
            const mockTickets = [
                mockTicket(1, 1),
                mockTicket(2, 2)
            ];

            jest.spyOn(prismaService.tickets, 'findMany').mockResolvedValue(mockTickets);

            await service.initializeTimers();

            expect(prismaService.tickets.findMany).toHaveBeenCalledWith({
                where: { end_reason_id: null },
            });
            expect(service['ticketTimers'].size).toBe(2);
        });
    });

    describe('createTicket', () => {
        it('should create a ticket and set a timer', async () => {
            jest.spyOn(ServicesEntity.prototype, 'getService').mockResolvedValue(mockService);
            jest.spyOn(TicketsEntity.prototype, 'getLastTicket').mockResolvedValue(null);
            jest.spyOn(TicketsEntity.prototype, 'getCurrentTodayNumber').mockResolvedValue(1);
            jest.spyOn(TicketsEntity.prototype, 'createTicket').mockResolvedValue(mockTicket(1, 1));

            const result = await service.createTicket('service1');

            expect(result).toEqual({ service: 'Service 1', ticket: 1 });
            expect(service['ticketTimers'].has('service1')).toBe(true);
        });

        it('should throw an error if the service is not found', async () => {
            jest.spyOn(ServicesEntity.prototype, 'getService').mockResolvedValue(null);

            await expect(service.createTicket('invalid-service'))
                .rejects.toThrowError('Service with ID invalid-service not found');
        });
    });

    describe('closeTicket', () => {
        it('should close the current ticket and set a timer for the next ticket', async () => {
            jest.spyOn(ServicesEntity.prototype, 'getService').mockResolvedValue(mockService);
            jest.spyOn(TicketsEntity.prototype, 'getCurrentTicket').mockResolvedValueOnce(mockTicket(1,1));
            jest.spyOn(TicketsEntity.prototype, 'closeTicket').mockResolvedValue(null);
            jest.spyOn(TicketsEntity.prototype, 'decreaseTicketTimes').mockResolvedValue(null);
            jest.spyOn(TicketsEntity.prototype, 'getCurrentTicket').mockResolvedValueOnce(mockTicket(2,2));

            const result = await service.closeTicket('service1', 1);

            expect(result).toEqual({ service: 'Service 1', ticket: 1, nextTicket: 2 });
            expect(service['ticketTimers'].has('service1')).toBe(true);
        });

        it('should throw an error if the service is not found', async () => {
            jest.spyOn(ServicesEntity.prototype, 'getService').mockResolvedValue(null);

            await expect(service.closeTicket('invalid-service', 1))
                .rejects.toThrowError('Could not create ticket. Please try again later.');
        });
    });
});
