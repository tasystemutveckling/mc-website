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
src/content/docs/        Innehåll i Markdown/MDX (en fil = en sida)
├── index.mdx            Landningssida
├── inverter/
├── motor/
├── batteri/
└── chassi/
astro.config.mjs         Titel, språk, sidomeny (sidebar)
```

Ny sida = skapa en `.md`/`.mdx` under `src/content/docs/` och lägg ev. till den i `sidebar` i `astro.config.mjs`.

## Deploy

GitOps: push till `main` bygger och publicerar via GitHub Actions till GitHub Pages. *(Workflow tillkommer.)*
