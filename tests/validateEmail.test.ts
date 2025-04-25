import validateEmail from '../src/helpers/validateEmail';

describe('validateEmail()', () => {
  it('retourne un tableau (RegExpMatchArray) pour une adresse valide', () => {
    const email = 'test@example.com';
    const result = validateEmail(email);

    expect(result).not.toBeNull();
    expect(Array.isArray(result)).toBe(true);
    expect(result![0]).toBe(email);
  });

  it('retourne null pour une adresse invalide', () => {
    expect(validateEmail('pas-une-adresse')).toBeNull();
    expect(validateEmail('a@b')).toBeNull();
    expect(validateEmail('foo@.com')).toBeNull();
  });
});
