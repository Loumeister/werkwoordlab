# Werkwoordlab

**Nederlandstalige leeromgeving voor werkwoordspelling** — voor leerlingen in de onderbouw VO en docenten Nederlands.

Werkwoordlab is geen simpele vervoegingentrainer. Het is een **diagnostische leeromgeving** die leerlingen dwingt om eerst de grammaticale functie van een werkwoord te bepalen, daarna de spellingregel toe te passen, en altijd feedback te geven die gekoppeld is aan een specifieke denkfout (misconceptie).

## Inhoudsopgave

- [Productdoel en scope](#productdoel-en-scope)
- [Architectuur en stack](#architectuur-en-stack)
- [Projectstructuur](#projectstructuur)
- [Aan de slag](#aan-de-slag)
- [Testen](#testen)
- [Roadmap](#roadmap)
- [Documentatie-index](#documentatie-index)

---

## Productdoel en scope

| Onderdeel | Beschrijving |
|---|---|
| **Doelgroep** | Leerlingen 12–15 jaar, docenten Nederlands |
| **Kernflow** | Grammaticale functie → spellingregel → antwoord → diagnostische feedback |
| **Content** | Data-gedreven oefenunits in JSON; geen hardgecodeerde items in UI |
| **Privacy** | Anonieme leerlingsessies; geen verplichte login |
| **Geen LLM** | Deterministisch evaluatiepad in de learner loop |

Zie [`docs/product-spec.md`](docs/product-spec.md) voor volledige grenzen en acceptatiecriteria.

---

## Architectuur en stack

```
Next.js (App Router) + TypeScript
Tailwind CSS
Prisma + SQLite  ← gepland; huidig MVP gebruikt localStorage
Vitest
Playwright
```

**Systeemdelen:**

| Deel | Beschrijving |
|---|---|
| `app/` | Next.js routes (learner + docent) |
| `components/` | Herbruikbare UI-componenten |
| `lib/content.ts` | Content loader en typen; registreer nieuwe units hier |
| `lib/evaluator.ts` | Deterministische evaluator; puur en testbaar |
| `lib/attempt-store.ts` | Sla pogingen op (huidig: localStorage; later: Prisma) |
| `content/units/` | Oefenunits als JSON |
| `content/misconceptions/` | Misconceptietaxonomie |

Zie [`docs/architecture.md`](docs/architecture.md) voor runtime-contract en data-objecten.

---

## Projectstructuur

```
werkwoordlab/
├── app/                        # Next.js App Router
│   ├── page.tsx                # Dashboard (/)
│   ├── oefenen/                # Unitselectie (/oefenen)
│   │   └── [unitId]/page.tsx   # Oefenflow per unit
│   ├── groei/page.tsx          # Leerlingvoortgang (/groei)
│   ├── inzichten/page.tsx      # Docentinzichten (/inzichten)
│   ├── schrijven/page.tsx      # Schrijftaak (/schrijven)
│   └── content/page.tsx        # Contentoverzicht (/content)
├── components/
│   ├── app-shell.tsx           # Navigatie-wrapper
│   └── learner/                # Learner-flow UI-componenten
├── content/
│   ├── units/                  # Oefenunits (JSON)
│   │   ├── unit-01-pv-tt.json
│   │   └── unit-02-voltooid-deelwoord.json
│   └── misconceptions/
│       └── taxonomy.nl.json    # Misconceptietaxonomie
├── lib/
│   ├── content.ts              # Content loader + typen
│   ├── evaluator.ts            # Evaluatielogica
│   ├── attempt-store.ts        # Persistentie (localStorage)
│   └── use-attempts.ts         # React hook voor pogingen
├── tests/
│   ├── unit/                   # Vitest unit- en integratietests
│   └── e2e/                    # Playwright e2e-tests
└── docs/                       # Volledige documentatie (zie index)
```

> **Nieuwe unit toevoegen?** Maak `content/units/<unit-id>.json` aan en registreer de unit in `lib/content.ts`. Zie [`docs/content-schema.md`](docs/content-schema.md) voor het verplichte schema.

---

## Aan de slag

```bash
npm install
npm run dev        # Start dev-server op http://localhost:3000
npm run build      # Productie-build
npm run lint       # ESLint
```

---

## Testen

```bash
npm test           # Vitest unit- en integratietests
npm run test:e2e   # Playwright e2e-tests (vereist draaiende dev-server)
```

**Testlagen:**

| Laag | Tool | Dekt |
|---|---|---|
| Unit | Vitest | Evaluatorlogica, misconceptiemapping, contentcontracts |
| Integratie | Vitest | Content loader, schema-invarianten, attempt-verwerking |
| E2E smoke | Playwright | Alle kernroutes, learner-flow, not-found gedrag |

Zie [`docs/testing-strategy.md`](docs/testing-strategy.md) voor de minimale smokesuite en verplichte dekking per wijzigingstype.

---

## Roadmap

### Fase 0 — Bootstrap ✅
Next.js + TS + Tailwind, Vitest + Playwright, content loader en schema-validatie.

### Fase 1 — Learner core loop ✅
Unitselectie, itemrunner, scaffold UI, deterministische evaluator, transferopdracht.

### Fase 2 — Content opschalen (actief)
- Unit-01 en unit-02 uitbreiden naar 15–20 sterke items per unit.
- Taxonomiecodes volledig koppelen; contentkwaliteitsgates in tests.

### Fase 3 — Teacher insights MVP
Attempts/progress opslaan (Prisma/SQLite), aggregatieservice, docentdashboard.

### Fase 4 — Release hardening
Toegankelijkheid, NL-copy polish, performance, privacycontrole.

**Contentroadmap (volgorde van prioriteit):**

1. Bestaande units verdiepen (`unit-01-pv-tt`, `unit-02-voltooid-deelwoord`)
2. Nieuwe unit: verleden tijd persoonsvorm (`unit-03-pv-vt`)
3. Nieuwe unit: infinitief (`unit-04-infinitief`)
4. Nieuwe unit: bijvoeglijk gebruikt voltooid deelwoord (`unit-05-bijvoeglijk-vd`)
5. Nieuwe unit: onvoltooid deelwoord (`unit-06-onvoltooid-deelwoord`)

Volledige takenlijst en didactische eisen: [`docs/content-expansion-roadmap.md`](docs/content-expansion-roadmap.md).

---

## Documentatie-index

| Document | Beschrijving |
|---|---|
| [`docs/product-spec.md`](docs/product-spec.md) | Productdoel, scope, functionele en niet-functionele eisen |
| [`docs/architecture.md`](docs/architecture.md) | Stack, systeemdelen, runtime-contract, data-objecten |
| [`docs/content-schema.md`](docs/content-schema.md) | JSON-schema voor units en taxonomie, enums, invarianten |
| [`docs/didactic-principles.md`](docs/didactic-principles.md) | Didactische principes, verplicht patroon, anti-patronen |
| [`docs/testing-strategy.md`](docs/testing-strategy.md) | Testlagen, minimale smokesuite, release gate |
| [`docs/backlog.md`](docs/backlog.md) | Gefaseerde implementatiebacklog met DoD per fase |
| [`docs/content-expansion-roadmap.md`](docs/content-expansion-roadmap.md) | Uitvoerbare contentroadmap: units, taxonomie, evaluator |
| [`docs/release-checklist.md`](docs/release-checklist.md) | Releasechecklist voor MVP |
| [`AGENTS.md`](AGENTS.md) | Werkafspraken voor AI-agents die aan dit project werken |
