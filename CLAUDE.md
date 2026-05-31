# CLAUDE.md — MC-projektets dokumentationssajt

Den här filen ger Claude Code all kontext den behöver för att jobba med projektet. Läs den först.

## Vad är detta?

Detta är **den publika dokumentationssajten** för ett större hobbyprojekt: att konstruera och bygga en **elmotorcykel** från grunden, och dokumentera kunskapen som tas fram längs vägen.

Sajten är ett **delprojekt** — den producerar den publika, förfinade dokumentationen. Själva ingenjörsarbetet (firmware, elektronik, mekanik, batteri osv.) bor i andra repon och i Google Drive (se *Källor* nedan). Den här sajten **sammanställer och publicerar** — den är inte arbetsytan för konstruktionsarbetet.

Sajten ersätter på sikt den nuvarande WordPress-installationen på **tasystemutveckling.se**. Poängen med omgörningen är att kunna lägga upp dokumentation direkt i Markdown via Git — utan att gå via WordPress admin-gränssnitt — och få automatisk publicering vid push.

## Mål

1. **Statisk sajt i Git** — all dokumentation som Markdown/MDX, versionshanterad, redigerbar direkt av Claude Code.
2. **GitOps-publicering** — push till `main` bygger och deployar automatiskt. Ingen manuell uppladdning.
3. **Sammanställning från flera källor** — råa anteckningar och formell dokumentation finns i Google Drive och i konstruktionsrepon; sajten är den kurerade, publika destinationen.
4. **Växer med projektet** — fler delsystem tillkommer (mekanik, batteri, BMS, laddare …). Strukturen ska skala utan omskrivning.

## Arkitekturella beslut (tagna)

| Beslut | Val | Varför |
|---|---|---|
| Ramverk | **Astro Starlight** (`@astrojs/starlight`) | Dokumentationstung sajt → docs-chrome (sidomeny, sök via Pagefind, TOC, dark mode) färdigt. Bygger på Astro, så egna komponenter/MDX/landningssida går att lägga till. |
| Innehåll | **Markdown/MDX i `src/content/docs/`** | Versionshanterat, Claude kan skapa/redigera direkt. Ny sida = en `.md` + ev. en rad i sidebar. |
| Språk | **Engelska** för sajtens innehåll | Publik sajt riktad mot en bredare publik. *Intern dok (denna CLAUDE.md) hålls på svenska.* Slugs är engelska (`overview`, `frame`, `blog` …). |
| Hosting | **GitHub Pages** | Repot ligger på GitHub; inget tredjepartskonto behövs. |
| CI/CD | **GitHub Actions** | Bygger Astro och publicerar till Pages vid push till `main`. |
| Domän | **tasystemutveckling.se** (ersätter WordPress) | DNS kvar hos **one.com** (e-post m.m. opåverkat); apex pekas mot GitHub Pages via A-records + `CNAME`-fil vid cutover. |
| Toolchain | **Node / npm** | Samma ekosystem som systerprojektet `../flowi_website`. |

Systerprojekt: `../flowi_website` är en plain-Astro **marknadsföringssajt** (annan stack-nyans, AWS-hosting). Inte samma kodbas, men samma Astro-ekosystem — låna gärna mönster (designtokens, content collections, konventioner) därifrån.

## Källor till dokumentation

Sajten sammanställs från följande. Listan växer över tid.

### 1. Google Drive (via `gws` CLI)

Drive nås via det lokala, redan auktoriserade `gws`-kommandot — **inte** via MCP-kopplingen (den kräver oauth som inte är gjord). Exempel:

```bash
gws drive files list --params '{"pageSize": 200, "q": "'\''<FOLDER_ID>'\'' in parents", "fields": "files(id,name,mimeType,modifiedTime)"}'
```

Materialet är en blandning av **råa anteckningar** och **mer förfinad dokumentation** avsedd för publicering. Nyckelmappar (ID:n för snabb navigering):

- `mc/` (projektrot) — `1KiFPfUTiPIffdy5WRQH6fEDFKgFMhjs_`
  - **`projektdokumentation/`** — `1f91iZn-p8lHzn7A1cGYEz_yZBmLYvZkz` — *det förfinade*, avsett att vara genomarbetat:
    - `inverter/` (`1AH1hmiggOqD3w403LSzggnxdWLBDsv5_`) → dokumentet **Inverter** (`1nqqBJSr2LS7shcvEbFkanWVhuyFb5uop6gm_q-f1OXc`)
    - `software/` (`1vtLAMrv-7S5DO6kjLi4-fStVzbSSlSOo`), `motor/` (`1I3VY1okm50EQxlVWlZgCtSYEtZ42x6vR`), `bilder/` (`11yf0J2Jq6yZQYccyLUje5X2Z17M71ltR`)
    - dokument: **mc design description** (`1M7H5K_iQF5-PsS3tVkrnx0K2ilK-KcfIravIzr_J_Fk`), **Dagbok** (`1b4ZvoNr87OPn9fPVZ1mbwlz9SIhA8kvcyiNB7y8a3yg`)
  - **`utveckling/`** — `1WVZTQYhi94kHaYI-yrJDFVWf7ttlT3c2` — *råare anteckningar*: MC Utvecklingsplan, elektrisk drivlina, BMS, Battery, laddare, motorstyrning, ramdelar, sadel m.m.

