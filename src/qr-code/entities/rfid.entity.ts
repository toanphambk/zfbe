import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Machine } from 'src/machine/entities/machine.entity';

@Entity()
export class Rfid {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the RFID tag',
  })
  id: number;

  @Column({ name: 'rfidTag' })
  @ApiProperty({
    example: '00A1B2C3D4',
    description: 'The RFID tag scanned by the system',
  })
  rfidTag: string;

  @ManyToOne(() => Machine, (machine) => machine.rfids)
  @ApiProperty({
    type: () => Machine,
    description: 'The machine associated with this QR code',
  })
  machine: Machine;

  @CreateDateColumn()
  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: 'Scan date of the RFID tag',
  })
  createdAt: Date;
}
