import { Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CredentialsSearchInput, ICredential } from '@domain/agent';
import { AuthorizationCredentialRule } from './authorization.credential.rule';
import { AuthorizationPrivilege } from '@common/enums/authorization.privilege';
import { ForbiddenException } from '@common/exceptions';
import { ConfigurationTypes, LogContext } from '@common/enums';
import { IAuthorizationDefinition } from '@domain/common/authorization-definition';
import { AgentInfo } from '@core/authentication';
import { ConfigService } from '@nestjs/config';

export class AuthorizationEngineService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private configService: ConfigService
  ) {}

  grantAccessOrFail(
    agentInfo: AgentInfo,
    authorization: IAuthorizationDefinition | undefined,
    privilegeRequired: AuthorizationPrivilege,
    msg: string
  ) {
    const auth = this.validateAuthorization(authorization);
    if (this.isUserAccessGranted(agentInfo, auth, privilegeRequired))
      return true;

    const errorMsg = `Authorization: unable to grant '${privilegeRequired}' privilege: ${msg}`;
    this.logCredentialCheckFailDetails(errorMsg, agentInfo, auth);

    // If get to here then no match was found
    throw new ForbiddenException(errorMsg, LogContext.AUTH);
  }

  logCredentialCheckFailDetails(
    errorMsg: string,
    agentInfo: AgentInfo,
    authorization: IAuthorizationDefinition
  ) {
    this.logger.verbose?.(
      `${errorMsg}; agentInfo: ${
        agentInfo.email
      } has credentials '${JSON.stringify(
        agentInfo.credentials
      )}'; authorization definition: anonymousAccess=${
        authorization?.anonymousReadAccess
      } & rules: ${JSON.stringify(authorization?.credentialRules)}`,
      LogContext.AUTH
    );
  }

  validateAuthorization(
    authorization: IAuthorizationDefinition | undefined
  ): IAuthorizationDefinition {
    if (!authorization)
      throw new ForbiddenException(
        'Authorization: no definition provided',
        LogContext.AUTH
      );
    return authorization;
  }

  isUserAccessGranted(
    agentInfo: AgentInfo,
    authorization: IAuthorizationDefinition,
    privilegeRequired: AuthorizationPrivilege
  ) {
    // always allow if authorization is disabled
    const authEnabled = this.configService.get(ConfigurationTypes.Identity)
      ?.authentication?.enabled;
    if (!authEnabled) return true;

    return this.isAccessGranted(
      agentInfo.credentials,
      authorization,
      privilegeRequired
    );
  }

  isAccessGranted(
    credentials: ICredential[],
    authorization: IAuthorizationDefinition,
    privilegeRequired: AuthorizationPrivilege
  ) {
    if (
      authorization.anonymousReadAccess &&
      privilegeRequired === AuthorizationPrivilege.READ
    )
      return true;

    const credentialRules: AuthorizationCredentialRule[] = this.convertCredentialRulesStr(
      authorization.credentialRules
    );
    for (const rule of credentialRules) {
      for (const credential of credentials) {
        if (
          credential.type === rule.type &&
          credential.resourceID === rule.resourceID
        ) {
          for (const privilege of rule.grantedPrivileges) {
            if (privilege === privilegeRequired) return true;
          }
        }
      }
    }
    return false;
  }

  appendCredentialAuthorizationRule(
    authorization: IAuthorizationDefinition | undefined,
    credentialCriteria: CredentialsSearchInput,
    privileges: AuthorizationPrivilege[]
  ): IAuthorizationDefinition {
    const auth = this.validateAuthorization(authorization);
    const rules = this.convertCredentialRulesStr(auth.credentialRules);
    const newRule: AuthorizationCredentialRule = {
      type: credentialCriteria.type,
      resourceID: credentialCriteria.type,
      grantedPrivileges: privileges,
    };
    rules.push(newRule);
    auth.credentialRules = JSON.stringify(rules);
    return auth;
  }

  setAnonymousAccess(
    authorization: IAuthorizationDefinition | undefined,
    newValue: boolean
  ): IAuthorizationDefinition {
    const auth = this.validateAuthorization(authorization);
    auth.anonymousReadAccess = newValue;
    return auth;
  }

  inheritParentAuthorization(
    childAuthorization: IAuthorizationDefinition | undefined,
    parentAuthorization: IAuthorizationDefinition | undefined
  ): IAuthorizationDefinition {
    const child = this.validateAuthorization(childAuthorization);
    const parent = this.validateAuthorization(parentAuthorization);
    const newRules = this.convertCredentialRulesStr(parent.credentialRules);
    this.appendCredentialAuthorizationRules(child, newRules);
    child.anonymousReadAccess = parent.anonymousReadAccess;
    return child;
  }

  appendCredentialAuthorizationRules(
    authorization: IAuthorizationDefinition | undefined,
    additionalRules: AuthorizationCredentialRule[]
  ): IAuthorizationDefinition {
    const auth = this.validateAuthorization(authorization);

    const existingRules = this.convertCredentialRulesStr(auth.credentialRules);
    for (const additionalRule of additionalRules) {
      existingRules.push(additionalRule);
    }

    auth.credentialRules = JSON.stringify(existingRules);
    return auth;
  }

  convertCredentialRulesStr(rulesStr: string): AuthorizationCredentialRule[] {
    if (!rulesStr || rulesStr.length == 0) return [];
    try {
      const rules: AuthorizationCredentialRule[] = JSON.parse(rulesStr);
      return rules;
    } catch (error) {
      const msg = `Unable to convert rules to json: ${error}`;
      this.logger.error(msg);
      throw new ForbiddenException(msg, LogContext.AUTH);
    }
  }
}
