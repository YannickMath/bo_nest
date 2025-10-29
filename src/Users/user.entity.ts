import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ unique: true }) username: string;
  @Column({ unique: true }) email: string;
  @Column() password: string;
  @Column({ default: 'user' }) role: string;
  @Column({ default: false }) isActive: boolean;
  @Column({ default: false }) emailVerified: boolean;
  @Column({ type: 'timestamptz', nullable: true }) lastLoginAt: Date | null;
  @CreateDateColumn({ type: 'timestamptz' }) createdAt: Date;
  @UpdateDateColumn({ type: 'timestamptz' }) updatedAt: Date;
}
