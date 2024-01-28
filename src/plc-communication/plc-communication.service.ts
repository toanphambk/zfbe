import { Injectable } from '@nestjs/common';
import * as nodes7 from 'nodes7';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import {
  PlcAddresslist,
  PlcData,
  PlcWriteQueue,
  Configuration,
  BlockInfo,
  PlcComState,
  Payload,
} from './interface/plc-communication.interface';
import { log } from 'console';

@Injectable()
export class PlcCommunicationService<BlockName extends PropertyKey> {
  constructor(private PlcCommunicationServiceEvent: EventEmitter2) {
    this.data = new Proxy(this.data, this.dataChangeHandler());
  }
  private s7Connection = new nodes7();
  private state: PlcComState = 'BOOT_UP';
  private cycleScanIsActive = false;
  private config: Configuration<BlockName>;
  private addressList: PlcAddresslist;
  private data = <PlcData<BlockName>>{};
  private plcWriteQueue: PlcWriteQueue[] = [];
  private plcEvent = new EventEmitter();

  public setConfig(config: Configuration<BlockName>) {
    this.config = config;
  }

  public getData(): PlcData<BlockName> {
    return this.data;
  }

  public getState() {
    const { value } = this.s7Connection.findItem('_COMMERR');
    return {
      state: this.state,
      connection: !value,
      cycleScanIsActive: this.cycleScanIsActive,
      config: this.config,
      addressList: this.addressList,
    };
  }

  public async initConnection(): Promise<boolean> {
    console.log(
      `[ INIT CONNECTION ] : ${JSON.stringify(this.config, null, 1)}`,
    );
    this.state = 'INIT';
    try {
      await this.establishConnection();
      return true;
    } catch (err) {
      this.errorHandler('INTI CONNECTION ERROR', true, err);
      return false;
    }
  }

