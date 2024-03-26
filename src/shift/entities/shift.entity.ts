import { Machine } from 'src/machine/entities/machine.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity()
export class Shift {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the shift',
  })
  id: number;

  @Column()
  @ApiProperty({ example: 'Morning Shift', description: 'Name of the shift' })
  shiftName: string;

  @Column()
  @ApiProperty({ example: '08:00', description: 'Start time of the shift' })
  startTime: string;

  @Column()
  @ApiProperty({ example: '16:00', description: 'End time of the shift' })
  endTime: string;

  @Exclude()
  @ManyToOne(() => Machine, (machine) => machine.shifts)
  machine: Machine;

  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date;
}
