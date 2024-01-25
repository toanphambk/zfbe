import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PlcCommunicationService } from 'src/plc-communication/plc-communication.service';
import { CreateQrCodeDto } from './dto/create-qrCode.dto';
import { Qrcode } from './entities/qrCode.entity';
import { ServiceState } from 'src/plc-communication/interface/systemState.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class QrCodeService {
  constructor(
    @InjectRepository(Qrcode)
    private repo: Repository<Qrcode>,
    private plcCommunicationService: PlcCommunicationService,
  ) {}
  async create(createDto: CreateQrCodeDto): Promise<Qrcode> {
    const { state, barcodeFlag } = this.plcCommunicationService.getData();
    try {
      if (state !== ServiceState.READY || barcodeFlag) {
        throw new InternalServerErrorException('hardware is not ready');
      }
      await this.plcCommunicationService.writeBlock(
        ['barcodeData', 'barcodeFlag'],
        [createDto.code, 1],
      );
      const qrCode = this.repo.create(createDto);
      return this.repo.save(qrCode);
    } catch (error) {
      throw new InternalServerErrorException('write to plc error');
    }
  }
}
