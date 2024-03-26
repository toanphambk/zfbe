import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Record } from './record.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class RecordData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty({ example: 'OPID', description: 'The OPID of the record data' })
  OPID: string;

  @Column({ type: 'int' })
  @ApiProperty({ example: 10, description: 'The value of CurDta_QD01' })
  CurDta_QD01: number;

  @Column({ type: 'int' })
  @ApiProperty({ example: 20, description: 'The value of CurDta_QD02' })
  CurDta_QD02: number;

  @Column({ type: 'int' })
  @ApiProperty({ example: 30, description: 'The value of CurDta_QD03' })
  CurDta_QD03: number;

  @Column({ type: 'int' })
  @ApiProperty({ example: 40, description: 'The value of CurDta_QD04' })
  CurDta_QD04: number;

  @Column({ type: 'int' })
  @ApiProperty({ example: 50, description: 'The value of PrvDta1_QD01' })
  PrvDta1_QD01: number;

  @Column({ type: 'int' })
  @ApiProperty({ example: 60, description: 'The value of PrvDta1_QD02' })
  PrvDta1_QD02: number;

  @Column({ type: 'int' })
  @ApiProperty({ example: 70, description: 'The value of PrvDta1_QD03' })
  PrvDta1_QD03: number;

  @Column({ type: 'int' })
  @ApiProperty({ example: 80, description: 'The value of PrvDta1_QD04' })
  PrvDta1_QD04: number;

  @Column({ type: 'int' })
  @ApiProperty({ example: 90, description: 'The value of PrvDta2_QD01' })
  PrvDta2_QD01: number;

  @Column({ type: 'int' })
  @ApiProperty({ example: 100, description: 'The value of PrvDta2_QD02' })
  PrvDta2_QD02: number;

  @Column({ type: 'int' })
  @ApiProperty({ example: 110, description: 'The value of PrvDta2_QD03' })
  PrvDta2_QD03: number;

  @Column({ type: 'int' })
  @ApiProperty({ example: 120, description: 'The value of PrvDta2_QD04' })
  PrvDta2_QD04: number;

  @Column({ type: 'int' })
  @ApiProperty({ example: 3, description: 'The value of TryCnt' })
  TryCnt: number;

  @Column({ type: 'int' })
  @ApiProperty({ example: 5, description: 'The value of RT' })
  RT: number;

  @Column({ type: 'int' })
  @ApiProperty({ example: 1, description: 'The value of OType' })
  OType: number;

  @Column({ type: 'int' })
  @ApiProperty({ example: 10, description: 'The minimum value of QD01' })
  QD01_Min: number;

  @Column({ type: 'int' })
  @ApiProperty({ example: 100, description: 'The maximum value of QD01' })
  QD01_Max: number;

  @Column({ type: 'int' })
  @ApiProperty({ example: 20, description: 'The minimum value of QD02' })
  QD02_Min: number;

  @Column({ type: 'int' })
  @ApiProperty({ example: 200, description: 'The maximum value of QD02' })
  QD02_Max: number;

  @Column({ type: 'int' })
  @ApiProperty({ example: 30, description: 'The minimum value of QD03' })
  QD03_Min: number;

  @Column({ type: 'int' })
  @ApiProperty({ example: 300, description: 'The maximum value of QD03' })
  QD03_Max: number;

  @Column({ type: 'int' })
  @ApiProperty({ example: 40, description: 'The minimum value of QD04' })
  QD04_Min: number;

  @Column({ type: 'int' })
  @ApiProperty({ example: 400, description: 'The maximum value of QD04' })
  QD04_Max: number;

  @Column()
  @ApiProperty({ example: 'John Doe', description: 'The name of the operator' })
  OperatorName: string;

  @Column()
  @ApiProperty({ example: 'Some text', description: 'The additional text' })
  OPTxt: string;

  @Exclude()
  @ManyToOne(() => Record, (record) => record.recordDatas)
  record: Record;
}
