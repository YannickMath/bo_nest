import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from 'src/Users/user.entity';
import { Repository } from 'typeorm';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { Transporter } from 'nodemailer';
import nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter!: Transporter<SMTPTransport.SentMessageInfo>;
  private readonly from: string;
  private readonly logger = new Logger(EmailService.name);
  private readonly usersRepository: Repository<UserEntity>;
  constructor(private readonly cfg: ConfigService) {
    const host = this.cfg.get<string>('SMTP_HOST');
    const port = Number(this.cfg.get('SMTP_PORT') ?? '2525');
    const user = this.cfg.get<string>('SMTP_USER');
    const pass = this.cfg.get<string>('SMTP_PASS');
    if (!user || !pass) throw new Error('SMTP_USER/SMTP_PASS manquants');

    this.from = this.cfg.get('EMAIL_FROM') ?? 'no-reply@example.com';
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: false,
      auth: { user, pass },
    });
    this.logger.log('📮 Transport: Mailtrap (Sandbox)');
  }

  async sendVerifyEmail(to: string, verifyUrl: string) {
    const html = `
      <h2>Bienvenue 👋</h2>
      <p>Clique pour activer ton compte :</p>
      <p><a href="${verifyUrl}" target="_blank" rel="noreferrer">Vérifier mon email</a></p>
      <p>Le lien expire dans ${this.cfg.get('JWT_EMAIL_EXPIRES') ?? '30m'}.</p>
    `;
    try {
      await this.transporter.sendMail({
        from: this.from,
        to,
        subject: 'Vérifie ton adresse email',
        html,
      });
      this.logger.log(`✅ Mail envoyé à ${to}`);
      return { success: true as const };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`❌ Erreur d’envoi à ${to}: ${msg}`);
      return { success: false as const, error: msg };
    }
  }
}
