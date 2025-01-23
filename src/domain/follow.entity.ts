import {
    Entity,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    PrimaryColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { User } from './user.entity';
  
  @Entity('follows')
  export class Follow {
    @PrimaryColumn()
    follower_id: string;
  
    @PrimaryColumn()
    following_id: string;
  
    @ManyToOne(() => User)
    @JoinColumn({ name: 'follower_id' })
    follower: User;
  
    @ManyToOne(() => User)
    @JoinColumn({ name: 'following_id' })
    following: User;
  
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
  }