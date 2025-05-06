import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse {
  @ApiProperty({ example: 500 })
  code: number;

  @ApiProperty({ example: 'Internal Server Error' })
  message: string;

  @ApiProperty({ example: 'An error occurred while processing your request.' })
  error: string;

  @ApiProperty({ example: null })
  data: null;
}
