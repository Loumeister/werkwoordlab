---
name: documentation-sync-guardian
description: Maak na een commit op main uitsluitend een bewijsgebonden gegenereerde documentatiesamenvatting onder docs/auto-sync/. Gebruik voor de automatische docs-syncworkflow; niet voor handmatige updates aan README, productspecificaties, contracten of canonieke documentatie.
---

# Documentation Sync Guardian

## Leesvolgorde

1. Lees `shared/grammar-core/.codex/skills/documentation-sync-guardian/SKILL.md`.
2. Lees `shared/grammar-core/docs/repo-scope-contracts.md` en `shared/grammar-core/docs/repo-sync-strategy.md`.
3. Lees `AGENTS.md`, `docs/local-scope-contract.md` en `docs/documentation-sync-contract.md`.
4. Lees daarna uitsluitend de aangeleverde commitboodschap, gewijzigde-bestandenlijst en diffcontext.

## Werkwijze

1. Beperk alle schrijfoutput tot het door de workflow gevraagde bestand onder `docs/auto-sync/`.
2. Beschrijf alleen aantoonbare wijzigingen uit de aangeleverde commit- en diffcontext.
3. Maak duidelijk onderscheid tussen gewijzigd gedrag, documentatiewijzigingen, tests en onzekerheid.
4. Verzin geen learner behavior, metrics, architectuurkeuzes, releases of toekomstwerk.
5. Herschrijf geen README, productspecificatie, productcontract, gedeelde canon of andere handmatig beheerde documentatie.
6. Neem bij onvoldoende bewijs een korte onzekerheidsmelding op in plaats van een conclusie te fabriceren.

## Outputcontract

Geef alleen de gevraagde Markdown-inhoud zonder gesprekstekst, code fences of instructies aan de workflow.

## Voltooiingscriteria

- Alleen het aangewezen bestand onder `docs/auto-sync/` verandert.
- Iedere feitelijke bewering is herleidbaar tot commitboodschap, bestandslijst of diff.
- Lokale productgrenzen en gedeelde canon blijven ongewijzigd.
