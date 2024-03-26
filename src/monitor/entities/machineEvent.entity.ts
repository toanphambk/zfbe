import { Machine } from 'src/machine/entities/machine.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity()
export class MachineEvent {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the machine event',
  })
  id: number;

  @Column()
  @ApiProperty({
    example: 'Error Event',
    description: 'The name of the machine event',
  })
  eventName: string;

  @ManyToOne(() => Machine, (machine) => machine.machineEvents)
  @ApiProperty({
    type: () => Machine,
    description: 'The machine associated with this machine event',
  })
  machine: Machine;

  @CreateDateColumn()
  @Exclude()
  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: 'Creation date of the machine event record',
  })
  createdAt: Date;

  @DeleteDateColumn()
  @Exclude()
  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: 'Deletion date of the machine event record',
    nullable: true,
  })
  deletedAt: Date;
}
