# projet-cine-delices-back

## 🚀 Installation et lancement du projet

### 🛠️ Prérequis
Avant de commencer, assure-toi d'avoir installé :
- [Node.js](https://nodejs.org/) (verision 22)
- [PostgreSQL](https://www.postgresql.org/) (version 17)

### 📥 Commandes et scripts
 - Installer pnpm : npm install -g pnpm
 - Installer les dépendances du projet : pnpm i
 - Identifiants BDD (user, MDP, database) : cinedelices
 - PG url à copier dans .env : PG_URL=postgres://cinedelices:cinedelices@localhost/cinedelices
 - Se connecter au client pg et creer la BDD: psql -U cindelices -d cinedelices -f data/create_db.sql
 - Infos conexion Admin : 
   - admin : admin@cine-delice.local // et mot de passe : MonSuperMdpAdmin123!
   - menber : alice@example.com // et mot de passe : Monmdp123
  