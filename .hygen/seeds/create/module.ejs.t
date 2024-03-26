import { Module } from '@nestjs/common';
import { MachineSettingService } from './production-line-setting.service';
import { MachineSettingController } from './production-line-setting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { IsRecordExist } from 'src/utils/validators/is-record-exist.validator';
import { MachineSetting } from './entities/production-line-setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MachineSetting])],
  controllers: [MachineSettingController],
  providers: [IsExist, IsNotExist, IsRecordExist, MachineSettingService],
  exports: [MachineSettingService],
})
export class MachineSettingModule {}
