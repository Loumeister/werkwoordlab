# Teststrategie

## Doel
Borgen dat evaluatorlogica, contentcontracten en kernflows deterministisch en stabiel blijven.

## Testlagen
- **Unit (Vitest)**: regeltoepassing, homofone beslissingen, misconceptiemapping.
- **Integration (Vitest)**: content loader + schema-invarianten, attempt-verwerking, aggregaties.
- **E2E (Playwright)**: learner flow en teacher insights flow.

## Verplichte dekking per wijziging
- Evaluator/didactische logica: unit tests + minimaal 1 integratietest.
- Contentwijziging: JSON/schema-validatie + content smoke test.
- Learner UI flow wijziging: Playwright flowtest voor aangepast pad.
- Teacher insights wijziging: aggregatie-integratietest + teacher e2e smoke.

## Minimale smoke suite (Playwright)
1. Leerling kan `/oefenen` openen.
2. Leerling kan een echte unitroute openen (minimaal `unit-01-pv-tt`).
3. Oefenscherm toont kernonderdelen: prompt, scaffold, antwoordinvoer en verzendactie.
4. Leerling kan een antwoord insturen en diagnostische feedback zien.
5. Ongeldige unitroute (`/oefenen/nonexistent-unit`) geeft not-found gedrag en valt niet stil terug op een default-unit.
6. Docentinzichten-route rendert zonder crash.
7. Content/bibliotheek-route rendert zonder crash.

## Verdiepende flowtest
- Eén end-to-end learner-flow van unitselectie naar feedback als stabiliteitsanker voor MVP.
- Geen brede matrix van edge-cases in deze fase; focus op deterministische kernpaden.

## Release gate
Een release candidate is geblokkeerd bij:
- falende content-invarianten,
- falende evaluator tests,
- falende learner/teacher smoke tests,
- open P0/P1 defecten.
