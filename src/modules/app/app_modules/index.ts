import { DynamicModule, ForwardReference, Type } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClsModule } from 'nestjs-cls';
import { LoggerModule } from 'nestjs-pino';
import { AppConfig } from '../app.config';
import { dataSourceOptions } from '../data-source';
import { AuthModule } from '@/modules/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { BullModule } from '@nestjs/bullmq';
import { FeedModule } from '@/modules/feed/feed.module';
import { InteractionModule } from '@/modules/interaction/interaction.module';
import { NotificationModule } from '@/modules/notification/notification.module';
import { ProfileFeedModule } from '@/modules/profile-feed/profile-feed.module';
import { SearchModule } from '@/modules/search/search.module';

export const appModules: (
  | Type<any>
  | DynamicModule
  | Promise<DynamicModule>
  | ForwardReference<any>
)[] = [
  // Allow to access .env file and validate env variables
  ConfigModule.forRoot(AppConfig.getInitConifg()),
  ClsModule.forRoot({
    global: true,
    middleware: { mount: true },
  }),
  // Logger framework that better then NestJS default logger
  LoggerModule.forRoot(AppConfig.getLoggerConfig()),
  // Typeorm config
  TypeOrmModule.forRoot(dataSourceOptions),
  // Throttler config
  ThrottlerModule.forRoot([AppConfig.getThrottlerConifg()]),
  // EventEmitter Module
  EventEmitterModule.forRoot({
    wildcard: true,
    delimiter: '.',
  }),
  ScheduleModule.forRoot(),

  // BullMQ config
  BullModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: false,
        attempts: 6,
        backoff: {
          type: 'exponential',
          delay: 2000, // 2 seconds
        },
      },
      connection: {
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        password: configService.get('REDIS_PASSWORD'),
      },
    }),
  }),
  AuthModule,
  UsersModule,
  FeedModule,
  InteractionModule,
  NotificationModule,
  ProfileFeedModule,
  SearchModule,
];
