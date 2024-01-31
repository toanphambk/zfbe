import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PlcCommunicationService } from 'src/plc-communication/plc-communication.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as xml2js from 'xml2js';
import {
  BlockSetting,
  Configuration,
} from 'src/plc-communication/interface/plc-communication.interface';
import { RecordData, RecordID } from './mesConfigs';

const configuration = <Configuration<RecordData | RecordID>>{
  ip: '192.168.0.1',
};

@Injectable()
export class MesService {
  private builder = new xml2js.Builder({ headless: true, rootName: 'Data' });
  constructor(
    @Inject('PlcCommunicationServiceFactory')
    private plcServiceFactory: (
      eventEmitter: EventEmitter2,
    ) => PlcCommunicationService<any>,
    private eventEmitter: EventEmitter2,
  ) {}

  async initPlcService() {
    const plcCommunicationService: PlcCommunicationService<
      RecordData | RecordID
    > = this.plcServiceFactory(this.eventEmitter);
    plcCommunicationService.setConfig(configuration);
    await plcCommunicationService.initConnection();
  }

  public async readDataAndExportXml() {
    const plcCommunicationService: PlcCommunicationService<
      RecordData | RecordID
    > = this.plcServiceFactory(this.eventEmitter);
    plcCommunicationService.setConfig(configuration);
    await plcCommunicationService.initConnection();
    const { connection } = plcCommunicationService.getState();
    if (!connection) {
      throw new InternalServerErrorException('CONNECTION ERROR');
    }
    try {
      let xmlData = '<Data\nQD.HDR.SystemID="BMC-10.225.244.231" ';
      let filename = '';
      configuration.blockSetting = {
        SystemDT: {
          address: `DB46,S60.14`,
          type: 'READ_ONLY',
        },
        ModuleSerialNo: {
          address: `DB46,S76.20`,
          type: 'READ_ONLY',
        },
      } as BlockSetting<RecordID>;

      plcCommunicationService.setConfig(configuration);
      await plcCommunicationService.addDataBlock();
      const data = plcCommunicationService.getData();
      const systemDT = this.getCurrentFormattedDate();
      xmlData += `QD.HDR.SystemDT="${systemDT}" `;
      filename = `RBP025_${data.ModuleSerialNo}_${systemDT}}`;
      xmlData +=
        this.formatDataForXml(`QD.HDR`, data) +
        '\n' +
        `QD.HDR.LineID="BMC" QD.HDR.StationName="RBP025" QD.HDR.StationID="104" QD.HDR.PartID="0" QD.HDR.Mode="0" DBType="QUALITY"` +
        '\n';
      for (let i = 0; i < 4; i++) {
        configuration.blockSetting = {};
        configuration.blockSetting = this.generateElementConfig(i);
        plcCommunicationService.resetData();
        plcCommunicationService.setConfig(configuration);
        await plcCommunicationService.addDataBlock();
        const data = plcCommunicationService.getData();
        xmlData += this.formatDataForXml(`QD.DT0${i + 1}`, data) + '\n';
      }
      xmlData += '/>';
      return { filename, xmlData };
    } catch (error) {
      throw new Error('Write to PLC error');
    }
  }

  private formatDataForXml(prefix: string, data: any): string {
    return Object.entries(data)
      .map(([key, value]) => {
        return `${prefix}.${key.replace('_', '.')}="${value}"`;
      })
      .join(' ');
  }

  private getCurrentFormattedDate(): string {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const second = now.getSeconds().toString().padStart(2, '0');

    return year + month + day + hour + minute + second;
  }

  private generateElementConfig(i: number) {
    const baseOffset = 98;
    const elementSize = 158;

    const startOffset = baseOffset + i * elementSize;

    return {
      OPID: {
        address: `DB46,S${startOffset}.5`,
        type: 'READ_ONLY',
      },
      CurDta_QD01: {
        address: `DB46,INT${startOffset + 8}.1`,
        type: 'READ_ONLY',
      },
      CurDta_QD02: {
        address: `DB46,INT${startOffset + 10}.1`,
        type: 'READ_ONLY',
      },
      CurDta_QD03: {
        address: `DB46,INT${startOffset + 12}.1`,
        type: 'READ_ONLY',
      },
      CurDta_QD04: {
        address: `DB46,INT${startOffset + 14}.1`,
        type: 'READ_ONLY',
      },
      PrvDta1_QD01: {
        address: `DB46,INT${startOffset + 16}.1`,
        type: 'READ_ONLY',
      },
      PrvDta1_QD02: {
        address: `DB46,INT${startOffset + 18}.1`,
        type: 'READ_ONLY',
      },
      PrvDta1_QD03: {
        address: `DB46,INT${startOffset + 20}.1`,
        type: 'READ_ONLY',
      },
      PrvDta1_QD04: {
        address: `DB46,INT${startOffset + 22}.1`,
        type: 'READ_ONLY',
      },
      PrvDta2_QD01: {
        address: `DB46,INT${startOffset + 24}.1`,
        type: 'READ_ONLY',
      },
      PrvDta2_QD02: {
        address: `DB46,INT${startOffset + 26}.1`,
        type: 'READ_ONLY',
      },
      PrvDta2_QD03: {
        address: `DB46,INT${startOffset + 28}.1`,
        type: 'READ_ONLY',
      },
      PrvDta2_QD04: {
        address: `DB46,INT${startOffset + 30}.1`,
        type: 'READ_ONLY',
      },
      TryCnt: {
        address: `DB46,INT${startOffset + 32}.1`,
        type: 'READ_ONLY',
      },
      RT: {
        address: `DB46,INT${startOffset + 34}.1`,
        type: 'READ_ONLY',
      },
      OType: {
        address: `DB46,INT${startOffset + 36}.1`,
        type: 'READ_ONLY',
      },
      QD01_Min: {
        address: `DB46,INT${startOffset + 38}.1`,
        type: 'READ_ONLY',
      },
      QD01_Max: {
        address: `DB46,INT${startOffset + 40}.1`,
        type: 'READ_ONLY',
      },
      QD02_Min: {
        address: `DB46,INT${startOffset + 42}.1`,
        type: 'READ_ONLY',
      },
      QD02_Max: {
        address: `DB46,INT${startOffset + 44}.1`,
        type: 'READ_ONLY',
      },
      QD03_Min: {
        address: `DB46,INT${startOffset + 46}.1`,
        type: 'READ_ONLY',
      },
      QD03_Max: {
        address: `DB46,INT${startOffset + 48}.1`,
        type: 'READ_ONLY',
      },
      QD04_Min: {
        address: `DB46,INT${startOffset + 50}.1`,
        type: 'READ_ONLY',
      },
      QD04_Max: {
        address: `DB46,INT${startOffset + 52}.1`,
        type: 'READ_ONLY',
      },
      OperatorName: {
        address: `DB46,S${startOffset + 54}.40`,
        type: 'READ_ONLY',
      },
      OPTxt: {
        address: `DB46,S${startOffset + 96}.60`,
        type: 'READ_ONLY',
      },
    } as BlockSetting<RecordData>;
  }
}
