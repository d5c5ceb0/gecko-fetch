import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Survey } from './survey.entity';
import { SurveyQuestion } from './survey-question.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  section: string;

  @Column()
  type: string;

  @Column({ type: 'text' })
  question: string;

  @Column({ nullable: true, type: 'text' })
  options: string;

  @Column()
  required: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => SurveyQuestion, (sq) => sq.question, {
    cascade: true,
  })
  surveyQuestions: SurveyQuestion[];
}
