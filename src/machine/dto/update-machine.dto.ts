import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateMachineDto {
  @ApiProperty({ example: '12345' })
  @IsOptional()
  systemID?: string;

  @ApiProperty({ example: 'L001' })
  @IsOptional()
  lineID?: string;

  @ApiProperty({ example: 'Station 1' })
  @IsOptional()
  stationName?: string;

  @ApiProperty({ example: 'S001' })
  @IsOptional()
  stationID?: string;

  @ApiProperty({ example: 'Updated machine Description' })
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '192.168.1.1' })
  @IsOptional()
  ip?: string;
}
