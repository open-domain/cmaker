import { ValidationAcceptor, ValidationChecks } from 'langium';
import { CmakerAstType, Person } from './generated/ast';
import type { CmakerServices } from './cmaker-module';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: CmakerServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.CmakerValidator;
    const checks: ValidationChecks<CmakerAstType> = {
        Person: validator.checkPersonStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class CmakerValidator {

    checkPersonStartsWithCapital(person: Person, accept: ValidationAcceptor): void {
        if (person.name) {
            const firstChar = person.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', 'Person name should start with a capital.', { node: person, property: 'name' });
            }
        }
    }

}
