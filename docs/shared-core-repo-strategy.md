# Shared Core Repo Strategy

## Probleem
Werkwoordlab en ontledingstrainer leven nu in aparte repositories. Claude- en Codex-agents kunnen alleen betrouwbaar werken met bestanden die fysiek aanwezig zijn in de huidige repo-context.

Dat betekent:
- repo A kan niet vanzelf de agentbestanden en didactische kaders van repo B lezen
- package dependencies lossen runtime-hergebruik op, maar niet het agent-zichtbaarheidsprobleem
- een gedeelde inhouds- en governancelaag moet daarom fysiek aanwezig zijn in beide repo’s

## Aanbevolen oplossing
Maak een aparte gedeelde kernrepo, bijvoorbeeld:
- `grammar-core`

Gebruik die repo als single source of truth voor:
- gedeelde didactische kaders
- gedeelde taxonomie
- gedeelde schemas
- gedeelde sentence/contentlaag
- canonieke Claude-agentinstructies
- canonieke Codex-instructies

Neem die kern vervolgens **lokaal** op in beide productrepo’s via een syncbare strategie, bij voorkeur **git subtree**.

## Waarom niet alleen een package?
Een package dependency is bruikbaar voor runtimecode, maar niet voldoende voor agents.

### Package-only beperkingen
- agents zien package-inhoud vaak niet als expliciete bronlaag in hun werkcontext
- docs, governancebestanden en agentinstructies leven dan buiten directe repo-zichtbaarheid
- je krijgt risico op inhoudelijke drift tussen runtime en instructielaag

### Daarom nodig
Beide repo’s moeten de gedeelde kernbestanden letterlijk bevatten, bijvoorbeeld onder:
- `shared/grammar-core/`

## Aanbevolen mapstructuur in grammar-core
```text
grammar-core/
  docs/
    werkwoordspellingsdidactiek-kaders.md
    grammar-platform-principles.md
    content-authoring-rules.md
    taxonomy-governance.md
  schemas/
    shared-sentence.schema.json
    grammar-task.schema.json
    misconception.schema.json
  content/
    shared-sentences/
    taxonomy/
    rules/
  agents/
    claude/
      didactic-architect.md
      content-expander.md
      taxonomy-evaluator-guardian.md
    codex/
      evidence-based-workwoordspellingsdidactiek.md
  adapters/
    werkwoordlab.md
    ontledingstrainer.md
```

## Wat hoort in grammar-core
### 1. Gedeelde docs
- didactische kaders
- governance
- schrijfregels voor content
- integratieprincipes

### 2. Gedeelde schemas
- shared sentence object
- task object
- misconception object
- validatieregels

### 3. Gedeelde content
- zinnen
- relationele metadata
- taxonomy
- regelbestanden

### 4. Gedeelde agents
- canonieke instructies voor Claude
- canonieke instructies voor Codex

## Hoe beide productrepo’s het moeten gebruiken
In Werkwoordlab en ontledingstrainer komt een lokale, syncbare kopie van de gedeelde kern, bijvoorbeeld:

```text
shared/grammar-core/
```

Daarmee kunnen agents in beide repo’s dezelfde bron lezen.

## Lokale wrappers in de productrepo’s
### Claude
In iedere repo blijven lokale agentbestanden bestaan, maar die worden dunne wrappers.

Voorbeeld:
- `.claude/agents/01_didactic-architect.md`

Inhoudelijk moet zo’n wrapper zeggen:
1. lees eerst de canonieke gedeelde bestanden uit `shared/grammar-core/`
2. pas daarna de lokale repo-regels toe

### Codex
Hetzelfde voor `.agents/skills/*`.

De lokale skill blijft bestaan, maar verwijst eerst naar:
- `shared/grammar-core/docs/...`
- `shared/grammar-core/agents/codex/...`

## Hiërarchie van instructies
De juiste volgorde is:
1. gedeelde kernrepo-documenten
2. gedeelde canonieke agents
3. lokale repo-contracten (`AGENTS.md`, lokale content schema’s, lokale backlog)
4. taakprompt

Zo voorkom je dat twee repo’s inhoudelijk uit elkaar groeien.

## Vergelijking van repo-strategieën
### Optie A — aparte repo’s + package publishing only
**Niet aanbevolen als eerste stap**.

