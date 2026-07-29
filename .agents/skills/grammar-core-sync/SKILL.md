---
name: grammar-core-sync
description: Synchroniseer de git subtree shared/grammar-core/ veilig met de canonieke grammar-core-repository en valideer de productintegratie. Gebruik voor een subtree-pull of beoordeling van lokaal-versus-canoniek eigenaarschap; niet voor gewone dependency-updates.
---

# Grammar Core Sync

## Leesvolgorde

1. Lees `AGENTS.md` en `docs/product-contract.md`.
2. Lees `shared/grammar-core/docs/repo-sync-strategy.md`, `shared/grammar-core/docs/repo-scope-contracts.md` en `shared/grammar-core/plugins/grammar-core-toolkit/skills/grammar-core-sync/SKILL.md`.
3. Inspecteer de actuele gitstatus, remotes, huidige branch, remote default branches en subtreehistorie.

## Veilige procedure

1. Vereis een schone worktree. Stash, verwijder of overschrijf geen gebruikerswijzigingen; stop en rapporteer ze.
2. Controleer dat `shared/grammar-core/` bestaat, dat de canonieke remote klopt en dat lokale subtreebestanden niet handmatig zijn aangepast.
3. Detecteer de basisbranch van de productrepo en de default branch van de canonieke remote. Hardcode geen branchnaam op basis van aannames.
4. Maak vanaf de actuele basisbranch een gerichte syncbranch met `git switch -c`.
5. Voer de subtree-pull uit met expliciete prefix, gecontroleerde remote en gedetecteerde bronbranch:

   `git subtree pull --prefix=shared/grammar-core <canonical-remote> <canonical-branch> --squash`

6. Diagnoseer conflicten bestand voor bestand met `git status`, stage-informatie en beide bronversies. Gebruik nooit blanket `checkout --theirs`, verwijder geen lokale wijzigingen en forceer geen resolutie als eigenaarschap onduidelijk is.
7. Controleer vóór lokale referentie-updates dat de syncdiff alleen `shared/grammar-core/` raakt. Onderzoek iedere afwijking.
8. Werk alleen aantoonbaar verouderde lokale commit- of documentverwijzingen bij en houd die wijzigingen afzonderlijk herkenbaar.
9. Voer contentvalidatie en alle door de subtreewijziging geraakte lint-, unit-, build- en e2e-gates uit.
10. Rapporteer de diff en validatie. Commit, push of open geen PR tenzij de taak dat expliciet vraagt.

## Omgekeerde stroom

Plaats portable schemas, shared didactiek en governance eerst in een aparte `grammar-core`-branch en PR. Merge daar, synchroniseer daarna terug. Wijzig `shared/grammar-core/` nooit als lokale bron.

## Outputcontract

Rapporteer:

- productbasisbranch, canonieke remote en bronbranch;
- vorige en nieuwe subtree-identiteit voor zover verifieerbaar;
- conflicten en gekozen resolutie per bestand;
- lokale referentie-updates buiten de subtree;
- uitgevoerde productvalidaties;
- resterende risico's en eventuele PR-overdracht.

## Voltooiingscriteria

- De syncbron en branches zijn geverifieerd.
- De worktree bevat geen onverklaarde wijzigingen buiten de verwachte scope.
- Conflicten zijn inhoudelijk opgelost zonder blanket overschrijving.
- Relevante productchecks slagen of blokkades zijn reproduceerbaar vastgelegd.
