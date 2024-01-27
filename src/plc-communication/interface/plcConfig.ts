import { Configuration } from './plc-communication.interface';

export type BarCode = 'barcodeData' | 'barcodeFlag';

const configuration: Configuration<BarCode> = {
  blockSetting: {
    barcodeData: {
      address: 'DB47,S2.40',
      type: 'WRITE_ONLY',
    },
    barcodeFlag: {
      address: 'DB47,INT0.1',
      type: 'READ_WRITE',
    },
  },
  ip: '192.168.0.1',
};

export default configuration;
