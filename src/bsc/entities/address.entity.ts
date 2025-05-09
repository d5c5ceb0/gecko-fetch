import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class SmartAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  address: string;

  @Column()
  owner: string;

  @Column()//{ type: 'decimal', default: 0 })
  lastBalance: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
