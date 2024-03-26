import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { appendFileSync, existsSync, writeFileSync } from 'fs';
import { MonitorServiceManager } from 'src/monitor/monitor-service-manager.service';
import { Payload } from 'src/plc-communication/interface/plc-communication.interface';

@Injectable()
export class MachineEventsService {
  constructor(private monitorServiceManager: MonitorServiceManager) {}
  @OnEvent('machine.data.change')
  handleMachineDataChangeEvent({ key, val, machine }: Payload<any>) {
    try {
      const monitorService =
        this.monitorServiceManager.getMonitorService(machine);
      if (key == 'mesReadFlag' && val == 1) {
        void monitorService.mesRequesHandler(machine);
      }
    } catch (error) {
      const filePath = './error.log';
      if (existsSync(filePath)) {
        appendFileSync(filePath, error.toString());
      } else {
        writeFileSync(filePath, error.toString());
      }
    }
  }
}
