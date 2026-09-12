# Productspecificatie Werkwoordlab

_Actueel op 2026-09-12._

## Doel

Werkwoordlab leert leerlingen een overdraagbare beslisroute gebruiken:

1. bepaal de grammaticale functie van de werkwoordsvorm
2. kies het passende regelpad
3. bepaal stam, onderwerp, tijd of deelwoordvorm waar nodig
4. schrijf de vorm
5. verantwoord of herstel de keuze

## Huidige scope

De units in `lib/content.ts` vormen de productkern; hun fasegedrag volgt uit de fasevelden in de content en anders uit de positiebepaalde fallback. Pogingen, voortgang en inzichten zijn lokaal op één browser.

## Didactische eisen

- Functie vóór spelling.
- Betekenisvolle contrasten vóór extra itemvolume.
- Steun wordt alleen afgebouwd op basis van relevante eerdere pogingen.
- Een foutcode beschrijft een waarneembaar antwoordpatroon, niet automatisch de gedachte van de leerling.
- Feedback geeft één uitvoerbare herstelhandeling en daarna een nieuwe toepassing.
- Transfer wordt alleen als beoordeeld gepresenteerd als de beoordeling werkelijk inhoudelijk geldig is.

## Technische grenzen

- Next.js, TypeScript, Tailwind en statische export
- JSON-content in versiebeheer
- pure evaluator en Vitest-contracttests
- localStorage voor pogingen en overrides
- geen account, backend, database of LLM in de leerlinglus

## Niet-doelen

- geen Prisma/SQLite zolang er geen gegevens- en identiteitsbesluit is
- geen klasdashboard op basis van één browser
- geen generatieve spellingbeoordeling
- geen gedeelde runtime met Ontleedlab zonder aantoonbaar dubbele, stabiele logica
- geen nieuwe unit voordat de bestaande units inhoudelijk en technisch coherent zijn

## Acceptatie

- leerling kan iedere unit rechtstreeks openen
- evaluator en contentcontracten zijn deterministisch
- ongeldige unitroute faalt zichtbaar
- feedbackregels zijn grammaticaal juist en door tests aan hun authoringcontract getoetst
- lint, tests en productie-build slagen
