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

## Limbi (RO / RU / EN)

Selectorul de limbă din header salvează alegerea în cookie-ul `lang` (un an), iar serverul randează fiecare pagină direct în limba aleasă. Adresele paginilor sunt aceleași pentru toate limbile.

- Toate textele interfeței sunt în `lib/i18n/dictionaries/`: `ro.ts` (limba implicită, definește structura), `ru.ts`, `en.ts`. TypeScript semnalează orice cheie lipsă într-o traducere.
- Componentele de server folosesc `getDictionary()` / `getI18n()` din `lib/i18n/server.ts`; componentele client folosesc `useI18n()`.
- O limbă nouă: adaugă codul în `lib/i18n/config.ts` și un dicționar nou în `lib/i18n/dictionaries/`.
- Descrierile jocurilor sunt stocate pe limbi (`description.ro` / `.ru` / `.en`, tipul `LocalizedText` din `prisma/schema.prisma`). Dacă o traducere lipsește, se afișează în ordine engleza, româna, apoi rusa (`lib/localized-text.ts`). Textele complete, în toate cele trei limbi, sunt în `prisma/game-descriptions.ts`; `npm run update:descriptions` le aplică în baza de date.
- O bază de date creată înainte de această schimbare, cu `description` ca text simplu, se convertește cu `npm run migrate:descriptions`. Migrarea e non-distructivă și poate fi rulată de mai multe ori.

## Structură

- `app/`: rutele (`/`, `/produse`, `/produse/[slug]`, `/despre-noi`, `/contact`, `/cos`) și Server Actions (`app/actions.ts`)
- `components/ui/`: Button, Badge, Card, Input, Select, Checkbox, Skeleton, Divider
- `components/layout/`: Navbar, Footer, MobileMenu
- `components/games/`: GameCard, GameGrid, Filters, SortSelect, Pagination, Gallery, Tabs
- `lib/`: clientul Prisma, interogări, scheme Zod, formatare, coșul (localStorage)
- `prisma/`: schema, datele jocurilor și seed-ul
- Tokenii de design sunt în `app/globals.css` (`@theme`)
