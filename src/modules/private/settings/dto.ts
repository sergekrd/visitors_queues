import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class WorkTimeDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: 'start must be a valid time in format HH:MM',
  })
      start: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: 'end must be a valid time in format HH:MM',
  })
      end: string;
}
