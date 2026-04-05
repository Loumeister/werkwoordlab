# Referentielaag en gebruik in de repo

## Doel
Deze documentatie beschrijft hoe de nieuwe regel- en referentiebestanden in `content/reference/` gebruikt moeten worden door de rest van Werkwoordlab.

De referentielaag is bedoeld als **canonieke lokale bron voor deterministische werkwoordspellingslogica**. De bestanden zijn er niet als losse naslag, maar als invoer voor:
- evaluatorlogica
- contentauthoring
- misconceptiemapping
- testvalidatie
- latere docentinzichten op regelniveau

## Belangrijk onderscheid
- `docs/*.md` legt de didactische en inhoudelijke beslisregels uit voor mensen.
- `content/reference/*.json` legt dezelfde regels machineleesbaar vast voor code, tests en contenttools.

## Status
- Deze bestanden veranderen nog geen runtimegedrag.
- Nieuwe runtimecode moet **de JSON-bestanden** gebruiken en niet de Markdownbestanden parseren.
- Totdat de evaluator hierop is aangesloten, blijven bestaande unittargets leidend.

## Precedentievolgorde voor toekomstige implementatie
Gebruik deze volgorde zodra de evaluator wordt uitgebreid:
1. **lexicale override** uit een specifieke werkwoordenlijst of itemdata
2. **prefixgedrag** voor scheidbaar/onscheidbaar gedrag
3. **onregelmatig patroon** of sterke-werkwoordenpatroon
4. **reguliere hoofdregel** uit `pv-tt`, `pv-vt` of `voltooid-deelwoord`
5. **fallback = geen automatische beslissing** als de data onvoldoende zijn

## Bestanden en beoogd gebruik

### `content/reference/stem-rules.nl.json`
Gebruik voor:
- afleiding van orthografische stam voor TT-items
- uitlegstappen in scaffolds
- misconcepties rond stamvorming

Niet gebruiken voor:
- automatische keuze tussen `-de/-te` zonder onderliggende stamcontrole

### `content/reference/pv-tt-rules.nl.json`
Gebruik voor:
- evaluatie van tegenwoordige tijd persoonsvorm
- generatie van contrastitems zoals `vind/vindt`
- mapping van TT-misconcepties

### `content/reference/pv-vt-rules.nl.json`
Gebruik voor:
- evaluatie van verleden tijd persoonsvorm
- deterministische keuze tussen `-de/-te` en `-den/-ten`
- waarschuwing dat `v/z`-werkwoorden d-werkwoorden blijven

### `content/reference/voltooid-deelwoord-rules.nl.json`
Gebruik voor:
- evaluatie van voltooid deelwoord
- `ge-`-gedrag
- suffixkeuze `d/t`
- scheidbaar/onscheidbaar gedrag in participiumvorming

### `content/reference/prefix-behaviour.nl.json`
Gebruik voor:
- prefixcontrole vóór participiumvorming
- classificatie-items over scheidbaar/onscheidbaar gebruik
- inhoudelijke uitleg aan contentmakers

### `content/reference/auxiliary-patterns.nl.json`
Gebruik voor:
- keuze tussen `hebben`, `zijn` of beide
- feedback op hulpwerkwoordfouten
- verrijking van onregelmatige werkwoorden en voorbeeldzinnen

### `content/reference/strong-verb-patterns.nl.json`
Gebruik voor:
- clustering van onregelmatige werkwoorden
- leerlijnopbouw van eenvoudig naar lastig
- spreiding van patroonfamilies in nieuwe units

## Hoe contentmakers deze laag moeten gebruiken
Bij het maken van een nieuw item:
1. bepaal eerst de grammaticale functie
2. kies daarna het juiste regelbestand
3. controleer of een lexicale override nodig is
4. schrijf scaffoldstappen die dezelfde beslisvolgorde volgen
5. koppel een misconceptiecode aan de verwachte denkfout

## Hoe de evaluator deze laag later moet gebruiken
De evaluator moet uiteindelijk:
- per item het relevante regelsysteem kiezen
- eerst lexicale uitzonderingen controleren
- daarna pas de generieke regel toepassen
- niet meerdere regelsystemen tegelijk laten concurreren zonder prioriteit

## Hoe tests deze laag moeten gebruiken
Minimaal toevoegen zodra runtimekoppeling start:
- JSON-validatietests per referentiebestand
- invarianttests voor vereiste velden
- regressietests voor bekende randgevallen
- contenttests die controleren of items alleen bestaande regelcodes en patrooncodes gebruiken

## Werkafspraak
Nieuwe units of nieuwe evaluatieregels mogen pas op deze referentielaag steunen als:
- het regelbestand bestaat
- de didactische uitleg in `docs/` bestaat
- de benodigde misconcepties benoemd zijn
- er tests zijn toegevoegd voor de relevante randgevallen
