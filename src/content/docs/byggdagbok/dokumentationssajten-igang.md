---
title: Dokumentationssajten är igång
date: 2026-05-29
authors: tobias
tags: [meta, dokumentation]
excerpt: Första inlägget i byggdagboken. Den gamla WordPress-sajten byts mot en statisk sajt i Git så att dokumentationen kan skrivas direkt i Markdown.
---

Det här är första inlägget i projektets **byggdagbok**. Tanken med dagboken är att fånga *kronologin* i bygget – vad som hände, vad som testades och vad som gick fel – medan den förfinade referensdokumentationen lever under sina respektive delsystem (inverter, motor, batteri, chassi).

## Varför en ny sajt?

Projektet har hittills dokumenterats på en WordPress-sajt. Den byts nu mot en **statisk sajt versionshanterad i Git**. Fördelarna:

- Dokumentationen skrivs i **Markdown**, direkt i koden – inget admin-gränssnitt.
- Allt versionshanteras: historik, diff och möjlighet att backa.
- **Automatisk publicering** vid push (GitOps).

## Hur skriver man ett nytt inlägg?

Skapa en Markdown-fil i `src/content/docs/byggdagbok/` med frontmatter:

```yaml
---
title: Rubrik på inlägget
date: 2026-05-29
authors: tobias
tags: [inverter, bring-up]
excerpt: En kort sammanfattning som visas i listan och på taggsidor.
---
```

Resten av filen är vanlig Markdown. Inlägget dyker upp automatiskt i listan på `/byggdagbok`, i RSS-flödet och under sina taggar – ingen registrering behövs.

Härnäst: fördjupa dokumentationen om invertern och koppla på automatisk deploy.
