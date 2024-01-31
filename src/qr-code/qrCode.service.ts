import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PlcCommunicationService } from 'src/plc-communication/plc-communication.service';
import { CreateQrCodeDto } from './dto/create-qr-code.dto';
import { Qrcode } from './entities/qrCode.entity';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Configuration } from 'src/plc-communication/interface/plc-communication.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MesService } from 'src/mes/mes.service';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { log } from 'console';

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
    ) => PlcCommunicationService<BarCode>,
    private mesService: MesService,
    private eventEmitter: EventEmitter2,
  ) {
    void this.initPlcService();
  }

  private async initPlcService() {
    try {
      this.plcCommunicationService = this.plcServiceFactory(this.eventEmitter);
      this.plcCommunicationService.setConfig(configuration);
      await this.checkConnectionAndInitialize();

      await this.plcCommunicationService.addDataBlock();
      await this.plcCommunicationService.activeCycleScan();
    } catch (error) {
      log(error);
    }
  }

  private async checkConnectionAndInitialize() {
    const isConnected = await this.plcCommunicationService.initConnection();

    if (!isConnected) {
      await new Promise<void>((resolve) => setTimeout(resolve, 1000));
      await this.checkConnectionAndInitialize();
    }
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

  private async readMesDataEportXml() {
    try {
      const { xmlData, fileName } = await this.mesService.getMesData({
        id: 1,
      });
      await this.plcCommunicationService.writeBlock(['mesReadFlag'], [0]);
      await this.plcCommunicationService.writeBlock(['mesReadDone'], [0]);

      const dirPath = 'E:\\data';
      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
      }

      const filePath = join(dirPath, fileName);
      writeFileSync(filePath, xmlData);
    } catch (error) {
      await this.plcCommunicationService.writeBlock(['mesReadDone'], [1]);
      console.error(error);
    }
  }

  @OnEvent('dataChange')
  handleOrderCreatedEvent({ key, val }) {
    if (key == 'mesReadFlag' && val == 1) {
      void this.readMesDataEportXml();
    }
  }
}
