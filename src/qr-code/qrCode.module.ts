import { Module } from '@nestjs/common';
import { QrCodeService } from './qrCode.service';
import { PlcCommunicationModule } from 'src/plc-communication/plc-communication.module';
import { Qrcode } from './entities/qrCode.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QrCodeController } from './qrCode.controller';
import { MesModule } from 'src/mes/mes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Qrcode]),
    PlcCommunicationModule,
    MesModule,
  ],
  controllers: [QrCodeController],
  providers: [QrCodeService],
  exports: [QrCodeService],
})
export class QrcodeModule {}
