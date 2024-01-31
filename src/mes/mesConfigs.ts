import { Configuration } from '../plc-communication/interface/plc-communication.interface';
export type RecordData =
  | 'OPID'
  | 'CurDta_QD01'
  | 'CurDta_QD02'
  | 'CurDta_QD03'
  | 'CurDta_QD04'
  | 'PrvDta1_QD01'
  | 'PrvDta1_QD02'
  | 'PrvDta1_QD03'
  | 'PrvDta1_QD04'
  | 'PrvDta2_QD01'
  | 'PrvDta2_QD02'
  | 'PrvDta2_QD03'
  | 'PrvDta2_QD04'
  | 'TryCnt'
  | 'RT'
  | 'OType'
  | 'QD01_Min'
  | 'QD01_Max'
  | 'QD02_Min'
  | 'QD02_Max'
  | 'QD03_Min'
  | 'QD03_Max'
  | 'QD04_Min'
  | 'QD04_Max'
  | 'OperatorName'
  | 'OPTxt';

export type RecordInfo = 'SystemDT' | 'ModuleSerialNo';

export const recordInfoConfig = <Configuration<RecordInfo>>{
  blockSetting: {
    SystemDT: {
      address: `DB46,S60.14`,
      type: 'READ_ONLY',
    },
    ModuleSerialNo: {
      address: `DB46,S76.20`,
      type: 'READ_ONLY',
    },
  },
};

export const recordDataConfig = <Configuration<RecordData>>{};
