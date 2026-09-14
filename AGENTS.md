# Agent guide

Werkwoordlab is de lokale werkwoordspellingsapp. Code, JSON-content en tests bepalen huidig gedrag; `shared/grammar-core/` levert alleen gedeelde canon.

## Leesroute per taak

- Productdoel of prioriteit: `docs/product-spec.md`, `docs/backlog.md`
- Runtime of UI: betrokken bestand, aanroepers en tests
- Evaluator of spellingsregel: `shared/grammar-core/docs/werkwoordspellingsalgoritme.md`, `content/reference/`, `lib/evaluator.ts`
- Feedback of didactiek: `shared/grammar-core/docs/werkwoordspellingsdidactiek-kaders.md`, `shared/grammar-core/docs/feedback-authoring.md`, daarna lokale feedbackcode
- Content: `docs/content-schema.md`, relevante unit en `tests/unit/content-contracts.test.ts`
- Gedeelde canon of sync: `shared/grammar-core/README.md`, `shared/grammar-core/docs/repo-sync-strategy.md`

Lees niet standaard alle docs of skills.

## Productinvarianten

- Bepaal grammaticale functie vóór de spellingregel.
- Goed/fout is deterministisch; geen LLM in de leerlinglus.
- Oefencontent staat in versiebeheer, niet in componentcode.
- Feedback baseert zich op de waarneembare foutcode, geeft één herstelactie en laat opnieuw toepassen.
- De app heeft geen accounts of klasdatalaag. Voortgang en inzichten zijn browserlokaal.
- Noem een onbeoordeelde schrijftaak geen automatische rubric.

## Werkregels

- Voeg geen Prisma, backend, state library of gedeelde runtime toe zonder huidig productbesluit.
- Verander gedeelde bestanden nooit onder `shared/grammar-core/`; wijzig eerst `grammar-core` en synchroniseer na merge.
- Voeg bij niet-triviale logica één gerichte regressietest toe.
- Gebruik Nederlandse leerlingtekst en bestaande Next.js/Tailwindpatronen.
- Leid aantallen en status uit code/tests af; schrijf ze niet handmatig in docs.

## Controle

```bash
npm run lint
npm test
npm run build
```
