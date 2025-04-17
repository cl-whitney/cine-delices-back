import 'dotenv/config';
import Scrypt from '../src/helpers/scrypt';

async function make() {
  const plain = 'MonSuperMdpAdmin123!';
  const hash = Scrypt.hash(plain);
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.log('Mot de passe en clair:', plain);
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.log('Hash Scrypt généré:', hash);
}

// async function make2() {
//   const plain = 'Monmdp123';
//   const _hash = Scrypt.hash(plain);
// }

make();
// make2();

