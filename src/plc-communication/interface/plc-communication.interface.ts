export type Configuration<T extends PropertyKey> = {
  ip: string;
  blockSetting: { [P in T]: BlockInfo };
};

export type BlockInfo = {
  address: string;
  type: 'READ_ONLY' | 'READ_WRITE' | 'WRITE_ONLY';
};

export interface PlcAddresslist {
  read: { name: string; address: string }[];
  write: { name: string; address: string }[];
}

export type PlcData<T extends PropertyKey> = {
  [P in T]: any;
};

export type PlcComState = 'BOOT_UP' | 'INIT' | 'READY' | 'ERROR';

export type PlcWriteQueue = {
  blockName: string[];
  data: any[];
  uuid: string;
};
