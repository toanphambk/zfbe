import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Validate } from 'class-validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';

export class CreateMachineDto {
  @ApiProperty({ example: '12345' })
  @IsNotEmpty()
  @Validate(IsNotExist, ['Machine', 'systemID'], {
    message: 'System ID already exists',
  })
  systemID: string;

  @ApiProperty({ example: 'L001' })
  @IsNotEmpty()
  lineID: string;

  @ApiProperty({ example: 'Station 1' })
  @Validate(IsNotExist, ['Machine', 'stationName'], {
    message: 'Station Name already exists',
  })
  @IsNotEmpty()
  stationName: string;

  @ApiProperty({ example: 'S001' })
  @Validate(IsNotExist, ['Machine', 'stationID'], {
    message: 'Station ID already exists',
  })
  @IsNotEmpty()
  stationID: string;

  @ApiProperty({ example: 'machine Description' })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '192.168.1.1' })
  @Validate(IsNotExist, ['Machine', 'ipAddress'], {
    message: 'ip Address already exists',
  })
  @IsNotEmpty()
  ip: string;
}