  private establishConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.s7Connection.initiateConnection(
        {
          host: this.config.ip,
          port: 102,
          rack: 0,
          slot: 1,
        },
        (err) => (err ? reject(err) : resolve()),
      );
    });
  }

  public async dropConnection() {
    await new Promise<void>((res) => {
      this.s7Connection.dropConnection(() => {
        res();
      });
    });
  }

  public addDataBlock = async () => {
    if (this.state == 'ERROR') {
      throw new Error('Plc Communication Service Is Not Ready');
    }

    if (this.state == 'READY') {
      this.state = 'INIT';
      this.s7Connection.removeItems();
    }

    this.addressList = { read: [], write: [] };

    Object.entries(this.config.blockSetting).forEach(([key, blockSetting]) => {
      const setting = blockSetting as BlockInfo;

      if (['READ_ONLY', 'READ_WRITE'].includes(setting.type)) {
        this.addressList.read.push({
          name: key,
          address: setting.address,
        });
      }
      if (['WRITE_ONLY', 'READ_WRITE'].includes(setting.type)) {
        this.addressList.write.push({
          name: key,
          address: setting.address,
        });
      }
    });

    const readingAdressList = this.addressList.read.map(
      (block) => block.address,
    );

    this.s7Connection.addItems(readingAdressList);

    await new Promise<void>((res) => {
      setTimeout(() => {
        res();
      }, 200);
    });
    await this.dataUpdate();
    return true;
  };

  public removeBlock() {
    this.s7Connection.removeItems();
  }

  public async activeCycleScan() {
    this.cycleScanIsActive = true;
    await this.cycleScan();
  }

  public deactiveCycleScan(): void {
    this.cycleScanIsActive = false;
  }

  private cycleScan = async () => {
    if (this.cycleScanIsActive) {
      try {
        if (this.state != 'READY') {
          console.log('[ PLC Service ]: PLC Service Is Not Ready');
          this.plcWriteQueue = [];
          await new Promise<void>((res) => {
            setTimeout(() => {
              res();
            }, 1000);
          });
          return;
        }

        if (this.plcWriteQueue.length > 10) {
          this.errorHandler('QUEUE OVERFLOW', false, this.plcWriteQueue);
          return;
        }

        if (this.plcWriteQueue.length > 0) {
          await new Promise<void>((res, rej) => {
            const command = this.plcWriteQueue[0];
            this.s7Connection.writeItems(
              command.blockName,
              command.data,
              (err) => {
                if (err) {
                  rej(
                    this.errorHandler(`WRITE TO PLC ERROR : `, false, command),
                  );
                  return;
                }
                this.plcWriteQueue.shift();
                this.plcEvent.emit(command.uuid, undefined);
                res();
              },
            );
          });
        }
        await this.dataUpdate();
        void this.cycleScan();
      } catch (error) {
        this.errorHandler('CYCLE SCAN ERROR' + error, false);
      }
    }
  };

  public dataUpdate = async () => {
    try {
      const dataFromPLC = await this.readFromPlc();
      Object.keys(dataFromPLC).map((address) => {
        const found = this.addressList.read.find(
          (block) => block.address === address,
        );
        if (found) {
          this.data[found.name] = dataFromPLC[address];
          return;
        }
        throw new Error('Address not found in read array');
      });
      this.state = 'READY';
    } catch (error) {
      void this.errorHandler('READ FROM PLC ERROR', true, error);
    }
  };

  public writeBlock = (blockName: BlockName[], data: any[], log = true) => {
    return new Promise<boolean>((res, rej) => {
      if (this.state !== 'READY') {
        rej('PLC is not ready');
        return;
      }
      const { isValid, blockAddress } = this.blockAdressParse(blockName);
      if (!isValid) {
        rej('DATA BLOCK IS NOT VALID');
        return;
      }
      const uuid = uuidv4();
      this.plcWriteQueue.push({
        blockName: blockAddress,
        data: data,
        uuid,
      });
      this.plcEvent.once(uuid, (err) => {
        if (err) {
          rej(err);
          return;
        }
        if (log)
          console.log(`[ WRITE TO PLC DONE] : [ ${blockName} ] =[ ${data} ]`);
        res(true);
        return;
      });
    });
  };

  private readFromPlc = () => {
    return new Promise<any>((res, rej) => {
      this.s7Connection.readAllItems((err, data) => {
        if (err) {
          rej({ error: err, plcData: data });
          return;
        }
        res(data);
      });
    });
  };

  private dataChangeHandler = () => {
    return {
      set: (target, key, val) => {
        const oldVal = target[key];
        if (oldVal != val) {
          target[key] = val;
          const payload: Payload<BlockName> = {
            data: this.data,
            key,
            oldVal,
            val,
          };
          this.PlcCommunicationServiceEvent.emit('dataChange', payload);
          log(payload);
          return true;
        }
        return true;
      },
      get: (target, key) => {
        if (typeof target[key] === 'object' && target[key] !== null) {
          return new Proxy(target[key], this.dataChangeHandler());
        }
        return target[key];
      },
    };
  };

  private errorHandler = (err: string, isOperational: boolean, data?: any) => {
    console.log(`[ ERROR ] :  ${err} : ${data ? JSON.stringify(data) : ''}`);
    this.state = 'ERROR';
    if (!isOperational) {
      //do some other logging, event trigger for this
      return;
    }

    switch (err) {
      case 'READ FROM PLC ERROR':
        const isBadReading = Object.values(data.plcData).find(
          (val: unknown) => typeof val == 'string' && val.includes('BAD'),
        );
        if (isBadReading) {
          setTimeout(() => {
            void this.dataUpdate();
          }, 500);
        }
        break;
      case 'INTI CONNECTION ERROR':
        setTimeout(async () => {
          await this.initConnection();
        }, 5000);
        break;
    }
    return;
  };

  private blockAdressParse = (
    blocksName: BlockName[],
  ): { isValid: boolean; blockAddress: string[] } => {
    let isValid = true;
    const blockAddress: string[] = [];
    blocksName.forEach((blockName) => {
      const foundBlock = this.addressList.write.find(
        (writeBlock) => writeBlock.name === blockName,
      );
      if (!foundBlock) {
        console.log(
          `[ ERROR ]: Can not find valid address ${JSON.stringify(blockName)}`,
        );
        isValid = false;
        return;
      }
      blockAddress.push(foundBlock.address);
    });
    return { isValid, blockAddress };
  };
}
