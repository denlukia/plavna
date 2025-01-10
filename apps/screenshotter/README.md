## Developing

1. Download chromium executable to chromium folder (or other folder), you can also try to locate already present Chromium instance

```bash
pnpx @puppeteer/browsers install chromium@latest --path 'ABSOLUTE PATH TO FOLDER'
```

2. Change rights for this executable if needed

```bash
   sudo chmod 755 'ABSOLUTE PATH TO EXECUTABLE'
```

3. Don't forget to change LOCAL_CHROMIUM_PATH in .env if you use another Chromium path

4. Installed dependencies with `npm install` (or `pnpm install` or `yarn`) and you can start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

5. You can test screenshotter work by sending POST requests to localhost:5174/ with correct accessToken (as in .env). It will try to access DB (url, token specified in .env) and take last record from screenshots_queue table for screenshotting

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
