# Agent prompt — Engine fase 0: Content target-validatie

## Context
Je werkt in de repo `werkwoordlab`. Lees eerst deze bestanden in exact deze volgorde:

1. `AGENTS.md`
2. `docs/engine-phase-0-spec.md` ← **dit is je taakspecificatie**
3. `docs/testing-strategy.md`
4. `tests/unit/content-contracts.test.ts` ← conventie voor bestaande tests
5. `content/reference/stem-rules.nl.json`
6. `content/reference/pv-tt-rules.nl.json`
7. `content/reference/pv-vt-rules.nl.json`
8. `content/reference/voltooid-deelwoord-rules.nl.json`
9. `content/reference/prefix-behaviour.nl.json`
10. `content/reference/irregular-verbs.nl.json`

Lees daarna steekproefsgewijs items uit ten minste drie unit-bestanden om de datastructuur te begrijpen:
- `content/units/unit-01-pv-tt.json` (eerste 5 items)
- `content/units/unit-02-voltooid-deelwoord.json` (eerste 5 items)
- `content/units/unit-03-pv-vt.json` (eerste 5 items)

## Taak
Maak precies **één nieuw bestand**: `tests/unit/target-validation.test.ts`

Dit bestand valideert dat alle `target`-waarden in alle unit-JSON-bestanden kloppen met de spellingregels in `content/reference/`. De details staan in `docs/engine-phase-0-spec.md`.

## Kernregels
1. **Wijzig geen bestaande bestanden.** Geen wijzigingen aan evaluator, content.ts, unit-JSON of reference-JSON.
2. **Schrijf hulpfuncties bovenin het testbestand** (of in `tests/helpers/stem-utils.ts`). Dit zijn testhelpers, geen engine.
3. **Ruwe stam ≠ orthografische stam.** De keuze d/t (kofschip) gebeurt op de ruwe stam. De zichtbare vorm gebruikt de orthografische stam. Meng deze nooit.
4. **Irregular-verbs gaan vóór regels.** Check altijd eerst of het lemma in `irregular-verbs.nl.json` staat voordat je reguliere regels toepast.
5. **Meld gevonden fouten als `// FINDING:` comments**, niet als fixes aan content.
6. **Test moet slagen via `npm test`.** Als een target niet klopt met je berekening, is je berekening waarschijnlijk fout — niet de content. Debug je hulpfuncties eerst.

## Stamafleiding-regels (samenvatting)

### Ruwe stam
```
lemma eindigend op -iën → trek -n af (ruziën → ruzië)
anders → trek -en af (maken → mak, leven → lev, pakken → pakk)
```

### Orthografische stam (normaliseer de ruwe stam)
1. Één medeklinker na enkele klinker → klinker is lang → verdubbel (`mak` → `maak`, `lop` → `loop`)
   Meer dan één medeklinker na klinker → klinker is kort → niet verdubbelen (`werk` → `werk`)
   Implementatie: check `/[aeiou][^aeiou]$/` op de ruwe stam.
2. Dubbele eindmedeklinker → verwijder er één (`pakk` → `pak`, `miss` → `mis`)
3. Eind-v → f (`lev` → `leef`, `schrijv` → `schrijf`)
4. Eind-z → s (`loz` → `loos`, `verhuiz` → `verhuis`)

Let op de volgorde: verdubbeling vóór het droppen van dubbele medeklinkers. Bij `pakk` check je eerst: twee medeklinkers na `a` → kort → geen verdubbeling. Dan drop je de dubbele `k` → `pak`.

### 't Kofschip (op de RUWE stam)
Laatste letter van de ruwe stam in {t, k, f, s, ch, p} → t-werkwoord.
Anders → d-werkwoord.

Let op: `leven` heeft ruwe stam `lev` → laatste letter `v` → NIET in kofschip → d-werkwoord → `leefde` (niet `*leefte`).

## Verwachte test-structuur

```
describe("target-validation", () => {
  describe("stamafleiding", () => {
    // Test de hulpfuncties zelf tegen de voorbeelden uit stem-rules.nl.json
  })

  describe("unit-01 PV TT targets", () => {
    // Loop over alle fill-in items, bereken verwachte PV TT, vergelijk met target
  })

  describe("unit-02 VD targets", () => {
    // Loop over alle VD fill-in items, bereken verwachte VD, vergelijk met target
  })

  describe("unit-03 PV VT targets", () => {
    // Loop over alle VT items, bereken verwachte VT, vergelijk met target
  })

  describe("unit-04 infinitief targets", () => {
    // target === lemma
  })

  describe("unit-05 bijvoeglijk VD targets", () => {
    // fill-in items: target === VD-vorm (+ evt. e)
  })

  describe("unit-06 OD targets", () => {
    // fill-in items: target === stam + end/ende
  })
})
```

## Verificatie
Na het schrijven:
1. Run `npm test` — alles moet slagen.
2. Tel het aantal gevalideerde items — rapporteer het totaal.
3. Rapporteer eventuele `// FINDING:` gevallen.

## Wat je NIET moet doen
- Geen `lib/engine/` directory aanmaken.
- Geen wijzigingen aan `package.json` of dependencies.
- Geen nieuwe bestanden buiten `tests/`.
- Geen dynamische exercisegeneratie.
- Geen wijzigingen aan de learner-flow of evaluator.
