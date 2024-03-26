import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PlcCommunicationService } from 'src/plc-communication/plc-communication.service';
import * as xml2js from 'xml2js';
import {
  BlockSettingType,
  ConfigurationType,
  PlcCommunicationServiceFactory,
  PlcDataType,
} from 'src/plc-communication/interface/plc-communication.interface';
import {
  RecordDataType,
  RecordInfo,
  recordDataConfig,
  recordInfoConfig,
} from './interface/mes.interface';
import { Machine } from 'src/machine/entities/machine.entity';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { RecordData } from './entity/recordData.entity';
import { Record } from './entity/record.entity';
import { NullableType } from 'src/utils/types/nullable.type';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { FindAllRecordByMachineAndDateTimeDto } from './dto/findAllRecordByMachineAndDateTime.dto';
import { GetDailyLineChartDataDto } from './dto/getDailyLineChartData.dto';

const XML_SAVE_DIR = 'E:\\data';
@Injectable()
export class MesService {
  private builder = new xml2js.Builder({ headless: true, rootName: 'Data' });
  constructor(
    @Inject('PlcCommunicationServiceFactory')
    private plcServiceFactory: PlcCommunicationServiceFactory<any>,
    @InjectRepository(Record)
    private recordRepo: Repository<Record>,
    @InjectRepository(RecordData)
    private recordDataRepo: Repository<RecordData>,
  ) {}

  public async readMesDataExportXml(machine: Machine) {
    try {
      const { fileName, data: recordInfo } = await this.getRecordInfo(machine);
      const { data: recordData } = await this.getRecordData(machine);
      let xmlData = '<Data\n';
      xmlData += this.formatDataForXml(`QD.HDR`, recordInfo.lineInfo) + '\n';
      xmlData +=
        this.formatDataForXml(`QD.HDR`, recordInfo.stationInfo) +
        ' DBType="QUALITY"\n';
      recordData.forEach(async (data, index) => {
        xmlData += this.formatDataForXml(`QD.DT0${index + 1}`, data) + '\n';
      });
      xmlData += '/>';

      const newRecord = await this.recordRepo.save({
        moduleSerialNo: recordInfo.lineInfo.ModuleSerialNo,
        systemDt: recordInfo.lineInfo.SystemDT,
        machine: machine,
      });

      recordData.forEach(async (data, index) => {
        await this.recordDataRepo.save({
          ...recordData[index],
          record: newRecord,
        });
      });

      if (!existsSync(XML_SAVE_DIR)) {
        mkdirSync(XML_SAVE_DIR, { recursive: true });
      }
      const filePath = join(XML_SAVE_DIR, fileName);
      writeFileSync(filePath, xmlData);
      return true;
    } catch (error) {
      throw new Error(`Read Mes Data Error: ${error.message}`);
    }
  }

  public async getAllRecords() {
    return this.recordRepo.find({ relations: ['recordDatas', 'machine'] });
  }

  public async getDailyLineChartData({
    machineId,
    time,
  }: GetDailyLineChartDataDto): Promise<{ Hour: number; Actual: number }[]> {
    const dayStart = new Date(time);
    const dayEnd = new Date(time);
    dayStart.setHours(0, 0, 0, 0);
    dayEnd.setHours(23, 59, 59, 999);
    const recordCountEachHour = Array.from({ length: 24 }, (_, index) => {
      return {
        Hour: index,
        Actual: 0,
      };
    });
    const records = await this.recordRepo.find({
      where: {
        machine: { id: machineId },
        createdAt: Between(dayStart, dayEnd),
      },
    });
    records.forEach((record) => {
      const hour = record.createdAt.getHours();
      recordCountEachHour[hour].Actual++;
      recordCountEachHour[hour].Hour = hour;
    });
    // for (let i = 1; i < recordCountEachHour.length; i++) {
    //   recordCountEachHour[i].Actual += recordCountEachHour[i - 1].Actual;
    // }
    return recordCountEachHour;
  }

