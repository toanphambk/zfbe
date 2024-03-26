import { ConfigurationType } from 'src/plc-communication/interface/plc-communication.interface';
import { Machine } from 'src/machine/entities/machine.entity';
import { MonitorService } from '../monitor.service';

export type MonitorServiceFactory = (machine: Machine) => MonitorService;

export type MonitorDataType =
  | 'barcodeFlag'
  | 'mesReadFlag'
  | 'rfidflag'
  | 'mesReadDone'
  | 'alarmFlag'
  | 'alarmCode'
  | 'connectionPulse';

export const monitorDataConfig = {
  blockSetting: {
    barcodeFlag: {
      address: 'DB47,INT0.1',
      type: 'READ_WRITE',
    },
    mesReadFlag: {
      address: 'DB46,INT0.1',
      type: 'READ_WRITE',
    },
    rfidflag: {
      address: 'DB50,INT0.1',
      type: 'READ_WRITE',
    },
    mesReadDone: {
      address: 'DB46,INT10.1',
      type: 'READ_WRITE',
    },
    alarmFlag: {
      address: 'DB48,INT0.1',
      type: 'READ_WRITE',
    },
    alarmCode: {
      address: 'DB46,INT2.1',
      type: 'READ_ONLY',
    },
    connectionPulse: {
      address: 'DB46,INT12.1',
      type: 'READ_WRITE',
    },
  },
} as ConfigurationType<MonitorDataType>;
