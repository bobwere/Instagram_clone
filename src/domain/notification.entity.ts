import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { User } from './user.entity';
import { BaseEntityProperties } from '@/core/shared/entities/base-properties.entity';
import { NotificationType } from '@/core/shared/enums/notification-type';
  

  @Entity('notifications')
  export class Notification  extends BaseEntityProperties {  
    @Column()
    user_id: string;
  
    @Column({
      type: 'enum',
      enum: NotificationType,
    })
    type: NotificationType;
  
    @Column()
    content: string;
  
    @Column({ default: false })
    read: boolean;
  
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
  }