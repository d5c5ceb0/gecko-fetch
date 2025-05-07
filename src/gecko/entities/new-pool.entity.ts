import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('new_pools')
export class NewPool {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  pool_ids: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;
}
