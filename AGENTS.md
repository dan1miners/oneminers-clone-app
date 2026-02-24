# Repository Guidelines

## Project Structure & Module Organization
This is an Expo Router + React Native TypeScript app.
- `app/`: file-based routes and screens. Route groups include `(auth)`, `(tabs)`, `(essentials)`, `(shop)`, and `(onboarding)`.
- `app/components/`: shared UI components used across screens.
- `assets/` and `assets/icons/`: images, icons, splash, and app branding assets.
- Root config files: `app.json` (Expo app config), `eas.json` (EAS build profiles), `babel.config.js`, `tailwind.config.js`, and `tsconfig.json`.

Use Expo Router naming conventions such as `_layout.tsx` and dynamic segments like `[id].tsx`.

## Build, Test, and Development Commands
- `npm install`: install dependencies.
- `npm run start`: start Expo dev server.
- `npm run ios`: launch on iOS simulator/device.
- `npm run android`: launch on Android emulator/device.
- `npm run web`: run web preview with Metro.
- `npx eas build --profile preview --platform ios` (or `android`): cloud build using `eas.json` profiles.

## Coding Style & Naming Conventions
- Use TypeScript with strict mode (`tsconfig.json` sets `strict: true`).
- Prefer React function components and hooks.
- Match existing code style: single quotes, semicolons, and 2-space indentation in TS/TSX.
- Component names: `PascalCase` (for exported components).
- Route file names: lowercase/kebab-case (for example, `wallet-manager.tsx`), `_layout.tsx` for layout files, and `[param].tsx` for dynamic routes.
- Use NativeWind `className` styling; extract repeated patterns via Tailwind config when needed.

## Testing Guidelines
No test framework or `npm test` script is currently configured in this repository.
- When adding logic-heavy modules, include colocated tests (for example, `ComponentName.test.tsx`).
- Recommended stack: Jest + React Native Testing Library, introduced in the same PR that adds tests.

## Commit & Pull Request Guidelines
Recent commits use short, imperative, mostly lowercase subjects (for example, `fix bottom navigation`, `added routing`).
- Keep commit messages concise and focused on one change.
- PRs should include what changed and why.
- PRs should list affected routes/screens.
- PRs should include manual verification steps (`ios`, `android`, `web`).
- PRs should include screenshots or recordings for UI changes.
- PRs should link issue/task references where applicable.

## Security & Configuration Tips
- Never commit secrets or credentials.
- Keep local environment files local (`.env*.local` is ignored).
- Treat identifier changes in `app.json` (bundle/package IDs) as release-impacting and call them out explicitly in PRs.
