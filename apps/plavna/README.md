![Plavna Logo](./plavna.png)

# Plavna

A SvelteKit app, written in TS, with Turso as DB provider, Drizzle as ORM, Lucia as auth, Superforms and Zod for forms and validation, ImageKit as image storage, and Vercel as host.

## Feature Folders Architecture

The example for a SvelteKit app architecture that orchestrates things above with minimal boilerplate. 

Some words north stars of this architecture:

1. This structure is a good fit for project that is handled by a solo entrepreneur. There's no backend and frontend for this person. There's no things outside of their scope. Everything they do, whether it is a DB functionality or a Like functionality — is just a feature towards a working product.

2. Imagine any part of your project as something that could be a block in a Bento grid. This bento is not for the user, nor is it for designer or developer. It's for the same solo entrepreneur in another universe. This grid can have everything as a feature. Boom: image storage feature. Boom: article's tags feature. Boom: auth feature.

3. Most of the features consist of:

   - schema.ts (Drizzle Schema)
   - queries.ts (Drizzle Queries)
   - validators.ts (Zod Validators gerived from Drizzle Schema)
   - service.ts (Class with methods related to the feature)
   - [ComponentName].svelte (any components related to the feature)
   - Additional helping files like utils.ts, types.ts, transitions.ts, etc.

Some of the features won't stick to file list above (like DB feature or Styles feature). You should relax and let them exist on the same level in hierarchy as the others if mentally it's big enough to be in an "entrepreneur's bento". 

> Let it be a feature


## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```


