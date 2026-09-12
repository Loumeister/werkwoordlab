# Architectuur

## Huidige werkelijkheid

Werkwoordlab is een statisch geëxporteerde Next.js-app. Er is geen serverruntime of database.

```text
content/units + content/reference
              ↓
        lib/content.ts
              ↓
lib/evaluator.ts + lib/phase-engine.ts
              ↓
      components/learner
              ↓
  localStorage voor pogingen
```

## Bronnen van waarheid

- Iteminhoud: `content/units/*.json`
- Spellingregels: `content/reference/*.json` en de gedeelde beslisvolgorde
- Evaluatie: `lib/evaluator.ts`
- Feedbackmapping: `lib/feedback/`
- Feitelijk gedrag: tests en runtime
- Productkeuzes: `docs/product-spec.md`

## Grenzen

`shared/grammar-core/` bevat canon, geen runtime-afhankelijkheid. Een adapter is alleen nodig wanneer beide producten dezelfde content daadwerkelijk gebruiken. Een backend is alleen nodig na een expliciet besluit over identiteit, privacy, beheer en meerapparaatgebruik.

## Bekende spanning

- unit 4–6 missen expliciete fasevelden en leunen op positie
- korte aantalsdrempels worden nu als steunafbouw gebruikt, niet als bewezen beheersing
- `/inzichten` leest dezelfde browseropslag als de leerling
- feedback kan rijk worden weergegeven, maar de app heeft meestal geen bewijs voor een precieze cognitieve diagnose
