import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, Validate } from 'class-validator';
import { Machine } from 'src/machine/entities/machine.entity';
import { IsRecordExist } from 'src/utils/validators/is-record-exist.validator';

export class CreateRFIDDto {
  @ApiProperty({
    example: 'abc123',
    description: 'rfid scan by the system',
  })
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    example: { id: 1 },
    description: 'The machine where the QR code is generated',
    type: () => PartialType<Machine>,
  })
  @IsNotEmpty()
  @Validate(IsRecordExist, ['Machine'])
  machine: Machine;
}
