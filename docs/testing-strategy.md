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

## Minimale smoke suite
1. Leerling doorloopt unit inclusief transfer.
2. Leerling ziet diagnostische feedback met misconception.
3. Docent ziet misconceptieverdeling en accuratesse.

## Release gate
Een release candidate is geblokkeerd bij:
- falende content-invarianten,
- falende evaluator tests,
- falende learner/teacher smoke tests,
- open P0/P1 defecten.
