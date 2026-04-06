# Repo contract — werkwoordlab

## Purpose

Dit document is het lokale productcontract voor `werkwoordlab`.

Het maakt expliciet:
- welke gedeelde canon bewust en expliciet geadopteerd is vanuit `shared/grammar-core`
- welke elementen uitsluitend lokaal zijn en niet shared canon zijn
- welke bron leidend is bij conflicten
- hoe toekomstige cross-repo samenwerking verloopt

**Gedeelde canon is niet automatisch bindend.** Adoptie is een bewuste, expliciete keuze. Dit contract documenteert die keuze.

---

## Source-of-truth rule

Bij conflicten geldt:

1. **Lokale code/runtime-werkelijkheid** (`lib/`, `content/`, `app/`) heeft voorrang boven documentatie — zowel shared als lokaal — als het gaat om feitelijk gedrag van de repo. Als een document iets beweert wat de code niet doet, klopt het document niet; herstel dan het document, niet de code.
2. **Gedeelde canon** (`shared/grammar-core/docs/`) heeft voorrang boven lokale markdown-documentatie als het gaat om gedeelde didactische of governance-principes.
3. **Lokale documentatie** (`docs/`) concretiseert gedeelde canon voor Werkwoordlab-specifieke context en legt lokale productkeuzes vast.

Leeshiërarchie voor agentwerk:
1. `AGENTS.md`
2. relevante `shared/grammar-core` docs
3. dit document (`docs/product-contract.md`)
4. lokale code/runtime-werkelijkheid
5. taakopdracht

---

## Bewust geadopteerde shared canon

De volgende elementen uit `shared/grammar-core` zijn bewust geadopteerd door Werkwoordlab:

### Didactische principes (alle zes)
Geadopteerd van `shared/grammar-core/docs/werkwoordspellingsdidactiek-kaders.md`:

1. **Grammaticale functie vóór spellingkeuze** — Werkwoordlab dwingt altijd functiebepaling vóór spellingkeuze.
2. **Expliciete instructie en zichtbare redenering** — scaffoldstappen zijn zichtbaar in vroege items.
3. **Contrastdidactiek boven losse voorbeeldverzameling** — items worden geselecteerd op contrastwaarde.
4. **Diagnostische feedback op fouttype** — feedback linkt aan een misconceptiecode.
5. **Van expliciete steun naar afbouw en transfer** — progressie van geïsoleerd naar revisie naar transfer.
6. **Variatie moet didactisch functioneel zijn** — variatie is alleen toegestaan als die het denkwerk verdiept.

### Taxonomie-governance (vier-lagenmodel)
Geadopteerd van `shared/grammar-core/docs/taxonomy-governance.md`:

- Canonieke labels zijn eigendom van `grammar-core`
- Display labels zijn lokaal
- Product-lokale short keys zijn nooit shared
- Nieuwe shared misconceptiecodes worden alleen gecanoniseerd via `grammar-core`

### Canonieke beslisvolgorde werkwoordspelling
Geadopteerd van `shared/grammar-core/docs/werkwoordspellingsalgoritme.md`:

De lokale evaluator (`lib/evaluator.ts`) mag de canonieke beslisvolgorde niet tegenspreken of een andere precedentievolgorde introduceren:
1. grammaticale functie bepalen
2. regelpad kiezen
3. lexicale of morfologische override controleren
4. spellingvorm afleiden

> **Openstaande verificatie**: de alignment van `lib/evaluator.ts` met `shared/grammar-core/docs/werkwoordspellingsalgoritme.md` is nog niet formeel geauditeerd. De eis geldt; de verificatie is nog te doen. Wijzig evaluatorgedrag niet op basis van het algoritmedocument zonder eerst te bevestigen wat de huidige evaluator feitelijk doet.

### Inhoudelijke ontwerpregels
Geadopteerd van `shared/grammar-core/docs/content-authoring-rules.md`:

- didactische waarde boven volume
- contrast vóór accumulatie
- functioneel Nederlands voor onderbouw VO
- volledige metadata vóór opname in content

---

## Lokale productelementen (niet shared)

De volgende elementen zijn uitsluitend lokaal Werkwoordlab-product en zijn geen shared canon:

### Runtime en evaluatielogica
- `lib/evaluator.ts` — deterministische evaluator, pure functie
- misconceptiemapping in evaluator
- unit-progressielogica

