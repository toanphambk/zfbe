import { ConfigurationType } from 'src/plc-communication/interface/plc-communication.interface';

export type QrCodeDataType = 'barcodeData' | 'barcodeFlag';

export type RfidDataType = 'rfidData' | 'rfidflag';

export const qrCodeConfiguration = {
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
} as ConfigurationType<QrCodeDataType>;

export const rfidConfiguration = {
  blockSetting: {
    rfidData: {
      address: 'DB50,S2.40',
      type: 'WRITE_ONLY',
    },
    rfidflag: {
      address: 'DB50,INT0.1',
      type: 'READ_WRITE',
    },
  },
} as ConfigurationType<RfidDataType>;
