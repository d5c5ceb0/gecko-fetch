import { Logger, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { CreateAnswerDto } from './dto/create-answer.dto';

@Injectable()
export class SurveyService {
  private readonly logger = new Logger(SurveyService.name);

  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {
    this.logger.log('SurveyService initialized');
  }

  async newAnswer(surveyAnswer: CreateAnswerDto) {
    try {
      this.logger.log(
        `New survey answer received: ${JSON.stringify(surveyAnswer)}`,
      );

      const answers: Answer[] = [];
      for (const answer of surveyAnswer.answers) {
        this.logger.log(`Processing answer: ${JSON.stringify(answer)}`);
        const newAnswer = this.answerRepository.create({
          chatId: surveyAnswer.chatId,
          questionId: answer.questionId,
          surveyId: surveyAnswer.surveyId,
          botName: surveyAnswer.botName,
          answer: answer.answer,
        });
        answers.push(newAnswer);
      }
      await this.answerRepository.save(answers);
    } catch (error) {
      this.logger.error('Error processing survey answer', error);
      throw new Error('Failed to process survey answer');
    }
  }
}
