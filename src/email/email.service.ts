import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from 'src/Users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private from: string;
  private usersRepository: Repository<UserEntity>;
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly cfg: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.cfg.get('SMTP_HOST') ?? 'sandbox.smtp.mailtrap.io',
      port: parseInt(this.cfg.get('SMTP_PORT') ?? '2525', 10),
      auth: {
        user: this.cfg.get('SMTP_USER')!,
        pass: this.cfg.get('SMTP_PASS')!,
      },
    });
    console.log('this.transporter:', this.transporter);
    this.logger.log('📮 Transport: Mailtrap (Sandbox)');
  }

  async sendVerifyEmail(to: string, verifyUrl: string) {
    const html = `
      <h2>Bienvenue 👋</h2>
      <p>Pour activer ton compte, clique sur le lien :</p>
      <p><a href="${verifyUrl}" target="_blank" rel="noreferrer">Vérifier mon email</a></p>
      <p>Le lien expire dans ${this.cfg.get('JWT_EMAIL_EXPIRES') ?? '30m'}.</p>
      <hr/>
      <small>Si tu n'es pas à l'origine de cette demande, ignore ce message.</small>
    `;

    try {
      const info = await this.transporter.sendMail({
        from: this.from,
        to,
        subject: 'Vérifie ton adresse email',
        html,
      });

      this.logger.log(`✅ Mail envoyé à ${to}`);
      return { success: true };
    } catch (err: any) {
      this.logger.error(`❌ Erreur d’envoi à ${to}: ${err.message}`);
      return { success: false, error: err?.message || 'Unknown error' };
    }
  }

  async verifyEmail(
    userId: number,
  ): Promise<{ user: UserEntity; wasFirstTime: boolean }> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    if (user.emailVerified) {
      // déjà vérifié → idempotent
      return { user, wasFirstTime: false };
    }

    // première vérification
    user.emailVerified = true;
    await this.usersRepository.save(user);
    return { user, wasFirstTime: true };
  }
}
