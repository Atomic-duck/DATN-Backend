import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'time', async: false })
export class TimeFormat implements ValidatorConstraintInterface {
   validate(value: string, args: ValidationArguments) {
      const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/; // Regex for "hh:mm" format
      return timeRegex.test(value)
   }

   defaultMessage(args: ValidationArguments) {
      // here you can provide default error message if validation failed
      return 'Invalid time format. Expected "hh:mm" format.';
   }
}
