import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PlcCommunicationService } from 'src/plc-communication/plc-communication.service';
import { CreateQrCodeDto } from './dto/create-qr-code.dto';
import { Qrcode } from './entities/qrCode.entity';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import {
  Configuration,
  Payload,
} from 'src/plc-communication/interface/plc-communication.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MesService } from 'src/mes/mes.service';
import { log } from 'console';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';

export type BarCode =
  | 'barcodeData'
  | 'barcodeFlag'
  | 'mesReadFlag'
  | 'mesReadDone';

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
    mesReadFlag: {
      address: 'DB46,INT0.1',
      type: 'READ_WRITE',
    },
    mesReadDone: {
      address: 'DB46,INT10.1',
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
    private mesService: MesService,
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

  async readMesData() {
    try {
      const data = await this.mesService.readDataAndExportXml();
      await this.plcCommunicationService.writeBlock(['mesReadFlag'], [0]);
      await this.plcCommunicationService.writeBlock(['mesReadFlag'], [0]);
      console.log(data);

      // Check if 'E:\data' directory exists, create it if not
      const dirPath = 'E:\\data';
      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
      }

      // Save xmlData as file
      const filePath = path.join(dirPath, data.filename);
      writeFileSync(filePath, data.xmlData);
    } catch (error) {
      await this.plcCommunicationService.writeBlock(['mesReadFlag'], [1]);
      console.error(error);
    }
  }

  @OnEvent('dataChange')
  handleOrderCreatedEvent({ data, key, oldVal, val }: Payload<BarCode>) {
    if (oldVal == undefined) {
      return;
    }
    if (key == 'barcodeFlag' && val == 1) {
      this.readMesData;
    }
  }
}
