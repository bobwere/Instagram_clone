import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { User } from './user.entity';
import { Feed } from './feed.entity';
import { BaseEntityProperties } from '@/core/shared/entities/base-properties.entity';
  
  @Entity('comments')
  export class Comment  extends BaseEntityProperties  {
    @Column()
    user_id: string;
  
    @Column()
    feed_id: string;
  
    @Column()
    body: string;
  
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @ManyToOne(() => Feed)
    @JoinColumn({ name: 'feed_id' })
    feed: Feed;
  }