import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PlcCommunicationService } from 'src/plc-communication/plc-communication.service';
import { Qrcode } from './entities/qrCode.entity';
import { PlcCommunicationServiceFactory } from 'src/plc-communication/interface/plc-communication.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateQrCodeDto } from './dto/create-qr-code.dto';
import { CreateRFIDDto } from './dto/create-rfid.dto';
import {
  qrCodeConfiguration,
  QrCodeDataType,
  rfidConfiguration,
  RfidDataType,
} from './interface/hardware-action.interface';
import { Rfid } from './entities/rfid.entity';

@Injectable()
export class HardwareActionService {
  constructor(
    @InjectRepository(Qrcode)
    private qrcodeRepository: Repository<Qrcode>,
    @InjectRepository(Rfid)
    private rfidRepository: Repository<Rfid>,
    @Inject('PlcCommunicationServiceFactory')
    private plcServiceFactory: PlcCommunicationServiceFactory<any>,
  ) {}

  async createQrCode(createDto: CreateQrCodeDto): Promise<Qrcode> {
    let qrCodeConn = {} as PlcCommunicationService<QrCodeDataType>;
    try {
      const { machine } = createDto;
      const config = { ...qrCodeConfiguration, machine };
      qrCodeConn = this.plcServiceFactory(config);
      await qrCodeConn.initConnection();
      const { connection } = qrCodeConn.getState();
      if (!connection) {
        throw new InternalServerErrorException('CONNECTION ERROR');
      }
      await qrCodeConn.addDataBlock();
      qrCodeConn.activeCycleScan();
      await qrCodeConn.writeBlock(
        ['barcodeData', 'barcodeFlag'],
        [createDto.code, 1],
      );
      qrCodeConn.deactiveCycleScan();
      const qrCode = this.qrcodeRepository.create(createDto);
      return this.qrcodeRepository.save(qrCode);
    } catch (error) {
      throw new InternalServerErrorException('write qrcode error', error);
    } finally {
      await qrCodeConn.connectionCleanUp();
    }
  }

  async createRFID(createDto: CreateRFIDDto): Promise<Rfid> {
    let rfidDataConn = {} as PlcCommunicationService<RfidDataType>;
    try {
      const { machine } = createDto;
      const config = { ...rfidConfiguration, machine };
      rfidDataConn = this.plcServiceFactory(config);
      await rfidDataConn.initConnection();
      const { connection } = rfidDataConn.getState();
      if (!connection) {
        throw new InternalServerErrorException('CONNECTION ERROR');
      }
      rfidDataConn.activeCycleScan();
      await rfidDataConn.addDataBlock();
      await rfidDataConn.writeBlock(
        ['rfidData', 'rfidflag'],
        [createDto.code, 1],
      );
      const rfid = this.rfidRepository.create(createDto);
      return this.rfidRepository.save(rfid);
    } catch (error) {
      throw new InternalServerErrorException('write to plc error');
    } finally {
      await rfidDataConn.connectionCleanUp();
    }
  }
}
