import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateShiftDto {
  @ApiProperty({ example: 'Shift 1', required: false })
  @IsOptional()
  shiftName?: string;

  @ApiProperty({ example: '08:00', required: false })
  @IsOptional()
  startTime?: string;

  @ApiProperty({ example: '16:00', required: false })
  @IsOptional()
  endTime?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  productionLineId?: number;
}
