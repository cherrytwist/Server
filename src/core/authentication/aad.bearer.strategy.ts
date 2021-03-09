import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import { PassportStrategy } from '@nestjs/passport';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { BearerStrategy } from 'passport-azure-ad';
import { AuthenticationException } from '@common/exceptions';
import { ITokenPayload } from 'passport-azure-ad';
import { IAzureADConfig } from '@src/common/interfaces/aad.config.interface';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AadBearerStrategy extends PassportStrategy(
  BearerStrategy,
  'azure-ad'
) {
  constructor(
    private configService: ConfigService,
    private authService: AuthenticationService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {
    super({
      ...configService.get<IAzureADConfig>('aad'),
    });
  }

  async validate(
    _req: Request,
    token: IExtendedTokenPayload,
    done: CallableFunction
  ): Promise<any> {
    const email = token.email;

    try {
      if (!email)
        throw new AuthenticationException(
          'Email claim missing from JWT token!'
        );

      const knownUser = await this.authService.createUserInfo(email);

      return done(null, knownUser, token);
    } catch (error) {
      done(
        new AuthenticationException(
          `Failed adding the user to the request object: ${error}`
        )
      );
    }
  }
}

interface IExtendedTokenPayload extends ITokenPayload {
  /** User email. */
  email?: string;
}
