import { Body, Controller, Patch } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { WorkTimeDto } from './dto';

@Controller()
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

  @Patch('/settings/processingTime')
    setProcessingTime(
    @Body('time') time: number,
    ): Promise<void> {
        return this.settingsService.setProcessingTime(time);
    }

  @Patch('/settings/workTime')
  setWorkTime(
    @Body() workTimeDto: WorkTimeDto,
  ): Promise<void> {
      const { start, end } = workTimeDto;
      return this.settingsService.setWorkTime(start, end);
  }
}
