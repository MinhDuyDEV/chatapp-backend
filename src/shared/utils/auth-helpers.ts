import * as bcrypt from 'bcrypt';

export function hashText(text: string): string {
  return bcrypt.hashSync(text, bcrypt.genSaltSync(10));
}

export function compareText(text: string, hash: string): boolean {
  return bcrypt.compareSync(text, hash);
}
