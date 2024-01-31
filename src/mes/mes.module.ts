import { Module } from '@nestjs/common';
import { MesService } from './mes.service';
import { PlcCommunicationModule } from 'src/plc-communication/plc-communication.module';
import { ProductionLineModule } from 'src/production-line/production-line.module';

@Module({
  imports: [PlcCommunicationModule, ProductionLineModule],
  providers: [MesService],
  exports: [MesService],
})
export class MesModule {}
