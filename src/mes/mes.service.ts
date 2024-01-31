import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PlcCommunicationService } from 'src/plc-communication/plc-communication.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as xml2js from 'xml2js';
import {
  BlockSetting,
  PlcData,
} from 'src/plc-communication/interface/plc-communication.interface';
import {
  RecordData,
  RecordInfo,
  recordDataConfig,
  recordInfoConfig,
} from './mesConfigs';
import { ProductionLine } from 'src/production-line/entities/production-line.entity';
import { ProductionLineService } from 'src/production-line/production-line.service';
import { EntityCondition } from 'src/utils/types/entity-condition.type';

@Injectable()
export class MesService {
  private builder = new xml2js.Builder({ headless: true, rootName: 'Data' });
  constructor(
    @Inject('PlcCommunicationServiceFactory')
    private plcServiceFactory: (
      eventEmitter: EventEmitter2,
    ) => PlcCommunicationService<any>,
    private eventEmitter: EventEmitter2,
    private productionLineService: ProductionLineService,
  ) {}

  public async getMesData(productionLine: EntityCondition<ProductionLine>) {
    try {
      const { fileName, data: recordInfo } = await this.getRecordInfo(
        productionLine,
      );
      let xmlData = '<Data\n" ';
      xmlData += this.formatDataForXml(`QD.HDR`, recordInfo.lineInfo) + '\n';
      xmlData +=
        this.formatDataForXml(`QD.HDR`, recordInfo.stationInfo) +
        ' DBType="QUALITY\n';
      const { data: recordData } = await this.getRecordData(productionLine);
      recordData.forEach((data, index) => {
        xmlData += this.formatDataForXml(`QD.DT0${index + 1}`, data) + '\n';
      });
      xmlData += '/>';
      return { fileName, xmlData };
    } catch (error) {
      throw new Error('Read From PLC error');
    }
  }

  private async getRecordInfo(productionLine: EntityCondition<ProductionLine>) {
    const found = await this.productionLineService.findOne(productionLine);
    if (!found) {
      throw new NotFoundException('cant find product category');
    }

    const recordInfoConn: PlcCommunicationService<RecordInfo> =
      this.plcServiceFactory(this.eventEmitter);
    recordInfoConfig.ip = found.ipAddress;
    recordInfoConn.setConfig(recordInfoConfig);
    await recordInfoConn.initConnection();
    const { connection } = recordInfoConn.getState();
    if (!connection) {
      throw new InternalServerErrorException('CONNECTION ERROR');
    }

    await recordInfoConn.addDataBlock();
    const { SystemDT, ModuleSerialNo } = recordInfoConn.getData();
    const data = {
      lineInfo: {
        SystemID: found.systemID,
        SystemDT,
        ModuleSerialNo,
      },
      stationInfo: {
        LineID: found.lineID,
        StationName: found.stationName,
        StationID: found.stationID,
        PartID: '0',
        Mode: '0',
      },
    };
    const fileName = `${found.stationName}_${ModuleSerialNo}_${SystemDT}`;
    return { fileName, data };
  }

  private async getRecordData(productionLine: EntityCondition<ProductionLine>) {
    const found = await this.productionLineService.findOne(productionLine);
    if (!found) {
      throw new NotFoundException('cant find product category');
    }

    const recordDataConn: PlcCommunicationService<RecordData> =
      this.plcServiceFactory(this.eventEmitter);
    recordDataConfig.ip = found.ipAddress;
    recordDataConn.setConfig(recordDataConfig);
    await recordDataConn.initConnection();
    const { connection } = recordDataConn.getState();
    if (!connection) {
      throw new InternalServerErrorException('CONNECTION ERROR');
    }
    const data = <PlcData<RecordData>[]>[];
    for (let i = 0; i < 4; i++) {
      recordDataConfig.blockSetting = this.generateElementConfig(i);
      recordDataConn.setConfig(recordDataConfig);
      await recordDataConn.addDataBlock();
      data[i] = recordDataConn.getData();
    }
    return { data };
  }

  private formatDataForXml(prefix: string, data: any): string {
    return Object.entries(data)
      .map(([key, value]) => {
        return `${prefix}.${key.replace('_', '.')}="${value}"`;
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
