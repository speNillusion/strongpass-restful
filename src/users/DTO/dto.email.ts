import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { DbMain } from 'src/database/db.main';

export function EmailUnico(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'EmailUnico',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        async validate(value: any, args: ValidationArguments) {
          const db = new DbMain();
          try {
            
            const users = await db.getDb();
            return !users.some(user => user.email === value);
          } catch (error) {
            console.error('Erro ao verificar email no banco de dados:', error);
            return false;
          }
        },
        defaultMessage() {
          return 'O email já existe';
        }
      }
    });
  };
}
