import { Module } from '@nestjs/common';

import { SettingsModule } from './modules/private/settings/settings.module';
import { TicketsModule } from './modules/public/tickets/tickets.module';

@Module({
    imports: [SettingsModule, TicketsModule],
    controllers: [],
    providers: [],
})
export class AppModule { }
