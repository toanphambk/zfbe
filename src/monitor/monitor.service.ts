import { Inject, Injectable } from '@nestjs/common';
import { MesService } from 'src/mes/mes.service';
import { PlcCommunicationService } from 'src/plc-communication/plc-communication.service';
import { Machine } from 'src/machine/entities/machine.entity';
import {
  MonitorDataType,
  monitorDataConfig,
} from './interface/monitor.interface';
import { PlcCommunicationServiceFactory } from 'src/plc-communication/interface/plc-communication.interface';
import { log } from 'console';

@Injectable()
export class MonitorService {
  constructor(
    private machine: Machine,
    @Inject('PlcCommunicationServiceFactory')
    private plcServiceFactory: PlcCommunicationServiceFactory<any>,
    private mesService: MesService,
  ) {
    void this.initPlcService();
  }

  private plcMonitorConn: PlcCommunicationService<MonitorDataType>;
  private connectionPulseInterval: NodeJS.Timeout;

  private async initPlcService() {
    try {
      const config = { ...monitorDataConfig, machine: this.machine };
      this.plcMonitorConn = this.plcServiceFactory(config);
      await this.checkConnectionAndInitialize();
      await this.plcMonitorConn.addDataBlock();
      await this.plcMonitorConn.activeCycleScan();
      this.connectionPulseInterval = setInterval(() => {
        void this.connectionPulse();
      }, 1000);
    } catch (error) {
      log(error);
    }
  }

  private async checkConnectionAndInitialize() {
    await this.plcMonitorConn.initConnection();
    const { connection } = this.plcMonitorConn.getState();
    if (!connection) {
      await this.plcMonitorConn.connectionCleanUp();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await this.checkConnectionAndInitialize();
    }
  }

  async connectionPulse() {
    try {
      const { connection } = this.plcMonitorConn.getState();
      if (connection) {
        const { connectionPulse } = this.plcMonitorConn.getData();
        await this.plcMonitorConn.writeBlock(
          ['connectionPulse'],
          [connectionPulse ? 0 : 1],
          false,
        );
      }
    } catch (error) {
      log(error);
    }
  }

  public getState() {
    return this.plcMonitorConn.getState();
  }

  public async removeMonitor() {
    await this.plcMonitorConn.connectionCleanUp();
    this.connectionPulseInterval.unref();
  }

  public async mesRequesHandler(machine: Machine) {
    try {
      await this.mesService.readMesDataExportXml(machine);
      await this.plcMonitorConn.writeBlock(['mesReadFlag'], [0]);
      await this.plcMonitorConn.writeBlock(['mesReadDone'], [0]);
    } catch (error) {
      console.error(error);
    }
  }
}
