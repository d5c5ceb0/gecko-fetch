import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('pools')
export class Pool {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: false})
  address: string;

  @Column()
  name: string;

  @Column({ type: 'numeric', nullable: true })
  base_token_price_usd: number;

  @Column({ type: 'numeric', nullable: true })
  reserve_in_usd: number;

  @Column()
  dex: string;

  @Column({ nullable: true })
  link: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;
}
