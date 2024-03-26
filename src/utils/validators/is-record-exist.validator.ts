import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
@ValidatorConstraint({ name: 'IsRecordExist', async: true })
export class IsRecordExist implements ValidatorConstraintInterface {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async validate(value: object, validationArguments: ValidationArguments) {
    const repository = validationArguments.constraints[0] as string;
    const entity: unknown = await this.dataSource
      .getRepository(repository)
      .findOne({ where: value });
    if (entity) {
      return true;
    }
    throw new NotFoundException(`${repository} Record Not Found`);
  }
}
