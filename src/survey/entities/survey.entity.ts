import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Question } from './question.entity';
import { SurveyQuestion } from './survey-question.entity';
import { Answer } from './answer.entity';

@Entity('surveys')
export class Survey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  creator: string;

  @Column({ unique: true })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => SurveyQuestion, (sq) => sq.survey, {
    cascade: true,
  })
  surveyQuestions: SurveyQuestion[];

  @OneToMany(() => Answer, (answer) => answer.survey)
  answers: Answer[];
}
