---
description: Publicera ett godkänt Google-dokument som en sida/inlägg på sajten (vägrar om ej godkänt)
argument-hint: <namn eller ID> [page|blog] [sektion/slug]
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

Publicera dokumentet `$ARGUMENTS` till sajten. Grinden (`/validate-doc`) måste ha godkänt **exakt den här versionen** — annars vägrar du. Följ `CLAUDE.md`-arbetsflödet "Google Docs → sida" och don't-rewrite-regeln till punkt och pricka.

Argument: första = dokumentnamn eller ID; andra (valfritt) = `page` (default) eller `blog`; tredje (valfritt) = sektion/slug.

## Steg

1. **Hitta dokumentet** (samma som `/validate-doc` steg 1). Spara `<docId>`, `<namn>`.

2. **Exportera + checksumma:**
   - `gws drive files export --params '{"fileId":"<docId>","mimeType":"text/markdown"}' -o _export.md`
   - `python scripts/exportdoc.py checksum _export.md`  → `<CS>`

3. **GRIND — verifiera godkännande:**
   `python scripts/exportdoc.py verify <docId> "<CS>"`
   - Börjar svaret med **`REJECT`** → STOPPA. Visa meddelandet för användaren (ej godkänt, eller ändrat sedan godkännandet → kör `/validate-doc`). Publicera ingenting. (`verify` clearar redan `approved` vid checksum-mismatch.)
   - Börjar svaret med **`OK`** → fortsätt. Notera mål-`target` om det finns lagrat.

4. **Publicera** (endast efter `OK`) — enligt `CLAUDE.md`-arbetsflödet:
   - Exportera även `text/html` (och `application/pdf` om dokumentet har inline-ritningar — se `[[inline-drawings-dont-export]]`).
   - **Transkribera troget** till Markdown + frontmatter (docs: `title`, `description`; blogg: `title`, `date`, `authors: tobias`, `tags`, `excerpt`). **Rena språkfel** (stavning, grammatik, interpunktion) rättar du på vägen; **större omskrivningar** gör du inte (se don't-rewrite-regeln).
   - **Bilder:** extrahera base64 ur exporten till `src/assets/<sida>-N.png`, relativa referenser.
   - **Formler:** läs HTML-exportens formelbilder visuellt → LaTeX (KaTeX). Gissa aldrig ur markdownen.
   - **Inline-ritningar:** rendera ur PDF-exporten (PyMuPDF, sid-yta i 3× på vit botten).
   - **Ta bort versionsstämpel-raden** (`Document version N · …`) ur det publicerade innehållet — den är metadata, inte text.
   - Rensa format-brus, placera filen på `target` (från argument/sektion, eller lagrat värde), uppdatera `sidebar` i `astro.config.mjs` om det är en ny sida.

5. **Bygg & verifiera:** `npm run build`. Åtgärda ev. fel.

6. **Rapportera & lista commit** (pusha INTE): (a) **rapportera ev. mindre språkfixar** du gjort i texten, så de kan speglas till Google-dokumentet; (b) lista exakt vad som ska committas — den nya/ändrade `.md`-filen, ev. `src/assets/*`, `export-state.json`, och `astro.config.mjs` om sidebar ändrades.

7. **Städa** temp-filer: `rm -f _export.md _export.html _export.pdf _doc.json` m.fl.
