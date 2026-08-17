import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/user.entity';

export type AuthResult = {
  accessToken: string;
  user: { id: string; email: string; name?: string };
};

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  private readonly googleClient: OAuth2Client;
  private readonly googleClientId?: string;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    this.googleClient = new OAuth2Client(this.googleClientId);
  }

  async register(dto: RegisterDto): Promise<AuthResult> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = await this.usersService.create({
      email: dto.email,
      passwordHash,
      name: dto.name,
    });

    return this.buildAuthResult(user);
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    if (!user.passwordHash) {
      throw new UnauthorizedException(
        'Essa conta foi criada com Google - entre com o Google',
      );
    }
    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    return this.buildAuthResult(user);
  }

  async loginWithGoogle(idToken: string): Promise<AuthResult> {
    if (!this.googleClientId) {
      throw new UnauthorizedException(
        'Login com Google não configurado no servidor',
      );
    }

    let payload;
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.googleClientId,
      });
      payload = ticket.getPayload();
    } catch {
      throw new UnauthorizedException('Token do Google inválido');
    }

    if (!payload?.email || !payload.sub) {
      throw new UnauthorizedException('Token do Google inválido');
    }

    let user = await this.usersService.findByGoogleId(payload.sub);
    if (!user) {
      // E-mail ja cadastrado por senha - vincula a conta existente em vez
      // de criar um usuario duplicado com o mesmo e-mail (email e' unique).
      const existingByEmail = await this.usersService.findByEmail(
        payload.email,
      );
      user = existingByEmail
        ? await this.usersService.setGoogleId(existingByEmail.id, payload.sub)
        : await this.usersService.create({
            email: payload.email,
            googleId: payload.sub,
            name: payload.name,
          });
    }

    return this.buildAuthResult(user);
  }

  private buildAuthResult(user: User): AuthResult {
    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });
    return {
      accessToken,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }
}
