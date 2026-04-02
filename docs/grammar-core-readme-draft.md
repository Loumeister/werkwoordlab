# grammar-core

## Doel
`grammar-core` is de gedeelde kernrepo voor:
- Werkwoordlab
- ontledingstrainer

De repo bevat de **canonieke inhoudelijke en didactische bronlaag** voor beide producten.

Dat betekent dat `grammar-core` de centrale plek is voor:
- didactische kaders
- gedeelde taxonomie
- gedeelde schemas
- gedeelde sentence bank
- canonieke Claude-agentinstructies
- canonieke Codex-instructies

## Waarom deze repo bestaat
Werkwoordlab en ontledingstrainer vullen elkaar inhoudelijk aan, maar hun repo’s en agents kunnen elkaar niet betrouwbaar zien.

Daarom is een derde repo nodig die:
1. de gedeelde waarheid bewaart
2. lokaal zichtbaar gemaakt kan worden in beide productrepo’s
3. inhoudelijke drift tussen grammatica en werkwoordspelling voorkomt

## Kernprincipe
De gedeelde productvisie is:
- grammaticale analyse is een noodzakelijke voorwaarde voor betrouwbare werkwoordspelling
- werkwoordspelling is toepassing van grammatica, niet alleen vormkennis
- revisie en schrijven bouwen voort op analyse en spelling
- docentinzichten moeten analyseproblemen en spellingproblemen in samenhang tonen

## Wat canoniek is in deze repo
Canoniek betekent: wijzigingen beginnen hier en worden daarna pas doorgezet naar productrepo’s.

In `grammar-core` zijn canoniek:
- `docs/werkwoordspellingsdidactiek-kaders.md`
- `docs/grammar-platform-principles.md`
- `docs/content-authoring-rules.md`
- `docs/taxonomy-governance.md`
- `docs/repo-sync-strategy.md`
- `agents/claude/*`
- `agents/codex/*`
- `schemas/*`
- `content/taxonomy/*`
- `content/shared-sentences/*`

## Wat niet canoniek is in deze repo
Niet canoniek zijn:
- productspecifieke UI-regels
- productspecifieke routes
- productspecifieke runtime-implementaties
- productspecifieke dashboards

Die blijven in Werkwoordlab of ontledingstrainer.

## Mapstructuur
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

## Hoe Werkwoordlab en ontledingstrainer dit gebruiken
Beide productrepo’s nemen `grammar-core` lokaal op, bij voorkeur via **git subtree**, bijvoorbeeld onder:

```text
shared/grammar-core/
```

Dat is nodig omdat Claude- en Codex-agents alleen betrouwbaar werken met bestanden die fysiek in de huidige repo aanwezig zijn.

## Waarom package-only niet genoeg is
Een npm package of andere dependency kan runtime-code delen, maar lost het agent-zichtbaarheidsprobleem niet op.

Package-only is daarom onvoldoende voor:
- didactische governance
- agentinstructies
- canonieke docs
- gedeelde schemas als bronlaag

## Lokale repo-wrappers
In Werkwoordlab en ontledingstrainer blijven lokale Claude- en Codex-bestanden bestaan, maar die zijn wrappers.

Hun volgorde moet zijn:
1. lees eerst `shared/grammar-core/`
2. lees daarna lokale repo-contracten
3. pas daarna de taakprompt toe

## Syncstrategie
### Aanbevolen nu
- aparte repo’s behouden
- `grammar-core` als gedeelde kernrepo
- sync via git subtree

### Nog niet nodig
- package publishing
- monorepo
- automatische gedeelde release pipeline

## Eerste fase
Fase 1 van `grammar-core` is geslaagd als:
- de gedeelde docs bestaan
- de eerste canonieke agents bestaan
- de eerste schemas bestaan
- de eerste kleine sentence set bestaat
- beide productrepo’s weten hoe ze later naar deze kern moeten verwijzen

## Agentregel
Voor zowel Claude als Codex geldt:
- noem een voorstel niet evidence-based zonder expliciete koppeling aan de relevante didactische kaders in `docs/`
- behandel `grammar-core` als eerste inhoudelijke bronlaag
- wijzig canonieke inhoud niet stilzwijgend in productrepo’s

## Eerste concrete vervolgstappen
1. Voeg de docs toe.
2. Voeg de canonieke agentbestanden toe.
3. Definieer de eerste schemas.
4. Voeg de eerste kleine seedset toe.
5. Sync daarna naar Werkwoordlab en ontledingstrainer.
