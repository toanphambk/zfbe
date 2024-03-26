import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MonitorService } from 'src/monitor/monitor.service';
import { Machine } from 'src/machine/entities/machine.entity';
import { MachineService } from 'src/machine/machine.service';
import { MonitorServiceFactory } from './interface/monitor.interface';
import { log } from 'console';

@Injectable()
export class MonitorServiceManager {
  private monitorServiceInstances: Map<number, MonitorService> = new Map();

  constructor(
    private machineService: MachineService,
    @Inject('MonitorServiceFactory')
    private monitorServiceFactory: MonitorServiceFactory,
  ) {
    void this.createAllMonitorServices();
  }

  public getAllMonitorServices(): MonitorService[] {
    return Array.from(this.monitorServiceInstances.values());
  }

  private async createAllMonitorServices(): Promise<void> {
    const machines = await this.machineService.findAll();

    machines.forEach((machine) => {
      this.createMonitorService(machine);
    });
  }

  private createMonitorService(machine: Machine): MonitorService {
    const machineId = machine.id;
    if (this.monitorServiceInstances.has(machineId)) {
      return this.monitorServiceInstances.get(machineId) as MonitorService;
    }
    const monitorService = this.monitorServiceFactory(machine);
    this.monitorServiceInstances.set(machineId, monitorService);
    return monitorService;
  }

  private async updateMonitorService(machine: Machine) {
    const machineId = machine.id;
    if (this.monitorServiceInstances.has(machineId)) {
      await this.deleteMonitorService(machine);
      this.createMonitorService(machine);
    } else {
      throw new Error(`Monitor service not found for machine ID ${machineId}`);
    }
  }

  private async deleteMonitorService(machine: Machine): Promise<void> {
    const { id } = machine;
    try {
      const monitorService = this.getMonitorService(machine);
      if (monitorService) {
        await monitorService.removeMonitor();
        this.monitorServiceInstances.delete(id);
      }
    } catch (error) {}
  }

  public getMonitorService(machine: Machine): MonitorService {
    const machineId = machine.id;
    if (this.monitorServiceInstances.has(machineId)) {
      return this.monitorServiceInstances.get(machineId) as MonitorService;
    } else {
      throw new Error(`Monitor service not found for machine ID ${machineId}`);
    }
  }

  public getMonitorServicebyMachineID(machineId): MonitorService {
    if (this.monitorServiceInstances.has(machineId)) {
      return this.monitorServiceInstances.get(machineId) as MonitorService;
    } else {
      throw new Error(`Monitor service not found for machine ID ${machineId}`);
    }
  }

  public getMonitorServiceState(machineId: number) {
    const monitorService = this.getMonitorServicebyMachineID(machineId);
    return monitorService.getState();
  }

  @OnEvent('machine.create')
  handleMachineCreate(event: Machine) {
    this.createMonitorService(event);
  }

  @OnEvent('machine.update')
  handleMachineUpdate(event: Machine) {
    try {
      void this.updateMonitorService(event);
    } catch (error) {
      log(error);
    }
  }

  @OnEvent('machine.delete')
  handleMachineDelete(event: Machine) {
    try {
      void this.deleteMonitorService(event);
    } catch (error) {
      log(error);
    }
  }
}
