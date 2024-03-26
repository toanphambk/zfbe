import { ApiProperty } from '@nestjs/swagger';
import { Machine } from 'src/machine/entities/machine.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { RecordData } from './recordData.entity';

@Entity()
export class Record {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty({
    example: 'BM0624031114090',
    description: 'Serial number of the record',
  })
  moduleSerialNo: string;

  @Column()
  @ApiProperty({
    example: '20240311140903',
    description: 'Date time of the record',
  })
  systemDt: string;

  @Column()
  @ApiProperty({
    example: 1,
    description: 'Result of the record: 1:ok, 2:ng',
  })
  result: number;

  @ApiProperty({
    description: 'The machine of the record',
    type: () => Machine,
  })
  @ManyToOne(() => Machine, (machine) => machine.records)
  machine: Machine;

  @ApiProperty({
    description: 'The record data of the record',
    type: () => [RecordData],
  })
  @OneToMany(() => RecordData, (recordData) => recordData.record)
  recordDatas: RecordData[];

  @CreateDateColumn()
  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: 'Creation date of the machine record',
  })
  createdAt: Date;
}
