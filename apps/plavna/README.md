![Plavna Logo](./plavna.png)

# Plavna

A SvelteKit app, written in TS, with Turso as DB provider, Drizzle as ORM, Lucia as auth, Superforms and Zod for forms and validation, ImageKit as image storage, and Vercel as host.

The proposal for a SvelteKit app architecture that orchestrates these things and has minimal boilerplate is described [below](#feature-folders-arhitecture).

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Feature Folders

Implementing a feature folders structure in your SvelteKit project requires 3 commitments:

1. Acknowledge that this structure is a good fit for a project that is hendled by a solo designer-developer. There's no backend and frontend for them. There's no things outside of their scope. Everything they do, whether it is a DB functionality or a Like functionality — is just a feature towards a working product.

2. To imagine any part of your project as something that could be mentioned in a Bento grid. The one shown not to the user. The one dedicated not to designer. The one dedicated not to developer. But the one shown to a similar solo designer-developer. This grid can have everything as a feature. Boom: we implemented image storage in project. Boom: we implemented Tags. Everything is a feature.

3. Most of the features consist of some of these parts:

   - schema.ts (Drizzle Schema)
   - queries.ts (Drizzle Queries)
   - validators.ts (Zod Validators gerived from Drizzle Schema)
   - service.ts (Class with methods related to the feature)
   - [ComponentName].svelte (any components related to the feature)
   - Additional helping files like utils.ts, types.ts, transitions.ts, etc.

   Some of the features won't stick to file list above (like DB feature or Styles feature) but still view these things as features. Let them exist on the same level in hierarchy as the others. Keep your `commons` thin. Once my errors related code become few files (not just constants, but a component and different helper functions) – it was a sign that it became a feature.
