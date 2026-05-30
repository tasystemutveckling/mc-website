---
description: Granska ett Google-dokuments kvalitet och, om rent, godkänna en version för export
argument-hint: <dokumentnamn eller dokument-ID>
allowed-tools: Bash, Read, Glob, Grep
---

Du ska köra **quality tollgate** för dokumentet: `$ARGUMENTS`.

Detta är *granskningssteget* före publicering. Du **rättar ingenting** — du rapporterar, och godkänner först när källan är ren och användaren signerar av. Följ `CLAUDE.md` (särskilt don't-rewrite-regeln) och `[[inline-drawings-dont-export]]`-kunskapen.

## Steg

1. **Hitta dokumentet.** Om argumentet ser ut som ett Drive-ID, använd det. Annars sök:
   `gws drive files list --params '{"q": "name contains '\''<namn>'\'' and mimeType='\''application/vnd.google-apps.document'\''", "fields": "files(id,name,modifiedTime)"}'`
   Bekräfta rätt träff med användaren om det är tvetydigt. Spara `<docId>` och `<namn>`.

2. **Exportera + checksumma.** Exportera markdown till en temp-fil i projektet och räkna checksumman:
   - `gws drive files export --params '{"fileId":"<docId>","mimeType":"text/markdown"}' -o _validate.md`
   - `python scripts/exportdoc.py checksum _validate.md`  → spara som `<CS>`

3. **Granska (rapportera, rätta inte).** Läs igenom `_validate.md` noggrant och rapportera **i chatten**, grupperat:
   - **Språk** — stavning, grammatik (t.ex. tidigare "batteru").
   - **Logik / resonemang** — luckor, inkonsekvenser, odefinierade framåtreferenser, tal som inte går ihop.
   - **Element som kräver specialhantering vid export** — lista formler (måste läsas ur HTML-exportens bilder → LaTeX) och inline-ritningar (måste renderas ur PDF-exporten). Så användaren ser vad som följer med.
   Peka ut, skriv inte om. Allt ska fixas **i Google-dokumentet**, inte i markdownen.

4. **Grind.**
   - **Om fynd finns:** godkänn INTE. Sammanfatta vad som bör fixas, och säg: "Fixa i Google-dokumentet och kör `/validate-doc` igen." Stanna här.
   - **Om rent (eller bara kvarvarande noteringar användaren accepterar):** fråga uttryckligen "Godkänn den här versionen för export?" Vänta på ja.

5. **Vid godkännande:**
   - `python scripts/exportdoc.py approve <docId> --name "<namn>" --checksum "<CS>"`  → ger `version` N och `approvedAt`.
   - Skriv den synliga stämpeln i dokumentet:
     - `gws docs documents get --params '{"documentId":"<docId>"}' > _doc.json`
     - `python scripts/exportdoc.py stamp --doc _doc.json --version N --timestamp "<approvedAt>" > _req.json`
     - `gws docs documents batchUpdate --params '{"documentId":"<docId>"}' --json "$(cat _req.json)"`
   - Bekräfta för användaren: godkänd som version N, redo för `/export-doc`.

6. **Städa** temp-filer: `rm -f _validate.md _doc.json _req.json`.

> Checksumman räknas över brödtexten med versionsstämpeln borträknad, så stämpeln självinvaliderar aldrig godkännandet. Redigerar användaren dokumentet efteråt ändras checksumman och `/export-doc` vägrar tills `/validate-doc` körts om.
