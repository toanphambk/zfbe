import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Not, Repository } from 'typeorm';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { Machine } from './entities/machine.entity';
import { NullableType } from 'src/utils/types/nullable.type';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class MachineService {
  constructor(
    @InjectRepository(Machine)
    private repo: Repository<Machine>,
    private machineServiceEvent: EventEmitter2,
  ) {}

  async create(createDto: CreateMachineDto): Promise<Machine> {
    const machine = this.repo.create(createDto);
    const createddoc = await this.repo.save(machine);
    if (!createddoc) {
      throw new NotFoundException('machine creation failed');
    }
    this.machineServiceEvent.emit('machine.create', createddoc);
    return createddoc;
  }

  public findAll(): Promise<Machine[]> {
    return this.repo.find();
  }

  async findOne(
    fields: EntityCondition<Machine>,
  ): Promise<NullableType<Machine>> {
    const entity = await this.repo.findOne({
      where: fields,
    });

    if (!entity) {
      throw new NotFoundException('machine not found');
    }
    return entity;
  }

  async update(id: number, updateDto: UpdateMachineDto): Promise<Machine> {
    const existingDoc = await this.findOne({ id: +id });
    if (!existingDoc) {
      throw new NotFoundException('machine not found');
    }

    const existingDocWithUniqueField = await this.repo.findOne({
      where: [
        { systemID: updateDto.systemID, id: Not(Equal(id)) },
        { stationName: updateDto.stationName, id: Not(Equal(id)) },
        { stationID: updateDto.stationID, id: Not(Equal(id)) },
        { ip: updateDto.ip, id: Not(Equal(id)) },
      ],
    });

    if (existingDocWithUniqueField) {
      throw new ConflictException(
        'Another machine with the same name/ID already exists',
      );
    }

    Object.assign(existingDoc, updateDto);
    const updatedDoc = await this.repo.save(existingDoc);
    if (!updatedDoc) {
      throw new NotFoundException('machine update failed');
    }

    this.machineServiceEvent.emit('machine.update', updatedDoc);
    return updatedDoc;
  }

  async remove(fields: EntityCondition<Machine>): Promise<void> {
    const found = await this.repo.findOne({
      where: fields,
    });
    if (!found) {
      throw new NotFoundException('machine not found');
    }
    const deletedDoc = await this.repo.softRemove(found);
    if (!deletedDoc) {
      throw new NotFoundException('machine delete failed');
    }
    this.machineServiceEvent.emit('machine.delete', deletedDoc);
  }
}
