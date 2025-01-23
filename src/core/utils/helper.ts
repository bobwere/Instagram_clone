// Centralized all pure function
import { NormalException } from '@/core/exception/normal.exception';
import { ApiResponseOptions } from '@nestjs/swagger';

export const toSwaggerError = (
  exception: NormalException,
  options?: ApiResponseOptions
) => {
  return {
    content: { 'application/json': { example: exception.toJSON() } },
    ...options,
  };
};
