# Shared-core alignment voor werkwoordregelbestanden

## Doel
Dit document legt vast hoe lokale werkwoordregelbestanden en documentatie in Werkwoordlab zich verhouden tot `shared/grammar-core/`.

`shared/grammar-core/` is aanwezig als handmatig geboostrappede snapshot van `Loumeister/grammar-core` @ `4a4cfeceac2fe4f37cf81eb395446acd977460a7`. Zie `shared/grammar-core/MIRROR-SOURCE.md` voor sync-instructies.

## Leeshierarchie
Bij inhoudelijke wijzigingen aan werkwoordspellingsregels geldt deze volgorde:
1. `shared/grammar-core/docs/werkwoordspellingsdidactiek-kaders.md`
2. `shared/grammar-core/docs/grammar-platform-principles.md`
3. `shared/grammar-core/docs/content-authoring-rules.md`
4. `shared/grammar-core/docs/taxonomy-governance.md`
5. lokale Werkwoordlab-documenten in `docs/`
6. lokale machineleesbare bestanden in `content/reference/`

Voor agentwerk geldt de bredere leeshiërarchie uit `AGENTS.md`.

## Afbakening
De lokale documenten en JSON-bestanden in Werkwoordlab zijn:
- geen vervanging van shared canon
- geen stille canonisering
- wel de lokale implementatie- en gebruikslaag voor Werkwoordlab

## Wat lokaal mag
Werkwoordlab mag lokaal:
- regels machineleesbaar vastleggen voor evaluator, contentvalidatie en tests
- lexicale uitzonderingen structureren voor oefencontent
- implementatievolgorde en precedentie expliciteren
- shared principes vertalen naar repo-specifieke werking

## Wat lokaal niet mag
Werkwoordlab mag lokaal niet:
- nieuwe gedeelde didactische principes uitroepen zonder `grammar-core`
- gedeelde misconceptioncodes stilzwijgend canoniek maken
- shared canon tegenspreken in lokale docs of JSON-bestanden
- repo-specifieke shortcuts vermommen als algemene grammaticale waarheid

## Werkafspraak voor nieuwe lokale regelbestanden
Nieuwe lokale werkwoordregelbestanden zijn alleen toegestaan als ze aan alle voorwaarden voldoen:
1. ze ondersteunen `functie -> regel -> spelling`
2. ze zijn deterministisch en toetsbaar
3. ze benoemen hun lokale scope expliciet
4. ze botsen niet met shared governance
5. ze kunnen later worden vervangen of gevoed door `shared/grammar-core` zonder betekenisbreuk

## Praktische interpretatie
- `docs/*.md` beschrijft de lokale uitleglaag voor mensen.
- `content/reference/*.json` beschrijft de lokale regellaag voor code en tests.
- Bij conflict gaat shared canon vóór lokale uitleg.
- Bij conflict tussen code en documentatie gaat lokale code/runtime-werkelijkheid vóór documentatie (voor feitelijk gedrag van de repo).

## Mirror-sync en onderhoud
Zie `shared/grammar-core/MIRROR-SOURCE.md` voor:
- de pinned commit van de huidige snapshot
- instructies voor het vervangen van de snapshot door een echte git subtree
- instructies voor toekomstige updates na de echte subtree-koppeling

Intentionele lokale afwijkingen van shared canon worden gedocumenteerd in `docs/product-contract.md`, niet in `shared/grammar-core/`.

## Relatie met de rest van de repo
Deze alignment geldt voor:
- evaluatoruitbreidingen
- nieuwe units
- contentvalidatie
- toekomstige misconceptiemapping
- regressietests op randgevallen

Lees dit document samen met `docs/reference-layer-usage.md` en `docs/product-contract.md`.
