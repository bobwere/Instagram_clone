import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const { user } = context.switchToHttp().getRequest();

    if (data) {
      return user[data];
    }

    return user;
  }
);
