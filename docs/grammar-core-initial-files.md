# Grammar Core Initial Files

## Doel
Dit document beschrijft de concrete startbestanden die direct in de nieuwe repo `grammar-core` moeten worden aangemaakt.

Het is bedoeld als uitvoerbare checklist voor de eerste bootstrap.

## 1. README.md
### Functie
De README moet in één oogopslag duidelijk maken:
- waarom `grammar-core` bestaat
- welke repo’s het gebruiken
- wat canoniek is
- wat lokaal wrappergedrag is
- hoe sync werkt

### Minimale inhoud
- korte missie
- mapstructuur
- relatie tot Werkwoordlab en ontledingstrainer
- syncstrategie
- lijst met kernbestanden die agents eerst moeten lezen

## 2. docs/werkwoordspellingsdidactiek-kaders.md
### Functie
Canonieke didactische basis voor werkwoordspelling.

### Bron
Gebruik de bestaande Werkwoordlab-versie als basis en maak die daarna canoniek in `grammar-core`.

## 3. docs/grammar-platform-principles.md
### Functie
Beschrijft de gedeelde productprincipes van het geïntegreerde grammatica- en spellingplatform.

### Minimale onderwerpen
- analyse vóór spelling
- gedeelde zinlaag
- gedeeld diagnosemodel
- meerdere leermodi op dezelfde inhoud
- app-specifieke renderers bovenop gedeelde kern

## 4. docs/content-authoring-rules.md
### Functie
Legt vast hoe gedeelde zinnen en taakobjecten moeten worden geschreven.

### Minimale regels
- elke zin moet inzetbaar zijn in minstens één modus, liefst meerdere
- geen cosmetische variatie zonder didactische meerwaarde
- contrasten hebben prioriteit boven bulkuitbreiding
- metadata moet volledig genoeg zijn voor zowel analyse als spelling

## 5. docs/taxonomy-governance.md
### Functie
Beschrijft wanneer een nieuwe misconceptie mag worden toegevoegd en hoe parsing- en spellingtaxonomie zich tot elkaar verhouden.

### Minimale regels
- alleen splitsen bij andere herstelroute of ander docent-signaal
- geen productrepo-specifieke canonieke codes
- wijzigingen eerst in `grammar-core`, daarna pas in productrepo’s

## 6. docs/repo-sync-strategy.md
### Functie
Beschrijft hoe `grammar-core` lokaal zichtbaar wordt in beide productrepo’s.

### Minimale onderwerpen
- waarom agents lokaal zichtbare bestanden nodig hebben
- waarom package-only niet genoeg is
- waarom subtree nu de voorkeursstrategie is
- wie sync initieert
- hoe wrappers up-to-date blijven

## 7. agents/claude/didactic-architect.md
### Functie
Canonieke Claude-agent voor didactische beslissingen.

### Minimale eisen
- leest eerst didactische kaders
- noemt expliciet welk principe een voorstel ondersteunt
- mag niets evidence-based noemen zonder die koppeling

## 8. agents/claude/content-expander.md
### Functie
Canonieke Claude-agent voor inhoudsgroei.

### Minimale eisen
- contrastdidactiek verplicht
- geen bulkzinnen zonder diagnostische meerwaarde
- benoemt expliciet doel, misconceptie en testimpact

## 9. agents/claude/taxonomy-evaluator-guardian.md
### Functie
Canonieke Claude-agent voor taxonomie- en evaluatiewijzigingen.

### Minimale eisen
- nieuwe codes alleen bij echt andere herstelroute
- expliciete koppeling aan didactisch kader
- benoemt altijd welke tests mee moeten veranderen

## 10. agents/codex/evidence-based-workwoordspellingsdidactiek.md
### Functie
Canonieke Codex-agent/skill voor didactische toetsing.

### Minimale eisen
- gebruikt het didactische kaderdocument
- wijst vage evidence-claims af
- bewaakt functie-eerst, contrasten, diagnostiek en transfer

## 11. agents/codex/shared-content-integration.md
### Functie
Canonieke Codex-agent/skill voor gedeelde contentintegratie tussen productrepo’s.

### Minimale eisen
- bewaakt schema- en metadata-consistentie
- voorkomt repo-specifieke afwijkingen in gedeelde objecten
- houdt integratie klein en expliciet

## 12. schemas/shared-sentence.schema.json
### Functie
Schema voor gedeelde zinnen.

### Minimale velden
- id
- text
- context
- difficulty
- usableIn
- tags

## 13. schemas/parsing-metadata.schema.json
### Functie
Schema voor analysegerichte metadata.

### Minimale velden
- persoonsvorm
- onderwerp
- inversion
- grammaticalFunctionTargets

## 14. schemas/spelling-metadata.schema.json
### Functie
Schema voor spellinggerichte metadata.

### Minimale velden
- lemma
- target
- grammaticalFunction
- homophonePair
- primaryMisconception
- acceptedVariants

## 15. schemas/shared-grammar-task.schema.json
### Functie
Schema voor taken die parsing- en spellingmetadata combineren.

## 16. schemas/misconception.schema.json
### Functie
Canoniek schema voor gedeelde misconceptie-objecten.

## 17. content/taxonomy/misconceptions.nl.json
### Functie
Eerste gedeelde taxonomielaag.

### Begin klein
Niet meteen volledig samenvoegen. Start met de overlap die nu al relevant is voor Werkwoordlab en ontledingstrainer.

## 18. content/shared-sentences/README.md
### Functie
Legt uit hoe de gedeelde sentence bank is opgebouwd.

## 19. content/shared-sentences/seed-unit-01.json
### Functie
Kleine eerste set zinnen rond:
- persoonsvorm tt
- inversie met jij
- homofone contrasten

## 20. content/shared-sentences/seed-unit-02.json
### Functie
Kleine eerste set zinnen rond:
- persoonsvorm vs voltooid deelwoord
- -d/-t
- scheidbare werkwoorden

## Eerste uitvoerbare volgorde
1. README
2. didactische kaders
3. platformprincipes
4. governance
5. canonieke agents
6. schemas
7. taxonomy
8. seed sentences
9. pas daarna subtree-integratie

## Gebruik van dit document
Wanneer de nieuwe repo wordt gemaakt, moeten deze bestanden eerst worden aangemaakt voordat:
- Werkwoordlab wordt aangepast
- ontledingstrainer wordt aangepast
- lokale agentwrappers worden herschreven
