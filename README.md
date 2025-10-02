![Galaxy](./banner.png)

<div align="center">
  <h1>Plavna Universe</h1>
  <h3>A monorepo for Plavna apps and packages</h3>
</div>

> [!IMPORTANT]
> This is my first time publishing packages and a big repo in general. Expect parts that require more polishing.

### Structure

Apps:

- [Plavna](apps/plavna) - main app
- [Screenshotter](apps/screenshotter) - app that takes screenshots of custom previews
- [Screenshotter Cron](apps/screenshotter-cron) - runs Screenshotter on a schedule
- [Denlukia Previews](apps/denlukia-previews) - hosts my custom previews

Packages:

- [Plavna Corners](packages/corners) - continuous corners for Svelte
- [Plavna Design](packages/design) - design system for Plavna
- [Plavna Animations](packages/animations) - gestures & animations WIP written for [Lubymo](https://plvn.app/lubymo)
- [Plavna Image Uploader](packages/image-uploader) - image uploader for Plavna
- [Plavna Common](packages/common) - common types & utils for Plavna and Screenshotter

### To Do (Contributions Welcome)

- Document Plavna Corners (easy)
- Document Plavna Design (medium)
- Additional themes from [video](https://www.youtube.com/watch?v=iKL7uO9oJB0) (medium)
- Align more features with current state of [Svelte Feature Folders](./apps/plavna/README.md) (medium)
- Implement page theme override for a reader (medium)
