import validateEmail from '../src/helpers/validateEmail';

describe('validateEmail()', () => {
  it('retourne true pour une adresse valide', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });

  it('retourne false pour une adresse invalide', () => {
    expect(validateEmail('pas-une-adresse')).toBe(false);
    expect(validateEmail('a@b')).toBe(false);
  });
});
