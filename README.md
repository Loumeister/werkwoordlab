# Werkwoordlab

Statische Next.js-oefenapp voor Nederlandse werkwoordspelling. De leerling bepaalt eerst de grammaticale functie, kiest daarna de regel en past die toe.

## Huidige productkern

- oefenunits voor persoonsvormen, infinitieven en deelwoorden, geregistreerd in `lib/content.ts`
- invul-, classificatie- en contrastitems uit JSON
- deterministische evaluatie en lokale misconceptiecodes
- hints, bewijskeuze, herstelitems en browserlokale voortgang
- schrijftaak met zelfcontrole
- lokaal inhouds- en feedbackbeheer

Er zijn geen accounts, backend of echte klasgegevens. `/inzichten` toont alleen pogingen uit de huidige browser.

## Ontwikkelen

```bash
npm ci
npm run dev
npm run lint
npm test
npm run build
```

## Belangrijkste bestanden

| Pad | Verantwoordelijkheid |
|---|---|
| `content/units/*.json` | lokale oefenunits |
| `content/reference/*.json` | machineleesbare lokale spellingregels |
| `lib/content.ts` | types en unitregister |
| `lib/evaluator.ts` | deterministische beoordeling |
| `lib/phase-engine.ts` | huidige fase- en steunlogica |
| `lib/feedback/*` | lokale foutcodes, feedback en overrides |
| `components/learner/*` | leerlinglus en herstel |
| `app/groei` | browserlokale voortgang |
| `app/inzichten` | browserlokale diagnoseweergave |
| `docs/product-spec.md` | productcontract |
| `docs/backlog.md` | nog open werk |

## Routes

- `/oefenen`: unitkeuze
- `/oefenen/[unitId]`: één unit
- `/groei`: lokale leerlingvoortgang
- `/schrijven`: transfertaak en zelfcontrole
- `/inzichten`: lokale pogingen op dit apparaat
- `/content` en `/feedback-editor`: lokale beheerschermen

## Opslag en privacy

Pogingen en feedbackoverrides worden in `localStorage` opgeslagen. De data blijft zonder export op het apparaat, is niet gekoppeld aan een account en mag niet als klasadministratie worden geïnterpreteerd.

## Gedeelde canon

`shared/grammar-core/` is een git subtree van `Loumeister/grammar-core`. Werkwoordlab blijft eigenaar van units, evaluator, feedbackmapping, UI en lokale voortgang. Gedeelde canon verandert eerst upstream en wordt daarna via een aparte sync-PR opgehaald.
