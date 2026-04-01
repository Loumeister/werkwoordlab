# Productspec (MVP)

## Productdoel
Webapp voor onderbouw VO om werkwoordspelling correct toe te passen via expliciete redenering en transfer.

## Doelgroep
- Leerlingen (12–15 jaar)
- Docenten Nederlands

## Productgrenzen
### In scope
1. Nederlandstalige browserapp.
2. Data-gedreven oefenunits uit JSON-content.
3. Zichtbare scaffold: grammaticale functie -> regel -> spelling.
4. Diagnostische feedback met misconceptiecode.
5. Anonieme leerlingsessie zonder verplichte login.
6. Docentinzichten (misconcepties/accuratesse/deelname) in MVP.
7. Transfer per unit: revisie of korte schrijftaak.

### Out of scope
- AI/LLM-feedback in learner loop.
- Verplicht leerlingaccount.
- Geavanceerde adaptieve personalisatie buiten regels/content.

## Functionele eisen
- Item bevat minimaal: prompt, lemma, grammaticale functie, target, scaffold, diagnostic, feedback.
- Engine onderscheidt homofone probleemparen op basis van functie (o.a. word/wordt, vind/vindt, gebeurt/gebeurd).
- Feedback geeft altijd: correct/incorrect + misconceptiecode + herstelhint.
- Elke unit eindigt met transferopdracht.

## Niet-functionele eisen
- Privacy-first opslag (minimale gegevens).
- Deterministisch gedrag (zelfde input => zelfde evaluatie).
- Contentvalidatie als vaste build/test stap.
- Toegankelijk op gangbare schoolapparaten.

## MVP acceptatie
1. Minimaal 2 complete units beschikbaar.
2. Misconceptietaxonomie actief gekoppeld aan feedback.
3. Leerlingflow en docentflow beide werkend.
4. Kernflows afgedekt met Playwright smoke tests.
