import 'dotenv/config';
import Scrypt from '../src/helpers/scrypt';

async function make() {
  const plain = 'MonSuperMdpAdmin123!';
  const hash = Scrypt.hash(plain);
  console.log('Mot de passe en clair:', plain);
  console.log('Hash Scrypt généré:', hash);
}

make();