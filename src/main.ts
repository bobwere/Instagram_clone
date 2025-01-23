import { AppConfig, AppModule } from '@mod/app';
import { NestApplication, NestFactory } from '@nestjs/core';
import { clusterize } from '@/core/utils/clustering';
import helmet from 'helmet';
import { Logger, PinoLogger } from 'nestjs-pino';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const { BASE_PATH, CLUSTERING, PORT, COOKIE_SECRET } = process.env;

const bootstrap = async () => {
  const INADDR_ANY = '0.0.0.0';

  const app = await NestFactory.create<NestApplication>(
    AppModule,
    // this logger instance only for logging the app init message (e.g. InstanceLoader),
    // since before booting the app, LoggerModule is not loaded yet
    { logger: new Logger(new PinoLogger(AppConfig.getLoggerConfig()), {}) }
  );

  app.enableVersioning();

  // properly set headers using helmet
  app.use(helmet());

  // Cookie parser
  app.use(cookieParser(`${COOKIE_SECRET}`));

  // Enable CORS by default because Swagger UI required
  app.enableCors();

  app.setGlobalPrefix(BASE_PATH);

  app.listen(PORT, INADDR_ANY);
};
if (CLUSTERING === 'true') clusterize(bootstrap);
else bootstrap();
