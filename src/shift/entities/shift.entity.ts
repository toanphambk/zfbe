import { ProductionLine } from 'src/production-line/entities/production-line.entity';
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

  @ManyToOne(() => ProductionLine, (productionLine) => productionLine.shifts)
  // @ApiProperty({
  //   type: () => ProductionLine,
  //   description: 'The production line associated with this shift',
  // })
  productionLine: ProductionLine;

  @CreateDateColumn()
  @Exclude()
  // @ApiProperty({
  //   example: '2021-01-01T00:00:00.000Z',
  //   description: 'Creation date of the production line record',
  // })
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  // @ApiProperty({
  //   example: '2021-01-01T00:00:00.000Z',
  //   description: 'Last update date of the production line record',
  // })
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  // @ApiProperty({
  //   example: '2021-01-01T00:00:00.000Z',
  //   description: 'Deletion date of the production line record',
  //   nullable: true,
  // })
  deletedAt: Date;
}
