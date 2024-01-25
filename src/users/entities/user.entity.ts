import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  BeforeInsert,
  BeforeUpdate,
  AfterLoad,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../roles/entities/role.entity';
import { Status } from '../../statuses/entities/status.entity';
import { FileEntity } from '../../files/entities/file.entity';
import * as bcrypt from 'bcryptjs';
import { EntityHelper } from 'src/utils/entity-helper';
import { AuthProvidersEnum } from 'src/auth/auth-providers.enum';

@Entity()
export class User extends EntityHelper {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'The unique identifier of the user' })
  id: number;

  @Column({ type: String, unique: true, nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email of the user',
    nullable: true,
  })
  email: string | null;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  password: string;

  // Previous password is not exposed in the API, so no ApiProperty decorator is needed here
  @Exclude({ toPlainOnly: true })
  public previousPassword: string;

  @AfterLoad()
  public loadPreviousPassword(): void {
    this.previousPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.previousPassword !== this.password && this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  @Column({ default: AuthProvidersEnum.email })
  @Expose({ groups: ['me', 'admin'] })
  @ApiProperty({
    example: AuthProvidersEnum.email,
    description: 'Authentication provider of the user',
  })
  provider: string;

  @Index()
  @Column({ type: String, nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  @ApiProperty({
    example: '1234567890',
    description: 'Social ID of the user',
    nullable: true,
  })
  socialId: string | null;

  @Index()
  @Column({ type: String, nullable: true })
  @ApiProperty({
    example: 'John',
    description: 'First name of the user',
    nullable: true,
  })
  firstName: string | null;

  @Index()
  @Column({ type: String, nullable: true })
  @ApiProperty({
    example: 'Doe',
    description: 'Last name of the user',
    nullable: true,
  })
  lastName: string | null;

  @ManyToOne(() => FileEntity, { eager: true })
  @ApiProperty({
    type: () => FileEntity,
    description: 'Photo file of the user',
    nullable: true,
  })
  photo?: FileEntity | null;

  @ManyToOne(() => Role, { eager: true })
  @ApiProperty({
    type: () => Role,
    description: 'Role of the user',
    nullable: true,
  })
  role?: Role | null;

  @ManyToOne(() => Status, { eager: true })
  @ApiProperty({
    type: () => Status,
    description: 'Status of the user',
    nullable: true,
  })
  status?: Status;

  @Column({ type: String, nullable: true })
  @Index()
  @Exclude({ toPlainOnly: true })
  @ApiProperty({
    example: 'someHash',
    description: 'Unique hash for the user',
    nullable: true,
  })
  hash: string | null;

  @CreateDateColumn()
  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: 'Creation date of the user record',
  })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: 'Last update date of the user record',
  })
  updatedAt: Date;

  @DeleteDateColumn()
  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: 'Deletion date of the user record',
    nullable: true,
  })
  deletedAt: Date;
}
