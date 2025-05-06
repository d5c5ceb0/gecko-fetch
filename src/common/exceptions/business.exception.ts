import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(message: string, code = 400) {
    super({ message, code }, code);
  }
}