### Contentdata
- `content/units/*.json` — oefenunits
- `content/misconceptions/taxonomy.nl.json` — lokale misconceptietaxonomie (implementatielaag)
- `content/reference/` — machineleesbare regelbestanden voor evaluator en tests

### UI/UX
- Alle `app/`-routes en `components/`
- Scaffold-weergave en leerlinginteractie
- Docentdashboard

### Architectuurkeuzes
- Next.js + TypeScript + Tailwind
- localStorage → Prisma/SQLite progressie (Fase 3)
- Anonieme leerlingssessies, geen verplichte login

### Lokale didactische extensies
De volgende secties in `docs/werkwoordspellingsdidactiek-kaders.md` zijn Werkwoordlab-lokale uitbreidingen die verder gaan dan shared canon:
- Ontwerpregels voor units en zinnenbank
- Ontwerpregels voor misconceptietaxonomie
- Ontwerpregels voor feedback
- Prioritering van grammaticale domeinen
- Evidence-based werkafspraak voor Claude en Codex (verplicht format)
- Definition of done voor didactisch werk

Deze extensies blijven lokaal tenzij een expliciete beslissing wordt genomen ze naar `grammar-core` te sturen.

---

## Local terminology and distinctions

| Lokale term | Betekenis | Relatie tot shared canon |
|---|---|---|
| `primaryMisconception` | Foutcode in item-JSON | Lokale implementatie van shared misconceptiecodes |
| `scaffold` | Stappenweergave in UI | Lokale uitwerking van shared principe "expliciete instructie" |
| `transferTask` | Schrijftaak per unit | Lokale uitwerking van shared principe "transfer" |
| `unitId` | Identifier voor oefenunit | Lokale structuur, niet shared |
| `classCode` | Optionele docent-koppeling | Volledig lokaal |

---

## Supported phenomena and task types

Lokaal ondersteund in de huidige staat:

- persoonsvorm tegenwoordige tijd (unit-01)
- voltooid deelwoord (unit-02)
- homofone gevallen: `word/wordt`, `vind/vindt`, `gebeurt/gebeurd`
- scaffold-stappen per item
- transfer via schrijftaak

Nog niet ondersteund (roadmap):
- persoonsvorm verleden tijd (unit-03, gepland)
- infinitief (unit-04, gepland)
- bijvoeglijk gebruikt voltooid deelwoord (unit-05, gepland)
- onvoltooid deelwoord (unit-06, lage prioriteit)

Parsing wordt niet ondersteund in Werkwoordlab. Parseren is het domein van `ontledingstrainer`.

---

## Feedback and evaluation hooks

- Evaluator geeft: `correctness`, `misconceptionCode`, `hint`
- `misconceptionCode` koppelt aan `content/misconceptions/taxonomy.nl.json`
- `diagnostic.primaryMisconception` per item bepaalt feedbackpad
- Docentaggregatie (Fase 3): misconceptieverdeling per klas/periode

---

## Risks / ambiguities to avoid

- Geen parsinglogica opnemen in Werkwoordlab — dat is het domein van `ontledingstrainer`
- Geen lokale misconceptiecodes uitroepen als shared canon zonder dit via `grammar-core` te laten verlopen
- Geen evaluatorlogica wijzigen die de canonieke beslisvolgorde van het werkwoordspellingsalgoritme doorbreekt
- Geen shared governance-materiaal lokaal herschrijven of tegenspreken
- Geen ad hoc bestandskopieën van `ontledingstrainer` of andere repos — toekomstige cross-repo samenwerking verloopt via `grammar-core`

---

## Local adapter notes

Werkwoordlab consumeert shared content via `shared/grammar-core/adapters/werkwoordlab.md`:

- shared sentence ids en teksten worden bewaard waar mogelijk
- Werkwoordlab voegt lokaal toe: scaffold-tekst, UI-interactiemodus, productspecifieke feedbackkopij
- shared misconceptiereferenties worden gemapt op lokale items via `primaryMisconception`

---

## Toekomstige cross-repo samenwerking

Samenwerking met `ontledingstrainer` of andere repos verloopt via `grammar-core`, niet via ad hoc bestandskopieën.

Wanneer lokale elementen kandidaat zijn voor shared canon:
1. verifieer of het element didactisch of governance-matig portable is
2. bespreek promotie via `grammar-core` issues/PR
3. pas het lokale contract bij na promotie

De grammar-core snapshot in `shared/grammar-core/` wordt bijgehouden via de instructies in `shared/grammar-core/MIRROR-SOURCE.md`.
