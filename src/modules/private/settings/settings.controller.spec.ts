import { Test, TestingModule } from '@nestjs/testing';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { WorkTimeDto } from './dto';

describe('SettingsController', () => {
    let controller: SettingsController;
    let service: SettingsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SettingsController],
            providers: [
                {
                    provide: SettingsService,
                    useValue: {
                        setProcessingTime: jest.fn(),
                        setWorkTime: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<SettingsController>(SettingsController);
        service = module.get<SettingsService>(SettingsService);
    });

    it('should call setProcessingTime with correct time', async () => {
        const time = 30;
        await controller.setProcessingTime(time);
        expect(service.setProcessingTime).toHaveBeenCalledWith(time);
    });

    it('should call setWorkTime with correct start and end time', async () => {
        const workTimeDto: WorkTimeDto = { start: '09:00', end: '18:00' };
        await controller.setWorkTime(workTimeDto);
        expect(service.setWorkTime).toHaveBeenCalledWith(workTimeDto.start, workTimeDto.end);
    });
});
