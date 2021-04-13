/* eslint-disable @typescript-eslint/ban-types */
import { Challenge } from '@domain/challenge/challenge/challenge.entity';
import { Ecoverse } from '@domain/challenge/ecoverse';
import { Opportunity } from '@domain/challenge/opportunity/opportunity.entity';
import { Project } from '@domain/collaboration/project/project.entity';
import { Organisation } from '@domain/community/organisation/organisation.entity';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { getRepository } from 'typeorm';

export const IS_UNIQ_TEXT_ID = 'isUniqueTextId';

export enum TextIdType {
  ecoverse,
  challenge,
  opportunity,
  project,
  organisation,
}

@ValidatorConstraint({ name: IS_UNIQ_TEXT_ID, async: true })
export class IsUniqueTextIdConstraint implements ValidatorConstraintInterface {
  async validate(textId: any, args: ValidationArguments): Promise<boolean> {
    const valueToTest: string = textId.toString();
    const [target] = args.constraints;
    if (target === TextIdType.ecoverse) {
      return (
        (await getRepository(Ecoverse).findOne({
          where: { textID: valueToTest },
        })) === undefined
      );
    } else if (target === TextIdType.challenge) {
      return (
        (await getRepository(Challenge).findOne({
          where: { textID: valueToTest },
        })) === undefined
      );
    } else if (target === TextIdType.opportunity) {
      return (
        (await getRepository(Opportunity).findOne({
          where: { textID: valueToTest },
        })) === undefined
      );
    } else if (target === TextIdType.project) {
      return (
        (await getRepository(Project).findOne({
          where: { textID: textId },
        })) === undefined
      );
    } else if (target === TextIdType.organisation) {
      return (
        (await getRepository(Organisation).findOne({
          where: { textID: textId },
        })) === undefined
      );
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `TextID '${args.value}' already exists!`;
  }
}

export function IsUniqueTextId(
  type: TextIdType,
  validationOptions?: ValidationOptions
) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      async: true,
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [type],
      validator: IsUniqueTextIdConstraint,
    });
  };
}
