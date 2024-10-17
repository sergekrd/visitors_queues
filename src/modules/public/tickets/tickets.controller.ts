import { Body, Controller,  Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { TicketsService } from './tickets.service';

@Controller()
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

  @Post('/:id')
    createTicket(
    @Param('id', ParseUUIDPipe) serviceId: string,
    ): Promise<{ service: string, ticket: number }> {
        return this.ticketsService.createTicket(serviceId);
    }

  @Post('/:id/close')
  closeTicket(
    @Param('id', ParseUUIDPipe) serviceId: string,
    @Body('reasonId') reasonId: number
  ): Promise<{ service: string, ticket: number, nextTicket: number }> {
      return this.ticketsService.closeTicket(serviceId, reasonId);
  }
}
