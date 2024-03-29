import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, Validate } from 'class-validator';
import { Machine } from 'src/machine/entities/machine.entity';
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

  @ApiProperty({
    example: { id: 1 },
    type: () => PartialType<Machine>,
    description: 'The machine where the shift is assigned',
  })
  @IsNotEmpty()
  @Validate(IsRecordExist, ['Machine'])
  machine: DeepPartial<Machine>;
}
