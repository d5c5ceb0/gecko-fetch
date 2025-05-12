import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class SmartAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: false})
  address: string;

  @Column()
  owner: string;

  @Column()
  botname: string;

  @Column()//{ type: 'decimal', default: 0 })
  lastBalance: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
