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
import { BaseEntityProperties } from '@/core/shared/entities/base-properties.entity';
  
  @Entity('feed')
  export class Feed extends BaseEntityProperties {  
    @Column()
    user_id: string;
  
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
    
    @Column()
    url: string;
  
    @Column({ nullable: true })
    description: string;
  
    @Column('text', { array: true })
    hashtags: string[];
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }