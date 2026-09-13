# Lokaal productcontract

## Precedentie

1. Code, JSON-content en tests bepalen huidig gedrag.
2. Dit document en `docs/product-spec.md` bepalen bewuste lokale keuzes.
3. `shared/grammar-core/docs/` bepaalt alleen productoverstijgende canon.
4. `docs/backlog.md` beschrijft nog niet gerealiseerd werk.

## Geadopteerde canon

- grammaticale functie vóór spellingkeuze
- expliciete, controleerbare redenering
- contrast vóór extra volume
- feedback op een herkenbaar antwoordpatroon
- steun afbouwen en transfer beogen
- functionele variatie
- de beslisvolgorde uit `shared/grammar-core/docs/werkwoordspellingsalgoritme.md`

## Lokale eigendom

- het unitregister en lokale itemvormen
- `lib/evaluator.ts` en fase-/steunlogica
- lokale misconceptiecodes en feedbackmapping
- routes, componenten, browseropslag en voortgangsweergave
- machineleesbare regelbestanden onder `content/reference/`

De huidige evaluator is de runtimebron. Een gedeeld algoritmedocument verandert hem niet stilzwijgend; afwijkingen worden eerst met tests vastgesteld en vervolgens bewust opgelost.

## Huidige mogelijkheden

- alle units uit `lib/content.ts` zijn rechtstreeks bereikbaar
- classificatie, invullen en contrastparen
- functie-, spelling-, bewijs- en herstelstappen
- lokale pogingen en lokale inzichten
- schrijftaak met zelfcontrole

Er is geen parsingproduct, klasdatalaag, account, server of database.

## Feedbackcontract

Een misconceptiecode kiest een herstelpad. Die code bewijst niet welke gedachte de leerling had. Feedback benoemt daarom het antwoordpatroon, geeft één concrete check en vraagt een nieuwe toepassing. Een uitgebreid veld `diagnose` wordt gelezen als mogelijke verklaring, niet als vaststelling.

## Cross-repo

Gedeelde wijzigingen gaan eerst naar `grammar-core`. Na merge worden beide productsubtrees via aparte PR's gesynchroniseerd. Rechtstreekse wijzigingen in `shared/grammar-core/` zijn niet toegestaan.
