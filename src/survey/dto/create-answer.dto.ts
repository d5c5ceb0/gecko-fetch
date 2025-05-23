import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class Answer {
  @ApiProperty({ example: '1234567890' })
  @IsString()
  questionId: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  answer: string;
}

export class CreateAnswerDto {
  @ApiProperty({ example: '1234567890' })
  @IsString()
  userId: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  chatId: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  surveyId: string;

  @ApiProperty({ example: 'xxx_bot' })
  @IsString()
  botName: string;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Answer)
  answers: Answer[];
}
