import { Module } from '@nestjs/common';
import { MachineService } from './machine.service';
import { IsExist } from '../utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MachineController } from './machine.controller';
import { Machine } from './entities/machine.entity';
import { IsRecordExist } from 'src/utils/validators/is-record-exist.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Machine])],
  controllers: [MachineController],
  providers: [IsExist, IsNotExist, IsRecordExist, MachineService],
  exports: [MachineService],
})
export class MachineModule {}
