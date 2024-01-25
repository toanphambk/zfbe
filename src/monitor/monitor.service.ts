import { Injectable } from '@nestjs/common';

@Injectable()
export class MonitorService {
  // constructor(setting: Shift) {
  //   this.setConfiguration(setting);
  //   this.data = {
  //     state: 'off',
  //     productCode: '',
  //     productQuantity: [],
  //     target: 0,
  //     id: this.setting.productionLine.id,
  //   };
  // }
  // private data: {
  //   state: 'manufacturing' | 'off' | 'break time' | 'standby';
  //   productCode: string;
  //   productQuantity: number[];
  //   target: number;
  //   id: number;
  // };
  // private setting: Shift;
  // setConfiguration(setting: Shift) {
  //   // Update the configuration based on the provided config object
  //   this.setting = setting;
  // }
  // test() {
  //   console.log(this.data);
  // }
  // getConfiguration() {
  //   return this.setting;
  // }
  // getData() {
  //   // Return the current data
  //   return this.data;
  // }
  // productTracking() {
  //   // Query the database for the number of products manufactured in that day
  //   // Populate the productQuantity array with the count for each hour
  //   // Run this method periodically (e.g., every minute)
  //   // Implementation logic for productTracking
  // }
  // productManufactureFinish() {
  //   // Save the event of a product being manufactured to the database
  //   // Implementation logic for productManufactureFinish
  // }
  // productionLineAliveChecking() {
  //   // Check if the production line is alive by receiving signals at regular intervals
  //   // If the interval passes without receiving any signals, change the status to offline and save the change event to the database
  //   // Implementation logic for productionLineAliveChecking
  // }
  // getOEE() {
  //   // Calculate and return the Overall Equipment Efficiency (OEE)
  //   // Implementation logic for getOEE
  // }
  // Other methods and functionality as needed
}
