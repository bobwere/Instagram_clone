import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { BaseEntityProperties } from '@/core/shared/entities/base-properties.entity';

@Entity('users')
export class User extends BaseEntityProperties {
  @ApiProperty({ type: String })
  @Expose()
  @Column({ nullable: true })
  name: string;

  @ApiProperty({ type: String })
  @Expose()
  @Column({ unique: true })
  @Index()
  email: string;

  @Column()
  @Exclude()
  password: string;

  // @ApiProperty({ enum: UserRoles })
  // @Expose()
  // @Column({ type: 'enum', enum: UserRoles, default: UserRoles.NORMAL_USER })
  // role: UserRoles;

  // @ApiProperty({ enum: AccountStatus })
  // @Expose()
  // @Column({
  //   type: 'enum',
  //   enum: AccountStatus,
  //   default: AccountStatus.ACTIVATED,
  // })
  // accountStatus: AccountStatus;
}
