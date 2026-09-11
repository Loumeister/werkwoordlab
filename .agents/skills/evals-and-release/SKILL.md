---
name: evals-and-release
description: Voer de finale Werkwoordlab-validatie uit, triageer falende kwaliteitsgates en geef een onderbouwd ship- of block-advies. Gebruik voor release candidates en afgeronde multi-area wijzigingen; niet als implementatieworkflow tijdens actief bouwwerk.
---

# Evals and Release

## Leesvolgorde

1. Lees `docs/product-contract.md`, `docs/testing-strategy.md` en `docs/release-checklist.md`.
2. Lees `docs/product-spec.md` en de contractdocumenten die door de wijziging zijn geraakt.
3. Inspecteer `package.json`, de actuele testconfiguratie en de volledige diff.

## Werkwijze

1. Bepaal de gewijzigde oppervlakken: content, evaluator/feedback, learner UI, teacher insights, architectuur of documentatie.
2. Koppel elk oppervlak aan zijn verplichte gate uit `docs/testing-strategy.md`.
3. Voer voor een volledige releasekandidaat minimaal `npm run lint`, `npm test`, `npm run build` en `npm run test:e2e` uit. Noteer expliciet wanneer een gate door omgeving of ontbrekende afhankelijkheid niet uitvoerbaar is.
4. Controleer de releasechecklist ook inhoudelijk: deterministische learner loop, diagnostische feedback, valide units, transfer, anonieme toegang, privacy en geaggregeerde docentinzichten.
5. Classificeer bevindingen als P0, P1 of P2 en geef per bevinding reproduceerbaar bewijs. Behandel falende content-, evaluator- en kernflowtests als releaseblokkerend.
6. Geef alleen `ship` wanneer alle verplichte gates aantoonbaar slagen en geen P0/P1 openstaat. Een overgeslagen gate is geen pass.

## Outputcontract

Lever een compact releaseverslag met:

- commit/diff-scope;
- per commando de status `pass`, `fail` of `not-run` en relevante foutregel;
- checkliststatus per geraakt productcontract;
- open P0/P1/P2-risico's;
- eindoordeel `ship` of `block` met reden.

## Voltooiingscriteria

- Alle vereiste gates zijn uitgevoerd of expliciet als `not-run` verantwoord.
- Elke blokkade bevat bewijs en een eigenaarbaar vervolg.
- Het eindoordeel volgt rechtstreeks uit de vastgelegde resultaten.
