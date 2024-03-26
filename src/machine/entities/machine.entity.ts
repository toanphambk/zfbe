import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Shift } from 'src/shift/entities/shift.entity';
import { MachineEvent } from 'src/monitor/entities/machineEvent.entity';
import { Qrcode } from 'src/qr-code/entities/qrCode.entity';
import { Rfid } from 'src/qr-code/entities/rfid.entity';
import { Record } from 'src/mes/entity/record.entity';

@Entity()
export class Machine {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the machine',
  })
  id: number;

  @Column({ name: 'SystemID' })
  @ApiProperty({
    example: 'SYS001',
    description: 'System ID of the machine',
  })
  systemID: string;

  @Column({ name: 'LineID' })
  @ApiProperty({
    example: 'LINE01',
    description: 'Line ID of the machine',
  })
  lineID: string;

  @Column({ name: 'StationName' })
  @ApiProperty({
    example: 'Station 1',
    description: 'Name of the station in the machine',
  })
  stationName: string;

  @Column({ name: 'StationID' })
  @ApiProperty({
    example: 'STN01',
    description: 'Station ID in the machine',
  })
  stationID: string;

  @Column()
  @ApiProperty({
    example: 'This line produces widgets',
    description: 'Description of the machine',
  })
  description: string;

  @Column({ name: 'ipAddress' })
  @ApiProperty({
    example: '192.168.1.1',
    description: 'IP address of the machine',
  })
  ip: string;

  @Exclude()
  @OneToMany(() => Shift, (shift) => shift.machine)
  shifts: Shift[];

  @Exclude()
  @OneToMany(() => Record, (record) => record.machine)
  records: Record[];

  @Exclude()
  @OneToMany(() => Qrcode, (qrcode) => qrcode.machine)
  qrcodes: Qrcode[];

  @Exclude()
  @OneToMany(() => Rfid, (rfid) => rfid.machine)
  rfids: Rfid[];

  @Exclude()
  @OneToMany(() => MachineEvent, (machineEvents) => machineEvents.machine)
  machineEvents: MachineEvent[];

  @Exclude()
  @CreateDateColumn()
  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: 'Creation date of the machine record',
  })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: 'Last update date of the machine record',
  })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn()
  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: 'Deletion date of the machine record',
    nullable: true,
  })
  deletedAt: Date;
}
