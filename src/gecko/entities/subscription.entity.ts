import { Entity, Column, Unique, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Unique(['bot_name', 'telegram_id'])
@Entity('subscriptions')
export class SubscriptionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bot_name: string;

  @Column()
  chat_name: string;

  @Column()
  telegram_id: string;

  @Column()
  status: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

}
