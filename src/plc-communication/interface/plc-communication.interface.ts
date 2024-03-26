import { PlcCommunicationService } from '../plc-communication.service';
import { Machine } from 'src/machine/entities/machine.entity';

export type ConfigurationType<T extends PropertyKey> = {
  machine: Machine;
  blockSetting: BlockSettingType<T>;
};

export type BlockSettingType<T extends PropertyKey> = {
  [P in T]: BlockInfoType;
};

export type BlockInfoType = {
  address: string;
  type: 'READ_ONLY' | 'READ_WRITE' | 'WRITE_ONLY';
};

export interface PlcAddresslistType {
  read: { name: string; address: string }[];
  write: { name: string; address: string }[];
}

export type PlcDataType<T extends PropertyKey> = {
  [P in T]: any;
};

export interface Payload<T extends PropertyKey> {
  machine: Machine;
  data: any;
  key: T;
  oldVal: any;
  val: any;
}

export type PlcComStateType = 'BOOT_UP' | 'INIT' | 'READY' | 'ERROR';

export type PlcWriteQueueType = {
  blockName: string[];
  data: any[];
  uuid: string;
};

export type PlcCommunicationServiceFactory<T extends PropertyKey> = (
  config: ConfigurationType<T>,
) => PlcCommunicationService<T>;
