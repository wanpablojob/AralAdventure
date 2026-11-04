# AralAdventure

AralAdventure is a hybrid offline/online React Native quiz-adventure game for elementary students in grades 1–6. Students explore, talk to guides, complete 10-question battles, earn points, and spend them in the in-game shop. Progress is saved on the device and can be synced to Supabase for teachers when the device is online.

## Tech stack

- React Native with Expo SDK 58
- Expo Go for local testing
- Supabase for offline-first sync and teacher data
- GitHub Actions for CI/CD
- EAS Build for Android and iOS builds
- Vercel is reserved for the future teacher/admin dashboard

## Getting started

```bash
npm install
cp .env.example .env
npm start
```

Open the project in Expo Go and scan the QR code.

## Environment variables

```env
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_TEACHER_CODE=
```

`EXPO_PUBLIC_TEACHER_CODE` is optional for development. Students can enter their teacher's class code in the Teacher Sync screen.

## Scripts

```bash
npm start            # Start Expo
npm run android      # Open on Android
npm run ios          # Open on iOS
npm run web          # Open in the browser
npm run lint         # ESLint
npm run typecheck    # TypeScript
npm run test         # Jest
npm run test:ci      # Jest in CI mode
npm run doctor       # Expo Doctor
```

## Supabase setup

1. Create a Supabase project.
2. Link the CLI:

   ```bash
   supabase link --project-ref <your-project-ref>
   ```

3. Apply the migration:

   ```bash
   supabase db push
   ```

The migration is in `supabase/migrations/20261104000000_init.sql`.

## Offline and teacher sync

- Progress is stored with AsyncStorage.
- Quest results are queued locally when offline.
- When the device is online, the app syncs player progress and queued quest results to Supabase.
- Teachers can be given a class code. Students enter it in Teacher Sync.
- The Vercel admin dashboard is intentionally not deployed yet. It will be added in a later phase.

## Admin dashboard (not deployed yet)

A scaffolded Next.js admin dashboard is in `admin/`. It reads synced student progress from Supabase and is intentionally not deployed to Vercel yet.

```bash
cd admin
npm install
npm run dev
```

Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `admin/.env`.

## CI/CD pipeline

The industry-level pipeline is in `.github/workflows`:

- `quality.yml`: lint, typecheck, tests, Expo Doctor, and dependency audit.
- `ci.yml`: runs quality checks on pull requests.
- `cd.yml`: runs quality checks, builds Android and iOS previews with EAS, and applies Supabase migrations on `main`.

Required GitHub secrets:

- `EAS_TOKEN`
- `SUPABASE_PROJECT_REF`
- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_DB_PASSWORD`

Vercel secrets will be added when the admin dashboard phase begins.

## Project structure

```text
src/
  components/      Reusable pixel-style UI
  data/            Questions, quests, and shop items
  game/            Scoring and progression logic
  lib/             Storage, Supabase client, sync
  screens/         Welcome, Home, Adventure, Battle, Shop, Teacher Sync
  theme.ts         Colors and fonts
  types/           Shared TypeScript types
supabase/
  migrations/      Database schema
.github/workflows/ CI and CD workflows
```

## Notes

- Expo Go is supported for local testing.
- The game works offline; teacher sync requires network access and a configured Supabase project.
- Vercel deployment is intentionally deferred until the admin dashboard phase.
