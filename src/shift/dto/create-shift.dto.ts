import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Validate } from 'class-validator';
import { ProductionLine } from 'src/production-line/entities/production-line.entity';
import { IsRecordExist } from 'src/utils/validators/is-record-exist.validator';
import { DeepPartial } from 'typeorm';

export class CreateShiftDto {
  @ApiProperty({ example: 'Shift 1' })
  @IsNotEmpty()
  shiftName: string;

  @ApiProperty({ example: '08:00' })
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ example: '16:00' })
  @IsNotEmpty()
  endTime: string;

  @ApiProperty({ example: { id: 1 } })
  @IsNotEmpty()
  @Validate(IsRecordExist, ['ProductionLine'])
  productionLine: DeepPartial<ProductionLine>;
}
