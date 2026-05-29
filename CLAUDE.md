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
| Språk | **Svenska** genomgående | Sajten och källmaterialet är på svenska. |
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

## Innehållsstruktur (förslag — justera när vi scaffoldar)

Spegla projektets delsystem. Inverter är längst kommen, så börja där.

```
src/content/docs/
├── index.mdx              # landningssida: vad projektet är, översikt, status
├── inverter/
│   ├── oversikt.md        # vad inverter gör, arkitektur
│   ├── kraftkort.md       # TIDA-01540-baserat kraftkort, F280025C
│   └── firmware.md        # FOC-mjukvaran, byggnivåer, destillerat från firmware-repo
├── motor/
│   └── oversikt.md        # PMSM, 8-pol/48-spår
├── batteri/               # (framtid) 48s4p LiFePO4, ~154 V
├── bms/                   # (framtid)
└── ram/                   # (framtid) stålrörs-trellis
```

Sidofältets ordning/gruppering styrs i `astro.config.mjs` (Starlights `sidebar`).

## Konventioner och kvalitetskrav

- **Språk:** svenska genomgående, korrekt och naturlig prosa, inga översättningsanglicismer.
- **Tilltal:** "du" (singular).
- **Publik publik, lagom nivå** — sajten riktar sig till tekniskt intresserade läsare, inte bara projektägaren. Förklara förkortningar (FOC, PMSM, BMS …) första gången de används.
- **Råa anteckningar destilleras** — kopiera inte Drive-anteckningar rakt av; skriv om till sammanhängande publik text.
- **Bilder** läggs i `public/` (eller `src/assets/` för optimering) och hämtas från Drive-mappen `bilder/` vid behov.
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

- [x] Scaffolda Astro Starlight (svenska, `site=tasystemutveckling.se`)
- [x] Initiera lokalt git-repo (första commit gjord)
- [x] Landningssida (`index.mdx`) + grundläggande delsystemssidor
- [x] Migrera innehåll från nuvarande WordPress (Home — Inverter-sidan var tom)
- [ ] Skapa GitHub-repo och pusha
- [ ] GitHub Actions-workflow för Pages-deploy
- [ ] Designval: visuellt språk, ev. delning av tokens med `../flowi_website`
- [ ] Inverter: fördjupa med kraftkort + firmware (destillera från Drive + firmware-repo)
- [ ] Fyll på övriga delsystem från Drive (`projektdokumentation/`, `utveckling/`)
- [ ] DNS-cutover-plan: peka tasystemutveckling.se från one.com till GitHub Pages

## Innan du gissar — fråga användaren

Om något här är otydligt eller motsäger källmaterialet: **stanna och fråga** hellre än att bygga något som måste rivas. Detta gäller särskilt tekniska fakta som ska publiceras.

---

*Den här filen är levande. Uppdatera den när viktiga beslut tas eller arkitekturen ändras.*
