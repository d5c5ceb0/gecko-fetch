import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('pools')
export class Pool {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: false})
  address: string;

  @Column()
  name: string;

  @Column()
  symbol: string;

  @Column()
  token_address: string;

  @Column()
  price_change_percentage: string;

  @Column()
  transactions_5m: string

  @Column()
  holders: string;

  @Column()
  top10: string;

  @Column({ nullable: true })
  base_token_price_usd: string;

  @Column({ nullable: true })
  reserve_in_usd: string;

  @Column()
  dex: string;

  @Column({ nullable: true })
  link: string;

  @Column({ nullable: true })
  pool_created_at: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;
}
