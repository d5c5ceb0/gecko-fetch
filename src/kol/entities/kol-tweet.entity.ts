import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class KolTweet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: string;

  @Column()
  user_name: string;

  @Column({ unique: true })
  tweet_id: string;

  @Column('text')
  content: string;

  @Column({ type: 'timestamp' })
  published_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
