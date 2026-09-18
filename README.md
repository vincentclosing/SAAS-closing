# Closer Stats

Dashboard privé pour suivre tes stats de closer (calls, taux de closing, cash
contracté/collecté) et les présenter à des infopreneurs. Next.js + Supabase +
Netlify.

## Stack

- Next.js 16 (App Router, TypeScript, Server Actions)
- Tailwind CSS 4 (dark mode)
- Supabase (Postgres) — accédé uniquement côté serveur via la service role key
- Auth maison (pas de Supabase Auth) : cookie de session signé (JWT via `jose`)
- Déploiement Netlify (`@netlify/plugin-nextjs`)

## 1. Créer le projet Supabase

1. Crée un projet sur [supabase.com](https://supabase.com).
2. Va dans **SQL Editor** → **New query**, colle le contenu de
   [`supabase/schema.sql`](supabase/schema.sql) et exécute-le. Ça crée les
   tables `app_config`, `kpis`, `calls` avec RLS activé (aucune policy : seule
   la service role key peut lire/écrire).
3. Va dans **Project Settings → API** et récupère :
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `service_role` key (secret !) → `SUPABASE_SERVICE_ROLE_KEY`

## 2. Configurer les variables d'environnement

Copie `.env.local.example` en `.env.local` et remplis :

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxxxx
SESSION_SECRET=xxxxx   # génère avec la commande ci-dessous
```

Pour générer un `SESSION_SECRET` :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 3. Lancer en local

```bash
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000). Comme l'app n'est pas
encore configurée, tu seras redirigé vers `/setup` pour créer :

- ton **nom d'utilisateur + code admin**
- le **code visiteur** unique à partager aux infopreneurs

Une fois fait, tu es connecté en admin. Va sur **Admin** dans la nav pour
changer le code visiteur ou ton code admin à tout moment.

## 4. Utilisation

- **Dashboard (`/`)** : cards KPI (calls, taux de closing, taux de show up,
  cash contracté, cash collecté). Modifiable via "Modifier les stats"
  (admin uniquement).
- **Calls / RP (`/calls`)** : liste des calls clients et roleplays (titre,
  date, type, lien d'enregistrement, note/feedback). Ajout / modification /
  suppression réservés à l'admin.
- **Admin (`/admin`)** : changer le code visiteur partagé et ton code admin.
- Le visiteur se connecte uniquement avec le **code visiteur** (pas de nom
  d'utilisateur), et n'a accès qu'en lecture seule.

## 5. Déployer sur Netlify

1. Pousse le repo sur GitHub.
2. Sur [Netlify](https://app.netlify.com), **Add new site → Import an
   existing project**, sélectionne le repo.
3. Netlify détecte `netlify.toml` (build command `npm run build`, plugin
   `@netlify/plugin-nextjs`). Aucune config supplémentaire nécessaire.
4. Dans **Site settings → Environment variables**, ajoute les 3 variables
   (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
   `SESSION_SECRET`) avec les mêmes valeurs qu'en local (génère un
   `SESSION_SECRET` différent pour la prod si tu veux).
5. Déploie. Au premier accès, tu retomberas sur `/setup` pour configurer
   l'admin et le code visiteur de cet environnement.

## Sécurité

- Le client Supabase avec la service role key n'est **jamais** importé dans
  un composant client (`import "server-only"` le garantit).
- Les mots de passe / codes sont hashés avec bcrypt avant stockage.
- La session est un JWT signé (HS256) dans un cookie `httpOnly`,
  `sameSite=lax`, `secure` en production.
- Le rôle visiteur ne peut appeler aucune Server Action de modification :
  chacune vérifie `requireAdmin()` côté serveur avant d'écrire en base.
