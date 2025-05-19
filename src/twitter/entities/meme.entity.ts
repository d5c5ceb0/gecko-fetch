import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Meme {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  tweet_id: string;

  @Column('text')
  content: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}

