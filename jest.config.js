/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // Indique à Jest d’utiliser ts-jest pour les fichiers .ts/.tsx
  preset: 'ts-jest',

  // Environnement d’exécution
  testEnvironment: 'node',

  // Répertoires où Jest va chercher les tests
  roots: ['<rootDir>/tests'],

  // Pattern des fichiers de test
  testMatch: ['**/*.test.ts'],

  // Extensions de modules à prendre en charge
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],

  // Transformation des fichiers avant exécution
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },

  // Facultatif : ignorer node_modules pour la transformation
  transformIgnorePatterns: ['/node_modules/'],
};
