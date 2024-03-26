import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsDateString, IsNotEmpty, IsInt } from 'class-validator';

export class FindAllRecordByMachineAndDateTimeDto {
  @ApiProperty({ description: 'Filter record by machine ID', example: 1 })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  machineId: number;

  @ApiPropertyOptional({
    description: 'Filter records by start date and time',
    example: '2024-03-15T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @ApiPropertyOptional({
    description: 'Filter records by end date and time',
    example: '2024-03-25T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  endTime?: string;
}
