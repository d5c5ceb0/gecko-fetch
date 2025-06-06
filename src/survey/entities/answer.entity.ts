import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Survey } from './survey.entity';
import { Question } from './question.entity';

@Entity('answers')
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chatId: string;

  @Column()
  botName: string;

  @Column({ nullable: true, type: 'text' })
  answer: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Survey, (survey) => survey.answers, { onDelete: 'CASCADE' })
  survey: Survey;

  @ManyToOne(() => Question, { eager: true })
  question: Question;
}
