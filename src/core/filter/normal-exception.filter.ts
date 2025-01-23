import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { NormalException } from '@/core/exception/normal.exception';

@Catch(NormalException)
export class NormalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(NormalExceptionFilter.name);

  catch(exception: NormalException, host: ArgumentsHost) {
    this.logger.error(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(400).send(exception.toJSON()); // Bad Request
  }
}
