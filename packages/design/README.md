![Preview](./preview.png)

# Plavna Design

Design system that powers [Plavna](https://plvn.app/). Short description is available [here](https://plvn.app/plavna-design/).

## Installation

```bash
pnpm install @plavna/design
```

## Usage

To use a component, we need to supply it with Theme data, we do it via wrapping the app with ThemeProvider:

1. On backend (for example +layout.ts) make a desired ThemeSet object, enrich it. It will dynamically import components and css files based on selected theme parts. Then return theme set and theme component set.

   ```ts
   import type { ThemeSet } from '@plavna/design/theming/basics';
   import { enrichThemes } from '@plavna/design/theming/enricher';

   import type { LayoutLoad } from './$types';

   export const load = (async () => {
   	const themeSet: ThemeSet = {
   		color: 'milk',
   		style: 'modern',
   		typographyInterface: 'inter',
   		typographyMarkdown: 'sequences'
   	};

   	const themeComponentSet = await enrichThemes(null, themeSet);

   	return { themeSet, themeComponentSet };
   }) satisfies LayoutLoad;
   ```

2. On the frontend (for example in +layout.svelte) pass these objects to ThemeProvider

   ```svelte
   <script lang="ts">
   	let { data, children } = $props();
   	let { themeSet, themeComponentLayers } = $derived(data);
   </script>

   <ThemeProvider {themeSet} {themeComponentLayers}>
   	{@render children()}
   </ThemeProvider>
   ```

Per-component documentation is to yet to be written, for now you can see components in action by reading [my portfolio on Plavna](https://plvn.app/den) or becoming [an author](https://plvn.app/sign-in/github). You can also see the full list of components and their props in [components folder](./src/lib/components).