> **Förfining > rådata.** När `projektdokumentation/` och `utveckling/` säger emot varandra, väg åt `projektdokumentation/`. Verifiera fakta innan publicering — råa anteckningar kan vara föråldrade.

### 2. Firmware för växelriktaren (separat GitHub-repo)

`../../workspace_v12/universal_motorcontrol_lab_f28002x` — CCS-projekt (C, TI C2000 F280025C), härlett ur TI:s `universal_motorcontrol_lab`. Har egen utförlig `CLAUDE.md` och en bring-up-logg i `docs/bringup_log.md` som förklarar *varför* nuvarande värden är satta. Läs dessa när du dokumenterar mjukvarudelen — men **publicera inte** implementationsdetaljer rakt av; destillera till begriplig publik dokumentation.

### 3. Växelriktarens elektronik

Hembyggt kraftkort baserat på TI:s **TIDA-01540**, drivet av en **LAUNCHXL-F280025C**. Inget separat Claude-projekt — underlaget (scheman, BOM, design-PDF:er) finns i Drive (`referensdesign/`, samt TIDA-01540-PDF:er) och i firmware-repots `documents/`.

### Framtida källor (ännu ej tillgängliga)

Mekanik / ram, batteri, BMS, laddare. Lägg till dem här och i strukturen när de materialiseras.

## Innehållsstruktur

Startsidan är en **projektsammanfattning med bilder** (som dagens WordPress-startsida). Navigeringen till *Build Log* och *Documentation* sker via **vänstermenyn** (Starlights `sidebar`, satt i `astro.config.mjs`). Delsystemssidorna speglar projektets delar; inverter är längst kommen.

```
src/content/docs/
├── index.mdx                 # startsida: projektsammanfattning + bilder + länkar
├── inverter/overview.md      # (+ senare: power-board.md, firmware.md)
├── motor/overview.md         # PMSM, 8-pole/48-slot
├── battery/
│   ├── overview.md           # 48s4p LiFePO₄, 154 V
│   └── junction-box.md       # huvudkontaktor, säkring, förladdning
├── chassis/frame.md          # stålrörs-trellis
└── blog/                     # Build Log (se nedan)
src/assets/                   # bilder (overview/motor/inverter/battery/junction-box/frame.png)
```

Bilderna laddades ner från Drive-mappen `bilder/` (+ kopplingsbox från WordPress) via `gws drive files get --params '{"fileId":"…","alt":"media"}' -o …`, och optimeras till WebP av Astro vid build.

### Build Log (blogg)

Sajten har en blogg via pluginet **`starlight-blog`** (`plugins:` i `astro.config.mjs`), monterad på `/blog` med titeln **Build Log**. Plugin-navigeringen är `'none'` — bloggen länkas i vänstermenyn i stället för i headern. Uppdelningen:

- **Build Log** = kronologin: vad som hände, testades och gick fel. Knyter an till *Dagbok* i Drive och `bringup_log.md` i firmware-repot.
- **Documentation** (fördjupning) = referensmaterialet: hur delsystemen *är* konstruerade.

Nytt inlägg = en `.md` i `src/content/docs/blog/` med frontmatter `title`, `date`, `authors: tobias`, `tags`, `excerpt`. Lista, taggsidor, författarsidor och RSS genereras automatiskt — ingen registrering behövs. Författare definieras i plugin-optionen `authors`.

## Arbetsflöde: Google Docs → sida

Det normala sättet att lägga upp innehåll: användaren skriver i **Google Docs**, Claude konverterar och publicerar lokalt, användaren committar/pushar själv (→ GitHub Actions deployar).

**Användaren säger:** dokumentets namn (Claude hittar det via `gws`) eller länk/ID, om det är ett **blogginlägg** eller en **dokumentationssida**, och vilken sektion.

