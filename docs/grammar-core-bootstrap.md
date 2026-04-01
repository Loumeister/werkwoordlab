# Grammar Core Bootstrap

## Doel
Dit document beschrijft hoe de nieuwe gedeelde repo `grammar-core` direct gestart kan worden als gemeenschappelijke kern voor:
- Werkwoordlab
- ontledingstrainer

De repo moet vanaf dag 1 drie functies vervullen:
1. gedeelde didactische waarheid
2. gedeelde inhouds- en taxonomielaag
3. gedeelde agentbron voor Claude en Codex

## Wat de repo in fase 1 wel moet zijn
- lichtgewicht
- documentgedreven
- inhouds- en governancelaag eerst
- lokaal zichtbaar voor agents na sync naar productrepo’s

## Wat de repo in fase 1 nog niet moet zijn
- volledige runtime library
- database
- monorepo-vervanger
- analytics-platform
- ingewikkelde build-pipeline

## Eerste mapstructuur
```text
grammar-core/
  README.md
  docs/
    werkwoordspellingsdidactiek-kaders.md
    grammar-platform-principles.md
    content-authoring-rules.md
    taxonomy-governance.md
    repo-sync-strategy.md
  agents/
    claude/
      didactic-architect.md
      content-expander.md
      taxonomy-evaluator-guardian.md
    codex/
      evidence-based-workwoordspellingsdidactiek.md
      shared-content-integration.md
  schemas/
    shared-sentence.schema.json
    parsing-metadata.schema.json
    spelling-metadata.schema.json
    shared-grammar-task.schema.json
    misconception.schema.json
  content/
    shared-sentences/
      README.md
      seed-unit-01.json
      seed-unit-02.json
    taxonomy/
      misconceptions.nl.json
  adapters/
    werkwoordlab.md
    ontledingstrainer.md
```

## Startbestanden die eerst moeten worden gevuld
### README.md
Moet uitleggen:
- waarom `grammar-core` bestaat
- welke repo’s ervan gebruikmaken
- wat canoniek is
- hoe sync werkt
- welke bestanden agents altijd eerst moeten lezen

### docs/grammar-platform-principles.md
Moet de integratieprincipes samenvatten:
- grammaticale analyse en spelling horen in één leerlijn
- gedeelde zinlaag
- gedeeld diagnosemodel
- app-specifieke renderers bovenop gedeelde kern

### docs/content-authoring-rules.md
Moet vastleggen:
- hoe gedeelde zinnen worden geschreven
- welke metadata verplicht is
- hoe zinnen in meerdere modi bruikbaar moeten zijn
- hoe contrast en variatie worden ontworpen

### docs/taxonomy-governance.md
Moet vastleggen:
- wanneer nieuwe misconcepties mogen worden toegevoegd
- hoe parsing- en spellingmisconcepties zich tot elkaar verhouden
- hoe productrepo’s wijzigingen mogen voorstellen

### docs/repo-sync-strategy.md
Moet vastleggen:
- waarom agents alleen werken met lokaal zichtbare bestanden
- waarom subtree de voorkeursstrategie is
- hoe sync-proces en verantwoordelijkheden eruitzien

## Gedeelde datamodellen in fase 1
In fase 1 hoeven de schemas nog niet perfect of volledig te zijn. Ze moeten vooral richting geven.

### 1. Shared sentence
Doel:
- één zin bruikbaar maken in meerdere modi

Minimale velden:
- id
- text
- context
- difficulty
- usableIn
- tags

### 2. Parsing metadata
Doel:
- de zin inzetbaar maken voor ontleding en analysegerichte feedback

Minimale velden:
- persoonsvorm
- onderwerp
- inversion
- grammaticalFunctionTargets

### 3. Spelling metadata
Doel:
- de zin inzetbaar maken voor werkwoordspelling

Minimale velden:
- lemma
- target
- grammaticalFunction
- homophonePair
- primaryMisconception
- acceptedVariants

### 4. Shared grammar task
Doel:
- één taakobject kunnen beschrijven dat zowel parsing- als spellinginformatie kan dragen

Minimale velden:
- id
- sentenceId
- sentence
- parsing
- spelling
- notes

## Seed content in fase 1
Start niet met een grote bank, maar met een kleine, sterke set.

### Aanbevolen eerste seedset
- 10–15 gedeelde zinnen
- nadruk op:
  - persoonsvorm tt
  - inversie met jij
  - homofone contrasten
  - persoonsvorm vs voltooid deelwoord
  - scheidbare werkwoorden

### Waarom klein beginnen
- makkelijker governance
- sneller inzetbaar
- minder risico op dubbel werk
- betere toetsing van gedeeld model

## Canonieke agents
### Claude-agents in `grammar-core`
Deze zijn canoniek. Lokale productrepo-agents worden wrappers.

Eerste set:
- didactic-architect
- content-expander
- taxonomy-evaluator-guardian

### Codex-agents/skills in `grammar-core`
Eerste set:
- evidence-based-workwoordspellingsdidactiek
- shared-content-integration

## Regels voor lokale repo-wrappers
Werkwoordlab en ontledingstrainer houden lokale agentbestanden, maar die moeten:
1. eerst de canonieke bestanden in `shared/grammar-core/` lezen
2. daarna pas lokale repo-contracten toepassen
3. geen nieuwe canonieke regels verzinnen

## Syncstrategie
### Voorkeur: git subtree
Waarom:
- fysiek zichtbare bestanden
- geen afhankelijkheid van package-installatie voor agents
- makkelijk te reviewen in productrepo’s

### Nog niet nodig in fase 1
- package publishing
- automatische release-pipeline
- monorepo

## Eerste 7 concrete uitvoerstappen
1. Maak de repo `grammar-core` aan.
2. Voeg README en docs-map toe.
3. Kopieer of herschrijf de bestaande didactische kernbestanden naar `grammar-core/docs/`.
4. Voeg eerste canonieke Claude- en Codex-agentbestanden toe.
5. Definieer de eerste schemas.
6. Voeg een eerste kleine seedset met gedeelde zinnen toe.
7. Sync de repo daarna via subtree naar Werkwoordlab en ontledingstrainer.

## Definition of done voor fase 1
Fase 1 is geslaagd als:
- er een nieuwe repo bestaat met bovenstaande basisstructuur
- de kernbestanden er staan
- de eerste gedeelde agentinstructies bestaan
- minstens één kleine zinnenset gedeeld beschreven is
- beide productrepo’s weten hoe ze later naar deze kern moeten verwijzen

## Eerste implementatievolgorde
Niet eerst code consumeren.

Eerst:
1. governance
2. structuur
3. schemas
4. seed content
5. agentcanon
6. pas daarna integratie in productrepo’s
