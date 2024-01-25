import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Qrcode {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the production line',
  })
  id: number;

  @Column({ name: 'code' })
  @ApiProperty({
    example: 'abc123',
    description: 'barcode scan by the system',
  })
  code: string;

  @CreateDateColumn()
  @Exclude()
  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: 'Scan date of the code',
  })
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
