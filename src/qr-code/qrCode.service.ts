import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PlcCommunicationService } from 'src/plc-communication/plc-communication.service';
import { CreateQrCodeDto } from './dto/create-qr-code.dto';
import { Qrcode } from './entities/qrCode.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Configuration } from 'src/plc-communication/interface/plc-communication.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export type BarCode = 'barcodeData' | 'barcodeFlag';

const configuration: Configuration<BarCode> = {
  blockSetting: {
    barcodeData: {
      address: 'DB47,S2.40',
      type: 'WRITE_ONLY',
    },
    barcodeFlag: {
      address: 'DB47,INT0.1',
      type: 'READ_WRITE',
    },
  },
  ip: '192.168.0.1',
};

@Injectable()
export class QrCodeService {
  private plcCommunicationService: PlcCommunicationService<BarCode>;

  constructor(
    @InjectRepository(Qrcode)
    private repo: Repository<Qrcode>,
    @Inject('PlcCommunicationServiceFactory')
    private plcServiceFactory: (
      eventEmitter: EventEmitter2,
    ) => PlcCommunicationService<any>,
  ) {
    void this.initPlcService();
  }

  async initPlcService() {
    this.plcCommunicationService = this.plcServiceFactory(new EventEmitter2());
    this.plcCommunicationService.setConfig(configuration);
    await this.plcCommunicationService.initConnection();
    await this.plcCommunicationService.addDataBlock();
    await this.plcCommunicationService.activeCycleScan();
  }

  async create(createDto: CreateQrCodeDto): Promise<Qrcode> {
    const { state } = this.plcCommunicationService.getState();
    const { barcodeFlag } = this.plcCommunicationService.getData();
    try {
      if (state !== 'READY' || barcodeFlag) {
        throw new InternalServerErrorException('hardware is not ready');
      }
      await this.plcCommunicationService.writeBlock(
        ['barcodeData', 'barcodeFlag'],
        [createDto.code, 1],
      );
      await this.plcCommunicationService.writeBlock(['barcodeFlag'], [1]);
      const qrCode = this.repo.create(createDto);
      return this.repo.save(qrCode);
    } catch (error) {
      throw new InternalServerErrorException('write to plc error');
    }
  }
}
