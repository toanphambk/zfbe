import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateQrCodeDto {
  @ApiProperty({
    example: 'abc123',
    description: 'barcode scan by the system',
  })
  @IsNotEmpty()
  code: string;
}
