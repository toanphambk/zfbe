import { Module } from '@nestjs/common';
import { MesService } from './mes.service';
import { PlcCommunicationModule } from 'src/plc-communication/plc-communication.module';
import { MachineModule } from 'src/machine/machine.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordData } from './entity/recordData.entity';
import { Record } from './entity/record.entity';
import { MesController } from './mes.controller';

@Module({
  imports: [
    PlcCommunicationModule,
    MachineModule,
    TypeOrmModule.forFeature([RecordData, Record]),
  ],
  providers: [MesService],
  controllers: [MesController],
  exports: [MesService],
})
export class MesModule {}
