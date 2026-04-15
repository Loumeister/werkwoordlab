# Engine fase 0 — Content target-validatie

## Status
Voorstel — nog niet gestart.

## Doel
Valideer dat alle `target`-waarden in unit-JSON correct zijn door ze te toetsen aan de bestaande regelbestanden in `content/reference/`. Dit is de eerste stap richting een algoritmische werkwoordkern; er wordt nog **geen engine-code** geschreven.

## Waarom dit eerst
- Alle `target`-waarden (130+) zijn handmatig berekend. Er is geen mechanisme dat fouten opspoort.
- De regelbestanden (`stem-rules.nl.json`, `pv-tt-rules.nl.json`, `pv-vt-rules.nl.json`, `voltooid-deelwoord-rules.nl.json`, `irregular-verbs.nl.json`) bestaan al maar worden door geen runtime-code geconsumeerd.
- Contract tests op targets leveren directe waarde zonder bestaande code te wijzigen.
- Ze leggen het fundament voor een latere engine: je ontdekt welke regels werken en welke randgevallen extra aandacht nodig hebben.

## Scope

### Nieuw bestand
`tests/unit/target-validation.test.ts`

### Wat het test

**1. Stamafleiding — alle items**
Voor elk `ExerciseItem` en elke `ContrastSentence`:
- Leid de ruwe stam af uit `item.lemma` (trek `-en` af; bij `-iën` alleen `-n`).
- Leid de orthografische stam af via de stappen in `stem-rules.nl.json`.
- Sla het resultaat op; gebruik het in de volgende checks.

**2. PV TT targets — unit-01**
Voor elk item met `grammaticalFunction: "persoonsvorm"` en `tense: "tegenwoordige-tijd"`:
- Bereken de verwachte vorm op basis van `item.subject` en de regels in `pv-tt-rules.nl.json`:
  - `ik` → orthografische stam
  - `jij` zonder inversie → stam + `t` (tenzij stam al op `t` eindigt)
  - `jij` met inversie (herkenbaar aan prompt die begint met de werkwoordvorm of een ander inversiesignaal) → stam
  - `hij`/`zij`/`het` → stam + `t` (tenzij stam al op `t` eindigt)
  - `wij`/`jullie`/`zij` (meervoud) → infinitief (= lemma)
- Vergelijk met `item.target`.

