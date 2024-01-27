import { PlcData } from 'src/plc-communication/interface/plc-communication.interface';

export interface Payload<T extends PropertyKey> {
  data: any;
  key: keyof (keyof PlcData<T>);
  oldVal: any;
  val: any;
}
