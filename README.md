# The Iron Vault

Magazin online de jocuri video cu identitate dark-fantasy medievală. Construit cu Next.js 16 (App Router), TypeScript strict, Tailwind CSS v4, Prisma 6 și MongoDB.

## Rulare

1. Instalează dependențele (rulează automat și `prisma generate`):

   ```bash
   npm install
   ```

2. Copiază `.env.example` în `.env` și completează `DATABASE_URL`. MongoDB trebuie să ruleze ca **replica set** (MongoDB Atlas are asta implicit; o instanță locală simplă nu merge cu Prisma).

3. Creează colecțiile și indecșii, apoi populează baza cu cele 22 de jocuri:

   ```bash
   npx prisma db push
   npm run seed
   ```

4. Pornește serverul de dezvoltare:

   ```bash
   npm run dev
   ```

## Imagini

Imaginea hero (`public/images/hero-vault.png`) este ilustrația finală. Restul imaginilor din `public/images` sunt placeholdere generate procedural (siluete în culori plate, cu grain):

```bash
npm run images
```

Pentru imaginile reale, înlocuiește fișierele păstrând căile:

- `public/images/games/<slug>/cover.jpg` (3:4) și `shot-1..4.jpg` (16:9)
- `public/images/genres/<gen>.jpg`, `public/images/team/<n>.jpg`

Dacă rulezi din nou `npm run images`, placeholderele suprascriu imaginile reale (în afară de hero).

## Structură

- `app/`: rutele (`/`, `/produse`, `/produse/[slug]`, `/despre-noi`, `/contact`, `/cos`) și Server Actions (`app/actions.ts`)
- `components/ui/`: Button, Badge, Card, Input, Select, Checkbox, Skeleton, Divider
- `components/layout/`: Navbar, Footer, MobileMenu
- `components/games/`: GameCard, GameGrid, Filters, SortSelect, Pagination, Gallery, Tabs
- `lib/`: clientul Prisma, interogări, scheme Zod, formatare, coșul (localStorage)
- `prisma/`: schema, datele jocurilor și seed-ul
- Tokenii de design sunt în `app/globals.css` (`@theme`)
