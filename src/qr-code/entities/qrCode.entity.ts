import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Machine } from 'src/machine/entities/machine.entity';

@Entity()
export class Qrcode {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the machine',
  })
  id: number;

  @Column({ name: 'code' })
  @ApiProperty({
    example: 'abc123',
    description: 'barcode scan by the system',
  })
  code: string;

  @ManyToOne(() => Machine, (machine) => machine.qrcodes)
  @ApiProperty({
    type: () => Machine,
    description: 'The machine associated with this QR code',
  })
  machine: Machine;

  @CreateDateColumn()
  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: 'Scan date of the code',
  })
  createdAt: Date;
}
