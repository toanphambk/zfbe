import { ApiProperty } from '@nestjs/swagger';

export class CreateQrCodeDto {
  @ApiProperty({
    example: 'abc123',
    description: 'barcode scan by the system',
  })
  code: string;
}
