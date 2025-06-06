import {
  Logger,
  HttpCode,
  Get,
  Body,
  Post,
  Controller,
  Query,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { SurveyService } from './survey.service';

@Controller('api/v1/survey')
export class SurveyController {
  private readonly logger = new Logger(SurveyController.name);

  constructor(private readonly surveyService: SurveyService) {}

  @Post('answers')
  @HttpCode(200)
  async createAnswers(@Body() createAnswerDto: CreateAnswerDto) {
    try {
      this.logger.log('Received survey answer:', createAnswerDto);
      await this.surveyService.newAnswer(createAnswerDto);

      return 'Survey answer submitted successfully';
    } catch (error) {
      this.logger.error('Error submitting survey answer:', error);
      throw new Error('Error submitting survey answer');
    }
  }

  @Get('answers')
  async getAnswers() {
    return {
      message: 'Survey answers retrieved successfully',
    };
  }

  @Get('survey')
  @ApiQuery({
    name: 'surveyId',
    required: false,
    description: 'ID of the survey to retrieve',
    type: String,
  })
  async getSurvey(@Query('surveyId') surveyId: string) {
    try {
      this.logger.log(`Retrieving survey with ID: ${surveyId}`);
      const survey = await this.surveyService.getSurvey(surveyId);
      return survey;
    } catch (error) {
      this.logger.error(`Error retrieving survey with ID ${surveyId}:`, error);
      throw new Error('Error retrieving survey');
    }
  }
}