**Claude gör:**
1. Exporterar: `gws drive files export --params '{"fileId":"…","mimeType":"text/markdown"}' -o <temp i projektet>` (obs: `-o` måste ligga *inom* projektkatalogen — verktyget vägrar sökvägar utanför).
2. **Transkriberar texten troget** till ren Markdown och lägger på frontmatter (docs: `title`, `description`; blogg: `title`, `date`, `authors: tobias`, `tags`, `excerpt`). Rena språkfel rättar du på vägen (rapportera dem); större omskrivningar gör du **inte** — se regeln nedan.
3. **Bilder:** Docs-exporten bäddar in bilder som base64 i markdownen. Extrahera dem till `src/assets/<sida>-N.png` och referera med relativ sökväg (`![alt](../../assets/…)`) — Astro optimerar till WebP.
   - **Inline-ritningar (`Infoga → Teckning`) — hämtas via PDF-exporten.** Dessa följer *inte* med markdown- eller HTML-exporten (HTML ger bara en autentiserad `docs.google.com/drawings/d/…/image?parent=`-länk som svarar 401 utan webbläsarinloggning, och Docs-API:t `gws docs documents get` returnerar dem med `embeddedDrawingProperties` men **tomt `contentUri`**). Men **PDF-exporten rastrerar dem**: `gws drive files export --params '{"fileId":"…","mimeType":"application/pdf"}' -o <temp>.pdf`. Extrahera sedan med PyMuPDF (`pip install PyMuPDF`) — och **rendera sid-ytan**, extrahera inte rå-bilden direkt (rå-bilden har en separat transparensmask → svart bakgrund). Mönster:
     ```python
     import fitz
     d = fitz.open('_export.pdf')
     page = d[PAGE_INDEX]
     rect = page.get_image_rects(XREF)[0]          # XREF från page.get_images()
     page.get_pixmap(matrix=fitz.Matrix(3,3), clip=rect, alpha=False).save('out.png')
     ```
     Ger ren figur på vit botten (läsbar i både ljust/mörkt tema) i 3× upplösning. Identifiera vilka xref som är ritningar (kontra foton) genom att titta på dem (Read). Foton och formler (renderade som bilder) fångas däremot redan av markdown-/HTML-exporten.
4. **Matematik (viktigt):** `text/markdown`-exporten **förstör** ekvationer skrivna i Googles formelverktyg — subscript/symboler/√ tappas och resultatet blir vilseledande. **Gissa eller "rekonstruera" därför aldrig formler från markdown-exporten.** I stället: exportera även `text/html` (`mimeType: text/html`), där formlerna kommer ut som **renderade bilder**. Läs varje formelbild **visuellt** (Read på den extraherade PNG:en) och transkribera den till **LaTeX**, som renderas med KaTeX (remark-math + rehype-katex + `customCss`). Eftersom källan är den renderade formeln (inte den trasiga texten) blir transkriptionen trogen — men **flagga** ändå varje formel där bilden är otydlig, och hitta aldrig på matematik som inte syns i bilden.
5. Rensa ren formatbrus (escape-artefakter som `\-`, `1\.`, trasiga listmarkörer), placera filen, uppdatera `sidebar` vid behov.
6. Kör `npm run build`, verifiera, och tala om för användaren exakt vad som ska `git add`/committas. **Pusha inte själv.**

> **Mindre språkfel — rätta direkt och rapportera.** Rena språkfel (stavning, grammatik, interpunktion) och formatbrus rättar du i den publicerade Markdownen vid transkriptionen, och **rapporterar** kort vad du ändrat (i chatten). Du behöver inte vänta in användaren för sådant.
>
> **Större ändringar — skriv inte om, peka ut och vänta.** Omformuleringar av prosa, omstrukturering, **logiska fel eller luckor i resonemangen** samt tekniska fakta ska du *inte* ändra på egen hand. Rapportera dem separat (i chatten) så att användaren själv avgör och rättar i källan (Google-dokumentet) — där vill hen vara med i loopen. Vid tveksamhet om en ändring är "mindre" eller "större": behandla den som större.
>
> **Källan vs sajten.** Format (Markdown-struktur, escape-brus, återställd matematik/tabeller, bildreferenser) ändras alltid tyst. Mindre språkfixar hamnar i Markdownen men inte i Google-dokumentet, så de rapporteras alltid — spegla dem i dokumentet vid tillfälle om du vill hålla källan helt i synk. Substantiellt innehåll går alltid via dokumentet.

### Slash-kommandon: `/validate-doc` och `/export-doc`

Arbetsflödet ovan är operationaliserat i två kommandon (`.claude/commands/`) med en **quality tollgate** emellan, byggd kring en delad logik i `scripts/exportdoc.py`:

