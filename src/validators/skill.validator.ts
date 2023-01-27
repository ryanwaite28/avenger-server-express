import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { get_skill_by_name } from '../repos/skill.repo';
import validator from 'validator';



@ValidatorConstraint({ async: true })
export class IsSkillNameExistConstraint implements ValidatorConstraintInterface {
  validate(propValue: any, args: ValidationArguments) {
    // checking
    console.log(`ValidatorConstraint: checking skill...`);
    const promise = get_skill_by_name(propValue).then(result => !!result);
    return promise;
  }
}

export function IsSkillExists(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsSkillNameExistConstraint,
    });
  };
}