Voordelen:
- licht voor runtime

Nadelen:
- agent-zichtbaarheid niet opgelost
- docs/governance niet fysiek aanwezig
- grotere kans op drift

### Optie B — aparte repo’s + gedeelde kernrepo + git subtree
**Aanbevolen nu**.

Voordelen:
- agents zien dezelfde bronbestanden lokaal
- geen zware migratie nodig
- productrepo’s blijven zelfstandig
- later nog steeds opschaalbaar naar monorepo of package-publicatie

Nadelen:
- subtree-sync vraagt discipline
- kans op wrapper drift als governance ontbreekt

### Optie C — direct monorepo
**Nu nog niet aanbevolen**.

Voordelen:
- alles in één context
- eenvoudigere zichtbaarheid

Nadelen:
- te zware migratie nu
- risico op veel tegelijk veranderen
- grotere organisatorische ingreep dan nodig

### Optie D — later monorepo
**Goede langetermijnoptie**.

Begin met optie B en heroverweeg een monorepo pas wanneer:
- gedeelde contentlaag stabiel is
- beide apps dezelfde kernobjecten gebruiken
- cross-routing en gezamenlijk dashboard echt nodig worden

## Aanbevolen strategie nu
### Stap 1
Maak `grammar-core` als aparte repo.

### Stap 2
Zet daar:
- gedeelde docs
- gedeelde taxonomie
- gedeelde schemas
- gedeelde sentence bank
- canonieke agentinstructies

### Stap 3
Sync deze repo via git subtree in:
- Werkwoordlab
- ontledingstrainer

### Stap 4
Maak lokale wrappers in beide repo’s die altijd eerst `shared/grammar-core/` lezen.

## Minimale gedeelde datamodellen
### SharedSentence
- id
- text
- context
- source
- difficulty
- usableIn
- tags

### ParsingMetadata
- persoonsvorm
- onderwerp
- grammaticalFunctionTargets
- inversion
- sentencePattern

### SpellingMetadata
- lemma
- target
- grammaticalFunction
- homophonePair
- primaryMisconception
- acceptedVariants

### SharedGrammarTask
- id
- sentenceId
- sentence
- parsing
- spelling
- didactic notes

## Agent-zichtbaarheidsoplossing expliciet
De oplossing is dus niet dat repo’s elkaar live moeten kunnen lezen.

De oplossing is:
- één canonieke gedeelde kernrepo
- fysieke spiegeling van die kern in beide productrepo’s
- lokale agentwrappers die eerst de gedeelde kern lezen

Dat is de meest betrouwbare aanpak voor Claude en Codex.

## Belangrijkste risico’s
1. **Taxonomy drift**
   - als lokale repo’s toch eigen codes gaan uitvinden
2. **Wrapper drift**
   - als lokale agents niet meer synchroon lopen met de canonieke bron
3. **Sync friction**
   - subtree updates worden vergeten
4. **Overengineering**
   - te vroeg te veel technische infrastructuur bouwen
5. **Content duplication**
   - gedeelde zinnen toch weer lokaal overschrijven

## Governance-regels
- canonieke inhoud leeft in grammar-core
- productrepo’s mogen canonieke gedeelde bestanden niet stilzwijgend wijzigen zonder terug te syncen
- nieuwe misconcepties en schemas eerst in grammar-core, daarna pas lokaal toepassen
- lokale wrappers mogen alleen repo-specifieke aanvullingen bevatten

## Eerste 5 concrete technische stappen
1. Maak repo `grammar-core` aan.
2. Verplaats of kopieer bestaande didactische kernbestanden naar `grammar-core/docs/`.
3. Voeg canonieke Claude- en Codex-agentbestanden toe aan `grammar-core/agents/`.
4. Neem `grammar-core` via git subtree op in Werkwoordlab onder `shared/grammar-core/`.
5. Pas lokale Claude- en Codex-agents aan zodat ze altijd eerst `shared/grammar-core/` lezen.

## Besluit
De beste route nu is:
- aparte repo’s behouden
- gedeelde kernrepo introduceren
- subtree-sync gebruiken
- later pas, indien nodig, richting monorepo bewegen

Dat lost het zichtbaarheidprobleem van agents op zonder de huidige ontwikkelbaarheid van beide producten kapot te maken.
