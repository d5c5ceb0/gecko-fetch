import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Unique,
  ManyToOne,
} from 'typeorm';
import { Survey } from './survey.entity';
import { Question } from './question.entity';

@Entity()
export class SurveyQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Survey, (survey) => survey.surveyQuestions, {
    onDelete: 'CASCADE',
  })
  survey: Survey;

  @ManyToOne(() => Question, (question) => question.surveyQuestions, {
    eager: true,
  })
  question: Question;
}
