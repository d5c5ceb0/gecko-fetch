import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class FetchDate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  twitter_id: string;

  @Column()
  start_time: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
