# Maeritina Quincaillerie — Projet complet

Site vitrine React.js connecté à une API Node.js/Express et à MySQL, avec un Back-Office léger limité au tableau de bord et à la gestion des produits/prix, conformément à la fiche de mission Honey Group.

## Technologies
- Frontend : React.js, Vite, React Router, CSS, Lucide React
- Backend : Node.js, Express
- Base de données : MySQL (`mysql2`)
- Sécurité de l'administration : identifiants stockés côté serveur dans `backend/.env`, jeton signé HMAC avec expiration

## Structure
- `src/` : site public React et pages d'administration
- `backend/` : API Express, connexion MySQL, routes et contrôleurs
- `database/maeritina_db.sql` : création des quatre tables métier
- `docs/` : cahier des charges fourni

## 1. Base de données
La base `maeritina_db` et les quatre tables prévues dans la fiche de mission sont :
`categories`, `produits`, `marques_vehicules`, `demandes_devis`.

Si la base a déjà été importée et contient vos données, ne réimportez pas le SQL sans sauvegarde préalable.

## 2. Configuration du backend
Dans `backend/`, copiez `.env.example` vers `.env` puis configurez vos valeurs :
```env
PORT=5000
CLIENT_URL=http://localhost:5173
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=maeritina_db

ADMIN_USERNAME=admin
ADMIN_PASSWORD=choisir_un_mot_de_passe_long_et_unique
ADMIN_TOKEN_SECRET=une_cle_aleatoire_secrete_de_64_caracteres_minimum
```
Remplacez impérativement `ADMIN_PASSWORD` et `ADMIN_TOKEN_SECRET` avant toute utilisation. Gardez `backend/.env` privé et ne le publiez jamais dans Git.

Générez une clé secrète aléatoire d'au moins 32 caractères, par exemple avec Node.js :
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Installez et testez :
```bash
cd backend
npm install
npm run test:db
npm run dev
```
L'API démarre sur `http://localhost:5000`. Vérifiez `http://localhost:5000/api/health`.

## 3. Configuration et lancement du frontend
À la racine du projet, copiez `.env.example` vers `.env` et vérifiez :
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_WHATSAPP_NUMBER=261000000000
```
Remplacez le numéro WhatsApp d'exemple par le numéro officiel de Maeritina.

Dans un deuxième terminal, à la racine :
```bash
npm install
npm run dev
```
Vite affiche l'adresse locale, généralement `http://localhost:5173`.

## 4. Back-Office
- Connexion : `http://localhost:5173/admin/login`
- Tableau de bord : `http://localhost:5173/admin`
- Gestion des produits : `http://localhost:5173/admin/products`

Le tableau de bord affiche uniquement le nombre de produits actifs et le nombre de catégories actives. La gestion des produits permet de lister, rechercher, ajouter, modifier et supprimer (désactivation logique) un produit, y compris son prix, sa catégorie, sa référence OEM, sa disponibilité, sa description et l'URL de son image.

Les catégories sont lues depuis la table `categories` pour alimenter le formulaire. Il n'y a pas de module indépendant de gestion des catégories, des utilisateurs, des commandes ou des stocks.

La suppression est logique (`actif = 0`) afin de préserver l'historique et les relations. Les produits désactivés ne sont plus affichés dans le catalogue public.

## 5. API principales
Routes publiques :
- `GET /api/health`
- `GET /api/categories`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/quotes`

Routes d'administration :
- `POST /api/admin/login`
- `GET /api/admin/dashboard` (authentification requise)
- `GET /api/admin/products` (authentification requise)
- `POST /api/admin/products` (authentification requise)
- `PUT /api/admin/products/:id` (authentification requise)
- `DELETE /api/admin/products/:id` (authentification requise)

## 6. Tests et limites à vérifier localement
Après installation, tester :
1. `npm run test:db` dans `backend/`.
2. `GET http://localhost:5000/api/health`.
3. Le catalogue public et les fiches produits.
4. La connexion à `/admin/login`.
5. L'ajout, la modification du prix et la suppression logique d'un produit.
6. Le formulaire de devis.

Les tests nécessitent votre instance MySQL et vos identifiants locaux. Le ZIP ne contient volontairement aucun fichier `.env` ni mot de passe réel.
