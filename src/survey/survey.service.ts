import { Logger, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { Survey } from './entities/survey.entity';
import { Question } from './entities/question.entity';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { SurveyQuestion } from './entities/survey-question.entity';

@Injectable()
export class SurveyService {
  private readonly logger = new Logger(SurveyService.name);

  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
    @InjectRepository(SurveyQuestion)
    private readonly surveyQuestionRepository: Repository<SurveyQuestion>,
  ) {
    this.logger.log('SurveyService initialized');
  }

  async seed(questions: any, surveys: any, surveyQuestions: any) {
    try {
      this.logger.log('Seeding surveys...');
      for (const survey of surveys) {
        const existingSurvey = await this.surveyRepository.findOne({
          where: { id: survey.id },
        });
        if (!existingSurvey) {
          await this.surveyRepository.save(survey);
          this.logger.log(`Created survey: ${survey.id}`);
        } else {
          this.logger.log(`Survey already exists: ${survey.id}`);
        }
      }
      this.logger.log('Seeding questions...');
      for (const question of questions) {
        const existingQuest = await this.questionRepository.findOne({
          where: { id: question.id },
        });

        question.options = JSON.stringify(question.options);
        if (!existingQuest) {
          await this.questionRepository.save(question);

          this.logger.log(`Created question: ${question.id}`);
        }
      }
      this.logger.log('Questions seeding completed.');

      for (const surveyQuestion of surveyQuestions) {
        const survey = await this.surveyRepository.findOne({
          where: { id: surveyQuestion.id },
        });

        if (survey) {
          this.logger.log(
            `SurveyQuestion already exists for survey: ${survey.id}`,
          );
        } else {
          const survey = await this.surveyRepository.findOneBy({
            id: Number(surveyQuestion.surveyId),
          });
          if (!survey) {
            throw new NotFoundException('Survey not found');
          }

          const question = await this.questionRepository.findOneBy({
            id: Number(surveyQuestion.questionId),
          });
          if (!question) {
            throw new NotFoundException('Question not found');
          }
          const sq = this.surveyQuestionRepository.create({
            id: surveyQuestion.id,
            survey,
            question,
          });

          await this.surveyQuestionRepository.save(sq);
        }
      }
    } catch (error) {
      this.logger.error('Error seeding Questions', error);
    }
  }

  async newAnswer(surveyAnswer: CreateAnswerDto) {
    try {
      this.logger.log(
        `New survey answer received: ${JSON.stringify(surveyAnswer)}`,
      );

      const answers: Answer[] = [];
      for (const answer of surveyAnswer.answers) {
        this.logger.log(`Processing answer: ${JSON.stringify(answer)}`);

        const survey = await this.surveyRepository.findOneBy({
          id: Number(surveyAnswer.surveyId),
        });
        if (!survey) {
          throw new NotFoundException('Survey not found');
        }

        const question = await this.questionRepository.findOneBy({
          id: Number(answer.questionId),
        });
        if (!question) {
          throw new NotFoundException('Question not found');
        }

        const newAnswer = this.answerRepository.create({
          chatId: surveyAnswer.chatId,
          botName: surveyAnswer.botName,
          answer: answer.answer,
          survey: survey,
          question: question,
        });
        answers.push(newAnswer);
      }

      await this.answerRepository.save(answers);
    } catch (error) {
      this.logger.error('Error processing survey answer', error);
      throw new Error('Failed to process survey answer');
    }
  }

  async getSurvey(surveyId: string): Promise<Survey> {
    this.logger.log(`Fetching survey with ID: ${surveyId}`);
    const survey = await this.surveyRepository.findOne({
      where: { id: Number(surveyId) },
      //relations: ['surveyQuestions.question', 'answers'],
      relations: ['surveyQuestions.question'],
    });

    if (!survey) {
      this.logger.warn(`Survey not found with ID: ${surveyId}`);
      throw new NotFoundException('Survey not found');
    }

    survey.surveyQuestions.forEach((sq) => {
      sq.question.options = JSON.parse(sq.question.options);
    });

    if (!survey) {
      this.logger.warn(`Survey not found with ID: ${surveyId}`);
      throw new NotFoundException('Survey not found');
    }

    this.logger.log(`Survey found: ${JSON.stringify(survey)}`);
    return survey;
  }
}
