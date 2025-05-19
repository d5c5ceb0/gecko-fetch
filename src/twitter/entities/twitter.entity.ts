import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Twitter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true})
  account: string;

  @Column({ unique: true })
  uid: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
