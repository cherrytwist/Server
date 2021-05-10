import {
  Injectable,
  ExecutionContext,
  Inject,
  LoggerService,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { ConfigService } from '@nestjs/config';
import { IServiceConfig } from '@src/common/interfaces/service.config.interface';
import { Reflector } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LogContext } from '@common/enums';
import { AuthenticationException } from '@common/exceptions/authentication.exception';
import { TokenException } from '@common/exceptions/token.exception';
import { ForbiddenException } from '@common/exceptions/forbidden.exception';
import { CherrytwistErrorStatus } from '@common/enums/cherrytwist.error.status';
import {
  IAuthorizationRule,
  AuthorizationRuleGlobalRole,
} from '@src/core/authorization/rules';
import { IUser } from '@domain/community/user';
import {
  AuthorizationRolesGlobal,
  AuthorizationRuleSelfManagement,
  AuthorizationRuleEcoverseMember,
} from '@core/authorization';

@Injectable()
export class AuthorizationRulesGuard extends AuthGuard([
  'azure-ad',
  'demo-auth-jwt',
]) {
  JWT_EXPIRED = 'jwt is expired';

  private authorizationRules!: IAuthorizationRule[];

  constructor(
    private configService: ConfigService,
    private reflector: Reflector,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    if (!this.authorizationRules) this.authorizationRules = [];

    const globalRoles = this.reflector.get<string[]>(
      'authorizationGlobalRoles',
      context.getHandler()
    );
    if (globalRoles) {
      for (const role of globalRoles) {
        const allowedRoles: string[] = Object.values(AuthorizationRolesGlobal);
        if (allowedRoles.includes(role)) {
          const rule = new AuthorizationRuleGlobalRole(role);
          this.authorizationRules.push(rule);
        } else {
          throw new ForbiddenException(
            `Invalid global role specified: ${role}`,
            LogContext.AUTH
          );
        }
      }
    }

    const selfManagement = this.reflector.get<boolean>(
      'self-management',
      context.getHandler()
    );
    if (selfManagement) {
      const args = context.getArgByIndex(1);
      const fieldName = context.getArgByIndex(3).fieldName;
      const rule = new AuthorizationRuleSelfManagement(fieldName, args);
      this.authorizationRules.push(rule);
    }

    const ecoverseMember = this.reflector.get<boolean>(
      'ecoverse-member',
      context.getHandler()
    );
    if (ecoverseMember) {
      const parentArg = context.getArgByIndex(0);
      const rule = new AuthorizationRuleEcoverseMember(parentArg);
      this.authorizationRules.push(rule);
    }

    return super.canActivate(new ExecutionContextHost([req]));
  }

  handleRequest(
    err: any,
    userInfo: any,
    info: any,
    _context: any,
    _status?: any
  ) {
    // Always handle the request if authentication is disabled
    const authEnabled = this.configService.get<IServiceConfig>('service')
      ?.authenticationEnabled;
    if (!authEnabled) {
      return userInfo;
    }

    if (info && info[0] === this.JWT_EXPIRED)
      throw new TokenException(
        'Access token has expired!',
        CherrytwistErrorStatus.TOKEN_EXPIRED
      );

    if (err) throw new AuthenticationException(err);

    if (!userInfo) {
      const msg = this.buildErrorMessage(err, info);
      throw new AuthenticationException(msg);
    }

    const user: IUser = userInfo.user;
    for (const rule of this.authorizationRules) {
      if (rule.evaluate(user)) return userInfo;
    }

    throw new ForbiddenException(
      `User '${userInfo.email}' is not authorised to access requested resources.`,
      LogContext.AUTH
    );
  }

  private buildErrorMessage(err: any, info: any): string {
    if (err) return err;
    if (info) {
      const msg = info[0] as string;
      if (msg && msg.toLowerCase().includes('error')) return msg;
    }

    return 'Failed to retrieve authenticated account information from the graphql context! ';
  }
}