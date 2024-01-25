import { Module } from '@nestjs/common';
import { ProductionLineSettingService } from './production-line-setting.service';
import { ProductionLineSettingController } from './production-line-setting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { IsRecordExist } from 'src/utils/validators/is-record-exist.validator';
import { ProductionLineSetting } from './entities/production-line-setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductionLineSetting])],
  controllers: [ProductionLineSettingController],
  providers: [IsExist, IsNotExist, IsRecordExist, ProductionLineSettingService],
  exports: [ProductionLineSettingService],
})
export class ProductionLineSettingModule {}
