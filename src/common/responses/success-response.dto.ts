import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponse<T> {
  @ApiProperty({ example: 200 })
  code: number;

  @ApiProperty({ example: 'Success' })
  message: string;

  @ApiProperty({ example: null })
  error: null;

  @ApiProperty()
  data: T;
}
