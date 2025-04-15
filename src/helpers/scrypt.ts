import { scryptSync, timingSafeEqual, randomBytes } from 'node:crypto';

class Scrypt {
    /**
     * Hash un mot de passe en utilisant scrypt avec un salt aléatoire.
     * @param password - Le mot de passe en clair.
     * @returns Le hash au format `${hash}.${salt}`
     */
    static hash(password: string): string {
        const salt = randomBytes(16).toString('hex');
        const buf = scryptSync(password, salt, 64, {
            N: 131072,
            maxmem: 134220800,
        });

        return `${buf.toString('hex')}.${salt}`;
    }

    /**
     * Compare un mot de passe en clair avec un hash.
     * @param plainTextPassword - Le mot de passe en clair.
     * @param hash - Le hash à comparer (format `${hash}.${salt}`).
     * @returns true si les mots de passe correspondent, sinon false.
     */
    static compare(plainTextPassword: string, hash: string): boolean {
        const [hashedPassword, salt] = hash.split('.');
        if (!hashedPassword || !salt) {
            return false;
        }

        const hashedPasswordBuf = Buffer.from(hashedPassword, 'hex');

        const clearPasswordBuffer = scryptSync(plainTextPassword, salt, 64, {
            N: 131072,
            maxmem: 134220800,
        });

        return timingSafeEqual(hashedPasswordBuf, clearPasswordBuffer);
    }
}

export default Scrypt;
