import { Module } from '@nestjs/common';
import { MesService } from './mes.service';
import { PlcCommunicationModule } from 'src/plc-communication/plc-communication.module';

@Module({
  imports: [PlcCommunicationModule],
  providers: [MesService],
  exports: [MesService],
})
export class MesModule {}
