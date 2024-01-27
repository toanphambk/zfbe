import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PlcCommunicationService } from 'src/plc-communication/plc-communication.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as xml2js from 'xml2js';
import {
  BlockInfo,
  Configuration,
} from 'src/plc-communication/interface/plc-communication.interface';
import { log } from 'console';

export type RecordData =
  | 'OPID'
  | 'CurDta_QD01'
  | 'CurDta_QD02'
  | 'CurDta_QD03'
  | 'CurDta_QD04'
  | 'PrvDta1_QD01'
  | 'PrvDta1_QD02'
  | 'PrvDta1_QD03'
  | 'PrvDta1_QD04'
  | 'PrvDta2_QD01'
  | 'PrvDta2_QD02'
  | 'PrvDta2_QD03'
  | 'PrvDta2_QD04'
  | 'TryCnt'
  | 'RT'
  | 'OType'
  | 'QD01_Min'
  | 'QD01_Max'
  | 'QD02_Min'
  | 'QD02_Max'
  | 'QD03_Min'
  | 'QD03_Max'
  | 'QD04_Min'
  | 'QD04_Max'
  | 'OperatorName'
  | 'OPTxt';

const configuration = <Configuration<RecordData>>{
  ip: '192.168.0.1',
};

@Injectable()
export class MesService {
  private plcCommunicationService: PlcCommunicationService<RecordData>;
  private builder = new xml2js.Builder({ headless: true, rootName: 'Data' });
  constructor(
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
    void this.readDataAndExportXml();
  }

  public async readDataAndExportXml() {
    const { connection } = this.plcCommunicationService.getState();
    if (!connection) {
      throw new InternalServerErrorException('CONNECTION ERROR');
    }
    let xmlData = '<Data\n';
    try {
      for (let i = 0; i < 4; i++) {
        configuration.blockSetting = this.generateElementConfig(i);
        this.plcCommunicationService.setConfig(configuration);
        await this.plcCommunicationService.addDataBlock();
        const data = this.plcCommunicationService.getData();
        xmlData += this.formatDataForXml(`QD.DT0${i}`, data) + '\n';
      }
      xmlData += '/>';
      log(xmlData);
      return xmlData;
    } catch (error) {
      throw new Error('Write to PLC error');
    }
  }

  private formatDataForXml(prefix: string, data: any): string {
    return Object.entries(data)
      .map(([key, value]) => {
        return `${prefix}.${key}="${value}"`;
      })
      .join(' ');
  }

  private generateElementConfig(i: number) {
    const baseOffset = 98;
    const elementSize = 158;

    const startOffset = baseOffset + i * elementSize;

    return {
      OPID: {
        address: `DB46,S${startOffset}.5`,
        type: 'READ_ONLY',
      } as BlockInfo,
      CurDta_QD01: {
        address: `DB46,INT${startOffset + 8}.1`,
        type: 'READ_ONLY',
      } as BlockInfo,
      CurDta_QD02: {
        address: `DB46,INT${startOffset + 10}.1`,
        type: 'READ_ONLY',
      } as BlockInfo,
      CurDta_QD03: {
        address: `DB46,INT${startOffset + 12}.1`,
        type: 'READ_ONLY',
      } as BlockInfo,
      CurDta_QD04: {
        address: `DB46,INT${startOffset + 14}.1`,
        type: 'READ_ONLY',
      } as BlockInfo,
      PrvDta1_QD01: {
        address: `DB46,INT${startOffset + 16}.1`,
        type: 'READ_ONLY',
      } as BlockInfo,
      PrvDta1_QD02: {
        address: `DB46,INT${startOffset + 18}.1`,
        type: 'READ_ONLY',
      } as BlockInfo,
      PrvDta1_QD03: {
        address: `DB46,INT${startOffset + 20}.1`,
        type: 'READ_ONLY',
      } as BlockInfo,
      PrvDta1_QD04: {
        address: `DB46,INT${startOffset + 22}.1`,
        type: 'READ_ONLY',
      } as BlockInfo,
      PrvDta2_QD01: {
        address: `DB46,INT${startOffset + 24}.1`,
        type: 'READ_ONLY',
      } as BlockInfo,
      PrvDta2_QD02: {
        address: `DB46,INT${startOffset + 26}.1`,
        type: 'READ_ONLY',
      } as BlockInfo,
      PrvDta2_QD03: {
        address: `DB46,INT${startOffset + 28}.1`,
        type: 'READ_ONLY',
      } as BlockInfo,
      PrvDta2_QD04: {
        address: `DB46,INT${startOffset + 30}.1`,
        type: 'READ_ONLY',
      } as BlockInfo,
      TryCnt: {
        address: `DB46,INT${startOffset + 32}.1`,
        type: 'READ_ONLY',
      } as BlockInfo,
      RT: {
        address: `DB46,INT${startOffset + 34}.1`,
        type: 'READ_ONLY',
      } as BlockInfo,
      OType: {
        address: `DB46,INT${startOffset + 36}.1`,
        type: 'READ_ONLY',
      } as BlockInfo,
      QD01_Min: {
        address: `DB46,INT${startOffset + 38}.1`,
        type: 'READ_ONLY',
      } as BlockInfo,
      QD01_Max: {
        address: `DB46,INT${startOffset + 40}.1`,
        type: 'READ_ONLY',
      } as BlockInfo,
      QD02_Min: {
        address: `DB46,INT${startOffset + 42}.1`,
        type: 'READ_ONLY',
      } as BlockInfo,
      QD02_Max: {
        address: `DB46,INT${startOffset + 44}.1`,
        type: 'READ_ONLY',
      } as BlockInfo,
      QD03_Min: {
        address: `DB46,INT${startOffset + 46}.1`,
        type: 'READ_ONLY',
      } as BlockInfo,
      QD03_Max: {
        address: `DB46,INT${startOffset + 48}.1`,
        type: 'READ_ONLY',
      } as BlockInfo,
      QD04_Min: {
        address: `DB46,INT${startOffset + 50}.1`,
        type: 'READ_ONLY',
      } as BlockInfo,
      QD04_Max: {
        address: `DB46,INT${startOffset + 52}.1`,
        type: 'READ_ONLY',
      } as BlockInfo,
      OperatorName: {
        address: `DB46,S${startOffset + 54}.40`,
        type: 'READ_ONLY',
      } as BlockInfo,
      OPTxt: {
        address: `DB46,S${startOffset + 96}.60`,
        type: 'READ_ONLY',
      } as BlockInfo,
    };
  }
}
