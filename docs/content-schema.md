# Contentschema

## Locaties
- Units: `content/units/<unit-id>.json`
- Taxonomie: `content/misconceptions/taxonomy.nl.json`

## Unit contract (verplicht)
```json
{
  "id": "unit-01-pv-tt",
  "title": "...",
  "level": "onderbouw-vo",
  "language": "nl",
  "learningGoals": ["..."],
  "items": [
    {
      "id": "u1-i1",
      "type": "fill-in",
      "prompt": "...",
      "context": "...",
      "lemma": "...",
      "grammaticalFunction": "persoonsvorm",
      "tense": "tegenwoordige-tijd",
      "subject": "...",
      "target": "...",
      "homophonePair": "word/wordt",
      "scaffold": { "step1": "...", "step2": "...", "step3": "..." },
      "diagnostic": {
        "primaryMisconception": "PV_STAM_T_OMISSION",
        "acceptedVariants": []
      },
      "feedback": { "correct": "...", "hint": "..." }
    }
  ],
  "transferTask": {
    "id": "u1-transfer-1",
    "type": "revision",
    "prompt": "...",
    "rubric": ["..."]
  }
}
```

## Enums
- `grammaticalFunction`: `persoonsvorm | infinitief | voltooid-deelwoord | bijvoeglijk-deelwoord | onvoltooid-deelwoord`
- `type`: `fill-in | multiple-choice | classify`
- `transferTask.type`: `revision | short-writing`

### Toelichting nieuwe grammaticalFunction-waarden
| Waarde | Wanneer gebruiken |
|---|---|
| `bijvoeglijk-deelwoord` | Voltooid deelwoord gebruikt als bijvoeglijke bepaling (attributief of predicatief), niet als onderdeel van de werkwoordstijdsvorm. Gebruik dit voor items in `unit-05-bijvoeglijk-vd` die het bijvoeglijk gebruik modelleren. |
| `onvoltooid-deelwoord` | Tegenwoordig deelwoord (`-end`-vorm), functionerend als bijvoeglijke bepaling of in een deelwoordgroep. Gebruik dit voor items in `unit-06-onvoltooid-deelwoord`. |

### classify-itemtype voor bijvoeglijk/werkwoordelijk contrast
Items van `type: classify` kunnen leerlingen laten kiezen tussen twee grammaticale functies (bijv. `werkwoordelijk` vs `bijvoeglijk`). Schema-vereiste:
```json
{
  "type": "classify",
  "classifyOptions": ["werkwoordelijk", "bijvoeglijk"],
  "target": "bijvoeglijk"
}
```
Het veld `classifyOptions` is **verplicht** bij `type: classify`; de evaluator valideert dat `target` één van de opties is.

## Taxonomie contract
```json
{
  "version": "1.0.0",
  "language": "nl",
  "misconceptions": [
    {
      "code": "PV_STAM_T_OMISSION",
      "title": "...",
      "learnerDescription": "...",
      "teacherDescription": "...",
      "remediation": ["..."]
    }
  ]
}
```

## Invarianten (moeten in tests afgedwongen worden)
1. Unit-id uniek in repo.
2. Item-id uniek binnen unit.
3. `language` is `nl`.
4. Elk item heeft scaffold + diagnostic + feedback.
5. `primaryMisconception` verwijst naar bestaande taxonomiecode.
6. `acceptedVariants` bevat alleen bewust toegestane alternatieven.
7. Elke unit heeft een transferTask.
8. Unit bevat minimaal 8 items.
