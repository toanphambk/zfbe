import { Injectable } from '@nestjs/common';
import { MonitorService } from 'src/monitor/monitor.service';

@Injectable()
export class MonitorServiceFactory {
  private monitorServiceInstances: Map<number, MonitorService> = new Map();

  // constructor(private productionLineSettingService: ShiftService) {
  //   void this.createAllMonitorServices();
  // }

  // private async createAllMonitorServices(): Promise<void> {
  //   const settings = await this.productionLineSettingService.findAll();

  //   settings.forEach((setting) => {
  //     this.createMonitorService(setting);
  //   });
  // }

  // createMonitorService(setting): MonitorService {
  //   const productionLineId = setting.productionLine.id;
  //   // this.monitorServiceInstances.set(productionLineId, new MonitorService());
  //   if (this.monitorServiceInstances.has(productionLineId)) {
  //     return this.monitorServiceInstances.get(
  //       productionLineId,
  //     ) as MonitorService;
  //   }

  //   const monitorService = new MonitorService(setting);
  //   this.monitorServiceInstances.set(productionLineId, monitorService);
  //   return monitorService;
  // }

  // updateMonitorService(setting) {
  //   const productionLineId = setting.productionLine.id;

  //   if (this.monitorServiceInstances.has(productionLineId)) {
  //     const monitorService = this.monitorServiceInstances.get(
  //       productionLineId,
  //     ) as MonitorService;
  //     monitorService.setConfiguration(setting);
  //   } else {
  //     throw new Error(
  //       `Monitor service not found for machine ID ${productionLineId}`,
  //     );
  //   }
  // }

  // deleteMonitorService(productionLineId: number): void {
  //   this.monitorServiceInstances.delete(productionLineId);
  // }

  // getAllMonitorServices(): NullableType<MonitorService>[] {
  //   return Array.from(this.monitorServiceInstances.values());
  // }

  // getMonitorService(productionLineId: number): NullableType<MonitorService> {
  //   const monitorService = this.monitorServiceInstances.get(productionLineId);
  //   if (!monitorService) {
  //     throw new NotFoundException(
  //       `cant find production line setting ${productionLineId}`,
  //     );
  //   }
  //   monitorService.test();
  //   return monitorService;
  // }
}
