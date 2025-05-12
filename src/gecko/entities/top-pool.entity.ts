import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('top_pools')
export class TopPool {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  pool_ids: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;
}
