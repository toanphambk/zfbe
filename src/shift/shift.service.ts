import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateShiftDto } from './dto/create-shift.dto';
import { Shift } from './entities/shift.entity';
import { NullableType } from 'src/utils/types/nullable.type';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { UpdateShiftDto } from './dto/update-shift.dto';

@Injectable()
export class ShiftService {
  constructor(
    @InjectRepository(Shift)
    private repo: Repository<Shift>,
  ) {}

  async create(createDto: CreateShiftDto): Promise<Shift> {
    if (!(await this.isTimeOverlap(createDto))) {
      const shift = this.repo.create(createDto);
      return this.repo.save(shift);
    }
    throw new BadRequestException('Shift Overlapse');
  }

  public findAll(machineId?: number): Promise<Shift[]> {
    if (machineId) {
      return this.repo.find({
        where: { machine: { id: machineId } },
      });
    } else {
      return this.repo.find({
        relations: ['machine'],
      });
    }
  }

  async findOne(fields: EntityCondition<Shift>): Promise<NullableType<Shift>> {
    const shift = await this.repo.findOne({ where: fields });

    if (!shift) {
      throw new NotFoundException('machine setting not found');
    }

    return shift;
  }

  async update(id: number, updateDto: UpdateShiftDto): Promise<Shift> {
    const existingShift = await this.findOne({ id: +id });

    if (!existingShift) {
      throw new NotFoundException('Setting not found');
    }

    Object.assign(existingShift, updateDto);
    return this.repo.save(existingShift);
  }

  async remove(fields: EntityCondition<Shift>): Promise<void> {
    const found = await this.repo.findOne({
      where: fields,
    });
    if (!found) {
      throw new NotFoundException('Shift not found');
    }
    await this.repo.softRemove(found);
  }

  async isTimeOverlap(createDto: CreateShiftDto): Promise<boolean> {
    const shifts = await this.findAll(createDto.machine.id);

    for (const shift of shifts) {
      const createStartTimeMinutes = this._getTimeInMinutes(
        createDto.startTime,
      );
      const createEndTimeMinutes = this._getTimeInMinutes(createDto.endTime);
      const shiftStartTimeMinutes = this._getTimeInMinutes(shift.startTime);
      const shiftEndTimeMinutes = this._getTimeInMinutes(shift.endTime);

      if (
        createStartTimeMinutes < shiftEndTimeMinutes &&
        createEndTimeMinutes > shiftStartTimeMinutes
      ) {
        return true;
      }
    }
    return false;
  }

  private _getTimeInMinutes(timeString: string): number {
    // Parse time string (e.g., "8:00") and calculate minutes
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }
}