- **`/validate-doc <namn|ID>`** — granskar dokumentet, rapporterar fynd och inventerar formler/ritningar (rättar inget här — det är grinden). Mindre språkfel blockerar inte godkännandet (de rättas automatiskt vid export och rapporteras då); större fynd (omskrivning, logik, tekniska fakta) ska fixas i dokumentet först. Är källan ren (eller bara mindre språknoteringar kvar) och användaren signerar av: registrerar ett **godkännande** och skriver en synlig stämpel `Document version N · <tid>` längst ner i Google-dokumentet (via `gws docs … batchUpdate`).
- **`/export-doc <namn|ID> [page|blog] [sektion]`** — verifierar godkännandet och publicerar (hela transkriptions-pipelinen ovan). **Vägrar** om dokumentet inte är godkänt eller har ändrats sedan godkännandet.

**Grinden = en checksumma.** `export-state.json` (i projektroten, versionshanterad → audit trail) håller per dokument: `checksum`, `version`, `approvedAt`, `approved`. Checksumman räknas över brödtexten med stämpel-raden borträknad, så stämpeln självinvaliderar aldrig godkännandet. Både validate och export räknar om checksumman; matchar den inte den godkända → `approved` **clearas** automatiskt och export vägrar tills `/validate-doc` körts om. Substantiella fixar görs i Google-dokumentet (aldrig i markdownen) så att den auktoritativa källan hålls i synk; mindre språkfixar som görs vid export rapporteras i stället (och kan speglas till dokumentet vid tillfälle).

> **Utvärderat och förkastat:** att lägga granskningsfynden som **Google Docs-kommentarer** (via `drive.comments.create`). API:t accepterar dem men native Docs ankrar dem inte — de hamnar löst i marginalen med "Originalinnehållet har raderats". Feedback ges därför i chatten, inte som doc-kommentarer.

Temp-/exportfiler (`_export*.md` o.d.) ska *inte* committas — ta bort dem efteråt.

## Konventioner och kvalitetskrav

- **Språk:** engelska genomgående på sajten, korrekt och naturlig prosa.
- **Publik, lagom nivå** — sajten riktar sig till tekniskt intresserade läsare, inte bara projektägaren. Förklara förkortningar (FOC, PMSM, BMS …) första gången de används.
- **Bevara användarens text** — transkribera troget (se *Arbetsflöde* ovan). **Mindre språkfel** (stavning, grammatik, interpunktion) rättar du direkt och **rapporterar**; **större ändringar** (omformulering, omstrukturering, logik-/resonemangsfel, tekniska fakta) skriver du *inte* om — peka ut dem så att användaren rättar i källan (vid tveksamhet: behandla som större). Endast genuint fragmentariska stödanteckningar får struktureras — flagga då vad du gjort.
- **Bilder** läggs i `src/assets/` (optimeras av Astro, importeras i MDX via `astro:assets`) och hämtas från Drive-mappen `bilder/` vid behov.
- **Tillgänglighet & prestanda:** semantisk HTML, alt-texter, vettiga kontraster. Starlight ger en bra baslinje — bryt den inte i onödan.
- **Ingen client-side JS** om det inte behövs — håll det statiskt.

## Lokal utveckling

```bash
npm install
npm run dev        # Astro/Starlight dev-server
npm run build      # statisk export till dist/
npm run preview    # förhandsgranska byggd output
```

## Deploy (GitOps)

Push till `main` → GitHub Actions bygger och publicerar till GitHub Pages. Workflow i `.github/workflows/`. Custom-domän via `CNAME` + A-records hos one.com (sätts upp vid cutover från WordPress).

## Status / vad som återstår

Grunden är scaffoldad och bygger rent. Att göra (markera klart efter hand):

- [x] Scaffolda Astro Starlight (`site=tasystemutveckling.se`)
- [x] Initiera lokalt git-repo
- [x] Engelsk startsida = projektsammanfattning med bilder (från Drive `bilder/` + WordPress)
- [x] Delsystemssidor (inverter, motor, battery, chassis) på engelska
- [x] Build Log (blogg) via `starlight-blog` + första inlägg
- [x] Vänstermeny: Overview / Build Log / Documentation
- [ ] Skapa GitHub-repo och pusha
- [ ] GitHub Actions-workflow för Pages-deploy
- [ ] Designval: visuellt språk, ev. delning av tokens med `../flowi_website`
- [ ] Inverter: fördjupa med power-board + firmware (destillera från Drive + firmware-repo)
- [ ] Fyll på övriga delsystem från Drive (`projektdokumentation/`, `utveckling/`)
- [ ] DNS-cutover-plan: peka tasystemutveckling.se från one.com till GitHub Pages

## Innan du gissar — fråga användaren

Om något här är otydligt eller motsäger källmaterialet: **stanna och fråga** hellre än att bygga något som måste rivas. Detta gäller särskilt tekniska fakta som ska publiceras.

---

*Den här filen är levande. Uppdatera den när viktiga beslut tas eller arkitekturen ändras.*
