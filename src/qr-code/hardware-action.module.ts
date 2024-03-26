import { Module } from '@nestjs/common';
import { HardwareActionService } from './hardware-action.service';
import { PlcCommunicationModule } from 'src/plc-communication/plc-communication.module';
import { Qrcode } from './entities/qrCode.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HardwareActionController } from './hardware-action.controller';
import { Rfid } from './entities/rfid.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Qrcode, Rfid]), PlcCommunicationModule],
  controllers: [HardwareActionController],
  providers: [HardwareActionService],
  exports: [HardwareActionService],
})
export class HardwareActionModule {}
