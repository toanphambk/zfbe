import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsInt } from 'class-validator';

export class GetDailyLineChartDataDto {
  @ApiProperty({ description: 'Filter record by machine ID', example: 1 })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  machineId: number;

  @ApiProperty({ description: 'time of day', example: '2024-03-15T00:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  time: string;
}