**3. VD targets — unit-02**
Voor elk item met `grammaticalFunction: "voltooid-deelwoord"`:
- Kijk of `item.lemma` voorkomt in `irregular-verbs.nl.json`.
  - Zo ja: verwacht dat `item.target` overeenkomt met de `perfectum`-waarde.
  - Zo nee: bereken de reguliere VD-vorm:
    - Bepaal prefix-gedrag via `prefix-behaviour.nl.json`
    - Bepaal `d` of `t` via ruwe stam ('t kofschip)
    - Vorm: `[ge-prefix] + orthografische stam + d/t`
    - Geen dubbel `d` of `t` aan het einde
- Vergelijk met `item.target`.

**4. PV VT targets — unit-03**
Voor elk item met `tense: "verleden-tijd"`:
- Kijk of `item.lemma` in `irregular-verbs.nl.json` staat.
  - Zo ja: vergelijk `item.target` met `pastSingular`/`pastPlural` (op basis van `item.subject`).
  - Zo nee: bereken de zwakke VT-vorm:
    - Bepaal `t`-werkwoord of `d`-werkwoord op basis van ruwe stam
    - Enkelvoud: ortho stam + `te`/`de`
    - Meervoud: ortho stam + `ten`/`den`
- Vergelijk met `item.target`.

**5. Infinitief targets — unit-04**
Voor elk item met `grammaticalFunction: "infinitief"`:
- Verwacht `item.target === item.lemma`.

**6. OD targets — unit-06**
Voor elk item met `grammaticalFunction: "onvoltooid-deelwoord"` en `type: "fill-in"`:
- Verwacht `item.target` === orthografische stam + `end` (of `ende` bij attributief gebruik).

**7. Bijvoeglijk VD targets — unit-05**
Voor elk `fill-in` item met `grammaticalFunction: "bijvoeglijk-deelwoord"`:
- Verwacht dat `item.target` gelijk is aan de VD-vorm (eventueel + `e`).

### Wat het NIET test
- Classify-items (daar is het target een functieklasse, geen werkwoordvorm).
- Contrast-pair items die een functieclassificatie testen (HOMOPHONE_FUNCTION_CONFUSION).
- Scaffold-teksten, feedback, of misconceptiecodes (dat doen bestaande tests al).

## Implementatie-aanwijzingen

### Hulpfuncties
Schrijf kleine, pure hulpfuncties bovenin het testbestand (of in een apart `tests/helpers/stem-utils.ts`). Dit zijn **geen** engine-functies — het zijn testhelpers.

```typescript
// Voorbeeld signaturen
function deriveRoughStem(lemma: string): string
function deriveOrthographicStem(lemma: string): string
function isTVerb(roughStem: string): boolean
function computePvTt(lemma: string, subject: string): string
function computeVd(lemma: string, irregulars: IrregularVerb[]): string
function computePvVt(lemma: string, subject: string, irregulars: IrregularVerb[]): string
```

### Inversie-detectie
Jij-inversie is herkenbaar als de prompt begint met de werkwoordvorm (vraagzin) of als er een vooropgeplaatste constituent vóór de PV staat met `jij` erachter. In de huidige content is dit altijd te herkennen doordat het correcte antwoord (target) de stam zonder `t` is terwijl het subject `jij` is. Dit is een edge case — als de detectie lastig is, mag je de inversie-items expliciet taggen via een allowlist van item-ids en daar een opmerking bij plaatsen.

### Prefix-detectie
Gebruik `prefix-behaviour.nl.json` om te bepalen of een werkwoord scheidbaar of onscheidbaar is. Check of het lemma begint met een van de bekende prefixen. Bij dual-behaviour prefixen: als het lemma in `irregular-verbs.nl.json` staat, gebruik de lexicale override.

### Klinkerverdubbeling
De regel is eenvoudig: als de ruwe stam eindigt op **één medeklinker na een enkele klinker**, dan is die klinker lang en moet hij verdubbeld worden in de orthografische stam. Bij **meer dan één medeklinker** na de klinker is de klinker kort en wordt niet verdubbeld.

Concreet: check of de ruwe stam matcht op het patroon `[enkele klinker][enkele medeklinker]$`:
- `mak` → `a` + `k` → lang → `maak`
- `lop` → `o` + `p` → lang → `loop`
- `werk` → `e` + `rk` → kort → `werk`
- `pakk` → `a` + `kk` → kort → `pak` (na DROP_DOUBLE_CONSONANT)

Uitzonderingen: leenwoorden als `deleten` (ruwe stam `delet`, patroon zegt "lang" maar correct is `delet`). Houd een korte allowlist bij voor deze gevallen.

### Foutmeldingen
Geef bij een falende assertion duidelijke context:

```typescript
expect(
  computed,
  `${unit.id}/${item.id}: lemma="${item.lemma}" subject="${item.subject}" ` +
  `expected target="${item.target}" but computed="${computed}"`
).toBe(item.target);
```

## Niet wijzigen
- `lib/evaluator.ts` — geen wijzigingen
- `lib/content.ts` — geen wijzigingen
- `content/units/*.json` — geen wijzigingen (als een target fout blijkt, meld het als finding maar fix het niet in deze PR)
- `content/reference/*.json` — geen wijzigingen

## Acceptatiecriteria
1. `tests/unit/target-validation.test.ts` bestaat en runt zonder fouten via `npm test`.
2. Elk van de 6 units wordt geraakt door minstens één testblok.
3. Hulpfuncties voor stamafleiding zijn geïsoleerd, puur en herbruikbaar.
4. Alle testblokken hebben heldere foutmeldingen met lemma, subject, verwacht en berekend.
5. Geen bestaande code of content is gewijzigd.
6. Als er content-fouten worden ontdekt (target klopt niet met berekening), worden die gerapporteerd als `// FINDING:` comments in het testbestand, niet stilzwijgend gecorrigeerd.

## Risico's
- **Klinkerverdubbeling bij leenwoorden.** De regel (één medeklinker na enkele klinker = lang) werkt voor vrijwel alle Nederlandse werkwoorden, maar niet voor leenwoorden als `deleten` (stam `delet` → patroon zegt "lang" → `*deleet`). In de huidige content (61 lemma's) zijn er nauwelijks leenwoorden, dus het risico is klein. Een korte allowlist volstaat.
- **Prefix-detectie** kan false positives geven bij werkwoorden die toevallig beginnen met een prefix-achtige letterreeks (bijv. `beantwoorden` vs `bederven`). In de huidige content (61 lemma's) is dit handmatig te verifiëren.
- **Inversie-detectie** is niet triviaal op basis van de prompt alleen. Een allowlist van bekende inversie-items is acceptabel voor deze fase.

## Relatie tot volgende fases
Na deze PR:
- Fase 1: Extraheer de hulpfuncties naar `lib/engine/stems.ts` als eerste echte engine-module.
- Fase 2: Bouw `lib/engine/conjugate.ts` die alle regelpaden combineert.
- Fase 3: Vervang de testhelpers door imports uit de engine; de tests worden dan automatisch engine-contracttests.
