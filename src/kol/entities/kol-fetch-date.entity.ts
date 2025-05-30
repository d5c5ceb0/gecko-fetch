import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class KolFetchDate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  twitter_id: string;

  @Column({ nullable: true })
  twitter_name: string;

  @Column({ nullable: true })
  start_time: Date;

  @Column({ nullable: true })
  bot_name: string;

  @Column({ nullable: true })
  chat_id: string;

  @Column({ nullable: true })
  node_id: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
