import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { HttpSuccessResponse } from '@/core/shared/interfaces';
import { Observable, map } from 'rxjs';

// Re-format all non-error response
@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, HttpSuccessResponse<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler
  ): Observable<HttpSuccessResponse<T>> {
    return next.handle().pipe(map((data) => ({ data })));
  }
}