  public async getAllRecordsByMachineAndTime({
    machineId,
    startTime,
    endTime,
  }: FindAllRecordByMachineAndDateTimeDto): Promise<Record[]> {
    try {
      const conditions: FindOptionsWhere<Record> = {
        machine: { id: machineId },
      };
      if (startTime && endTime) {
        const start = new Date(startTime);
        const end = new Date(endTime);
        conditions.createdAt = Between(start, end);
      } else if (startTime) {
        const start = new Date(startTime);
        const end = new Date(start);
        end.setHours(23, 59, 59, 999);
        conditions.createdAt = Between(start, end);
      } else if (endTime) {
        const end = new Date(endTime);
        const start = new Date(end);
        start.setHours(0, 0, 0, 0);
        conditions.createdAt = Between(start, end);
      }

      return this.recordRepo.find({
        where: conditions,
        relations: ['recordDatas', 'machine'],
      });
    } catch (error) {
      throw new Error('Error in getAllRecordsByMachineAndTimeRange');
    }
  }

  public async getOneRecord(
    fields: EntityCondition<Record>,
  ): Promise<NullableType<Record>> {
    const record = await this.recordRepo.findOne({
      where: fields,
      relations: ['recordDatas'],
    });

    if (!record) {
      throw new NotFoundException('record not found');
    }

    return record;
  }

  private async getRecordInfo(machine: Machine) {
    let recordInfoConn = {} as PlcCommunicationService<RecordInfo>;
    try {
      const config = { ...recordInfoConfig, machine };
      recordInfoConn = this.plcServiceFactory(config);

      await recordInfoConn.initConnection();
      const { connection } = recordInfoConn.getState();
      if (!connection) {
        throw new InternalServerErrorException('CONNECTION ERROR');
      }

      await recordInfoConn.addDataBlock();
      const { SystemDT, ModuleSerialNo } = recordInfoConn.getData();
      const data = {
        lineInfo: {
          SystemID: machine.systemID,
          SystemDT,
          ModuleSerialNo,
        },
        stationInfo: {
          LineID: machine.lineID,
          StationName: machine.stationName,
          StationID: machine.stationID,
          PartID: '0',
          Mode: '0',
        },
      };
      const fileName = `${machine.stationName}_${ModuleSerialNo}_${SystemDT}.xml`;
      return { fileName, data };
    } catch (error) {
      throw new Error('Error in getRecordInfo');
    } finally {
      await recordInfoConn.connectionCleanUp();
    }
  }

  public async getRecordData(machine: Machine) {
    const config = { ...recordDataConfig, machine };
    const data: PlcDataType<RecordDataType>[] = [];
    for (let i = 0; i < 4; i++) {
      try {
        const result = await this.initAndGetData(config, i);
        data.push(result);
      } catch (error) {
        console.error(`Error in connection ${i}: ${error.message}`);
        throw new Error(`Error in connection ${i}: ${error.message}`);
      }
    }
    return { data };
  }

  private async initAndGetData(
    recordDataConfig: ConfigurationType<RecordDataType>,
    index: number,
  ): Promise<PlcDataType<RecordDataType>> {
    let recordDataConn = {} as PlcCommunicationService<RecordDataType>;
    try {
      const config = {
        ...recordDataConfig,
        blockSetting: this.generateElementConfig(index),
      };
      recordDataConn = this.plcServiceFactory(config);

      await recordDataConn.initConnection();
      const { connection } = recordDataConn.getState();
      if (!connection) {
        throw new Error(`CONNECTION ERROR at index ${index}`);
      }

      await recordDataConn.addDataBlock();
      return recordDataConn.getData();
    } catch (error) {
      throw new Error(`Error in connection ${index}: ${error.message}`);
    } finally {
      await recordDataConn.connectionCleanUp();
    }
  }

  private formatDataForXml(prefix: string, data: any): string {
    return Object.entries(data)
      .map(([key, value]) => {
        return `${prefix}.${key.replace('_', '.')}="${value}"`;
      })
      .join(' ');
  }

  private generateElementConfig(i: number) {
    const baseOffset = 102;
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
    } as BlockSettingType<RecordDataType>;
  }
}
