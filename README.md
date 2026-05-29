# Elmotorcykelprojektet – dokumentationssajt

Publik dokumentationssajt för ett elmotorcykelbygge, byggd med [Astro Starlight](https://starlight.astro.build/). Ersätter på sikt WordPress-sajten på [tasystemutveckling.se](https://tasystemutveckling.se).

> Läs **`CLAUDE.md`** för projektdefinition, beslut, källor och konventioner.

## Kom igång

```bash
npm install
npm run dev        # dev-server (http://localhost:4321)
npm run build      # statisk export till dist/
npm run preview    # förhandsgranska byggd output
```

## Struktur

```
src/content/docs/        Innehåll i Markdown/MDX (en fil = en sida), på engelska
├── index.mdx            Startsida: projektsammanfattning med bilder
├── inverter/
├── motor/
├── battery/
├── chassis/
└── blog/                Build Log (starlight-blog), URL /blog
src/assets/              Bilder (importeras i MDX, optimeras till WebP)
astro.config.mjs         Titel, språk, vänstermeny (sidebar), blogg-plugin
```

Ny **doc-sida** = skapa en `.md`/`.mdx` under `src/content/docs/` och lägg ev. till den i `sidebar` i `astro.config.mjs`.

Nytt **blogginlägg** = skapa en `.md` under `src/content/docs/blog/` med frontmatter (`title`, `date`, `authors`, `tags`, `excerpt`). Dyker upp automatiskt i listan och RSS.

## Deploy

GitOps: push till `main` bygger och publicerar via GitHub Actions till GitHub Pages. *(Workflow tillkommer.)*
