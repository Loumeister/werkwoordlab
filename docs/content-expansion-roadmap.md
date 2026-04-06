# Content Expansion Roadmap — Werkwoordlab

## Doel van dit document
Dit document is de **uitvoerbare inhoudelijke roadmap** voor de volgende ontwikkelfase van Werkwoordlab.

Gebruik dit document als leidraad voor Claude en Codex bij werk aan:
- uitbreiding van de zinnendatabase
- nieuwe units voor werkwoordspelling
- uitbreiding van taxonomie en evaluatielogica
- didactische kwaliteitsbewaking

Dit document **vervangt AGENTS.md niet**. Volg altijd ook:
- `AGENTS.md`
- `docs/didactic-principles.md`
- `docs/content-schema.md`
- `docs/testing-strategy.md`
- `docs/backlog.md`

---

## Hoofdbesluit
Werkwoordlab wordt niet alleen een trainer voor losse vervoegingen, maar een **diagnostische leeromgeving voor werkwoordspelling**.

Dat betekent:
1. eerst grammaticale functie bepalen
2. dan regel of vormtype bepalen
3. dan pas spelling kiezen
4. feedback altijd koppelen aan een specifiek fouttype of misconceptie

Nieuwe content moet deze volgorde blijven ondersteunen.

---

## Prioriteitenvolgorde

### Eerst
1. **Bestaande units verdiepen**
   - `unit-01-pv-tt`
   - `unit-02-voltooid-deelwoord`
2. **Meer contrastitems toevoegen binnen bestaande domeinen**
3. **Pas daarna nieuwe grammaticale domeinen toevoegen**

### Daarna
Voeg in deze volgorde nieuwe kernunits toe:
1. `verleden tijd persoonsvorm`
2. `infinitief`
3. `bijvoeglijk gebruikt voltooid deelwoord`
4. `onvoltooid deelwoord`

### Nog niet prioriteren
- brede analytics-uitbreidingen
- extra UI-modules buiten de bestaande learner/docent-structuur

---

## Fase A — bestaande units uitbreiden

### A1. Unit 01: Persoonsvorm tegenwoordige tijd
Huidige unit is bruikbaar als MVP, maar nog te smal.

#### Doel
Uitbreiden naar **15–20 sterke items** met betere dekking van fouttypen en contextvariatie.

#### Toe te voegen itemcategorieën
1. **extra ik-vorm zonder -t**
   - niet alleen basisvolgorde
   - ook tijdsbepaling vooraan
   - ook langere zinnen
2. **jij zonder inversie**
   - stam+t in neutrale context
3. **jij met inversie**
   - vraagzinnen
   - zinnen met vooropgeplaatste constituent
   - expliciet gekoppeld aan `PV_JIJ_INVERSION_FALSE_T`
4. **hij/zij/het**
   - meer derde persoon enkelvoud
   - meer afstand tussen onderwerp en persoonsvorm
5. **homofone drukpunten**
   - `vind/vindt`
   - `word/wordt`
   - eventueel later: `bedoel/bedoelt`, `antwoord/antwoordt`
6. **onderwerp op afstand**
   - niet alleen korte SVO-zinnen
7. **meer revisie-items**
   - korte correctiezinnen
   - expliciete vergelijking van goede/foute vorm

#### Didactische eis
Nieuwe items mogen niet alleen extra voorbeelden zijn; ze moeten telkens een **onderscheidend fouttype of contextverschil** toevoegen.

---

### A2. Unit 02: Voltooid deelwoord
Ook deze unit moet naar **15–20 sterke items**.

#### Doel
Betere dekking van:
- functieonderscheid `persoonsvorm` vs `voltooid deelwoord`
- `-d/-t`
- onregelmatige voltooid deelwoorden
- scheidbare werkwoorden
- homofone drukpunten zoals `gebeurt/gebeurd`

#### Toe te voegen itemcategorieën
1. **meer functiecontrast**
   - hetzelfde lemma in `pv` en `vd`
2. **meer regelmatige -d/-t-items**
   - verschillende stamuitgangen
3. **meer onregelmatige voltooid deelwoorden**
   - vergelijkbaar met `gesloten`
4. **meer scheidbare werkwoorden**
   - vergelijkbaar met `uitgesteld`
5. **meer revisie en korte contextitems**
   - niet alleen losse invulzinnen
6. **meer uitspraak-misleidende gevallen**
   - waar klank niet helpt en functie of regel nodig is

#### Didactische eis
Minstens een deel van de nieuwe items moet expliciet testen of leerlingen:
- eerst de grammaticale functie bepalen
- daarna pas de spelling kiezen

---

## Fase B — nieuwe kernunits toevoegen

### B1. Nieuwe unit: Verleden tijd persoonsvorm

#### Waarom
Verleden tijd is een kernonderdeel van werkwoordspelling en sluit logisch aan op stam, klank en regeltoepassing.

#### Voorlopige unittitel
`unit-03-pv-vt`

**Implementatie-notitie**
- Vergeet bij het toevoegen van deze unit niet om de unit óók te registreren in de content‑registry (`lib/content.ts`):
  - importeer de nieuwe unitmodule
  - voeg de unit toe aan de `units`‑lijst (of aan de dynamische loader zodra daarop is overgestapt), anders verschijnt de unit niet in de app/tests
#### Leerdoelen
- ik herken de persoonsvorm in de verleden tijd
- ik bepaal enkelvoud of meervoud
- ik kies de juiste verleden tijdsvorm op basis van stam en klank

#### Kernfouttypen / nieuwe taxonomiecodes
Voeg alleen toe als echt nodig, maar verwacht minimaal categorieën voor:
- verkeerde keuze enkelvoud/meervoud
- verkeerde toepassing van `-te/-de`
- verwarring tussen persoonsvorm en voltooid deelwoord

#### Itemcategorieën
- enkelvoud verleden tijd
- meervoud verleden tijd
- regelmatige werkwoorden
- lastige klankgevallen
- functiecontrast met voltooid deelwoord
- revisie-items in context

---

### B2. Nieuwe unit: Infinitief

#### Waarom
Infinitief is essentieel voor functiebepaling. Leerlingen moeten het onderscheid kunnen maken tussen:
- persoonsvorm
- infinitief
- voltooid deelwoord

#### Voorlopige unittitel
`unit-04-infinitief`

#### Leerdoelen
- ik herken een infinitief in een zin
- ik onderscheid infinitief van persoonsvorm en voltooid deelwoord
- ik gebruik de juiste vorm in context

#### Itemcategorieën
- infinitief na hulpwerkwoord of modaal werkwoord
- infinitief na `te`
- contrast met persoonsvorm
- contrast met voltooid deelwoord
- korte correctie-items

#### Didactische eis
Deze unit moet sterk draaien om **functiebepaling**, niet alleen vormherkenning.

---

### B3. Nieuwe unit: Bijvoeglijk gebruikt voltooid deelwoord

#### Waarom
Dit domein is didactisch waardevol omdat het functiedenken verder aanscherpt.

#### Voorlopige unittitel
`unit-05-bijvoeglijk-vd`

#### Schemavereisten — verplicht bij implementatie
Het huidige schema kent alleen `voltooid-deelwoord` als `grammaticalFunction`-waarde voor werkwoordelijke functies. Voor items in deze unit is een uitbreiding nodig:

- Voeg `bijvoeglijk-deelwoord` toe als toegestane waarde voor `grammaticalFunction` (zie `docs/content-schema.md`).
- Gebruik `type: classify` voor items die leerlingen laten kiezen tussen `werkwoordelijk` en `bijvoeglijk` gebruik; voeg dan het verplichte veld `classifyOptions: ["werkwoordelijk", "bijvoeglijk"]` toe.
- Werk de evaluator bij zodat `grammaticalFunction: "bijvoeglijk-deelwoord"` en `type: classify` correct worden geïnterpreteerd voordat content wordt toegevoegd.
- Voeg bijbehorende taxonomiecodes toe (bijv. `VD_ADJ_FUNCTION_CONFUSION`) voor de misconceptie dat leerlingen bijvoeglijk en werkwoordelijk gebruik verwarren.

#### Leerdoelen
- ik herken wanneer een voltooid deelwoord bijvoeglijk gebruikt is
- ik onderscheid bijvoeglijk gebruikt voltooid deelwoord van voltooid deelwoord in werkwoordelijke functie
- ik kies de juiste spelling in context

#### Itemcategorieën
- attributief gebruikte vormen (`type: fill-in`, `grammaticalFunction: bijvoeglijk-deelwoord`)
- contrast tussen werkwoordelijk en bijvoeglijk gebruik (`type: classify`, `classifyOptions: ["werkwoordelijk", "bijvoeglijk"]`)
- contextzinnen met homofone of bijna-homofone druk
- revisie-items in korte tekst

#### Didactische eis
Deze unit moet expliciet laten zien dat **dezelfde of bijna dezelfde vorm grammaticaal anders kan functioneren**.

---

### B4. Nieuwe unit: Onvoltooid deelwoord

#### Waarom
Het onvoltooid deelwoord (`-end`-vorm) verschijnt als bijvoeglijke bepaling en in deelwoordgroepen. Leerlingen verwarren het regelmatig met persoonsvorm of voltooid deelwoord.

#### Voorlopige unittitel
`unit-06-onvoltooid-deelwoord`

#### Schemavereisten — verplicht bij implementatie
- Voeg `onvoltooid-deelwoord` toe als toegestane waarde voor `grammaticalFunction` (zie `docs/content-schema.md`).
- Gebruik `type: classify` voor items die leerlingen laten kiezen tussen `persoonsvorm`, `voltooid-deelwoord` en `onvoltooid-deelwoord`.
- Werk de evaluator bij zodat `grammaticalFunction: "onvoltooid-deelwoord"` correct wordt geïnterpreteerd voordat content wordt toegevoegd.
- Voeg bijbehorende taxonomiecodes toe voor verwisseling met persoonsvorm of voltooid deelwoord.

#### Leerdoelen
- ik herken de `-end`-vorm als onvoltooid deelwoord
- ik onderscheid onvoltooid deelwoord van persoonsvorm en voltooid deelwoord
- ik gebruik de juiste vorm in attributieve en deelwoordgroep-context

#### Itemcategorieën
- attributief gebruik van onvoltooid deelwoord (`type: fill-in`, `grammaticalFunction: onvoltooid-deelwoord`)
- contrast met persoonsvorm (`type: classify`)
- contrast met voltooid deelwoord (`type: classify`)
- deelwoordgroepen in context
- revisie-items

#### Didactische eis
Focus op **functiebepaling**: leerlingen moeten beredeneren waarom een vorm een onvoltooid deelwoord is en niet een persoonsvorm.

---

## Fase C — voorlopig niet oppakken

Zie de sectie **Nog niet prioriteren** in [Prioriteitenvolgorde](#prioriteitenvolgorde) hierboven.

---

## Kwaliteitseisen voor alle nieuwe content

### Verplicht per item
- natuurlijk Nederlands
- één duidelijk leerdoel
- grammaticale functie expliciet modelleerbaar
- één beoogd correct antwoordpad
- correcte `primaryMisconception`
- passende scaffold-stappen
- bruikbare feedbackhint

### Niet toegestaan
- dubbelzinnige prompts
- trucjes zonder grammaticale redenering
- open productietaken zonder voorbereidende oefening
- nieuwe taxonomiecodes zonder duidelijke didactische noodzaak
- items die alleen oppervlakkig lijken te verschillen maar inhoudelijk hetzelfde testen

### Richtlijn per unit
- streef naar **20–25 items** voor de kernunits (unit-01 en unit-02 zijn op april 2026 beide op 25 items)
- met bewuste mix van:
  - basisitems
  - contrastitems (homofonen, functiecontrast)
  - revisie-items
  - transfertaak

---

## Evaluator- en taxonomie-uitbreiding
Nieuwe content mag niet los van logica worden toegevoegd.

### Bij nieuwe domeinen altijd controleren
1. kan `getExerciseMode` of evaluatorlogica het itemtype correct verwerken?
2. bestaan alle benodigde misconceptiecodes al?
3. moet `getMisconceptionLabel` of andere mapping worden uitgebreid?
4. blijven feedback en teacher insights logisch met de nieuwe codes?

### Regel
Geen content toevoegen die de evaluator nog niet goed kan interpreteren.

---

## Tests die mee moeten groeien
Bij elke uitbreidingsslag moeten tests worden bijgewerkt.

### Minimaal
- content validation
- taxonomy reference checks
- evaluator tests voor nieuwe domeinen
- unit tests voor nieuwe fouttypen
- learner-flow smoke alleen aanpassen als de UI echt verandert

### Extra bij nieuwe units
- minstens één evaluator-test per nieuw hoofdregeltype
- minstens één content-validatietest die de nieuwe unit raakt

---

## Uitvoerbare takenlijst

### Taakgroep 1 — huidige units verdiepen ✅ (afgerond april 2026, beide passes)

**Eerste uitbreidingspass** (naar 14 items elk):
- [x] voeg 6–8 sterke nieuwe items toe aan `unit-01-pv-tt` (+bedoel/bedoelt, +meervoud wij/ze, +het-onderwerp, +jij-zonder-inversie met vind/vindt)
- [x] voeg 6–8 sterke nieuwe items toe aan `unit-02-voltooid-deelwoord` (+bedoelt/bedoeld, +gereden, +ingepakt, +gewerkt, +geschreven)
- [x] controleer of bestaande taxonomiecodes voldoende onderscheid maken
- [x] voeg alleen waar nodig nieuwe taxonomiecodes toe (`PV_MEERVOUD_T_ADDITION` toegevoegd)
- [x] werk contentvalidatietests bij (twee nieuwe tests in `domain-logic.test.ts`)

**Tweede uitbreidingspass** (naar ~25 items elk, ~50 totaal):
- [x] voeg 11 sterke nieuwe items toe aan `unit-01-pv-tt` (nu 25 items): Tier-1 beloven/vertrouwen, Tier-2 beweren/veranderen/antwoorden, Tier-3 verhuizen/bewonderen, cross-unit werken/studeren
- [x] voeg 11 sterke nieuwe items toe aan `unit-02-voltooid-deelwoord` (nu 25 items): volledige HOMOPHONE_FUNCTION_CONFUSION-serie voor beloven, vertrouwen, beweren, veranderen, verhuizen, studeren
- [x] contrast-architectuur versterkt: Tier-1 clusters (beloven, vertrouwen) volledig aanwezig in beide units
- [x] Tier-2 clusters (beweren, veranderen) volledig aanwezig in beide units
- [x] cross-unit lexicale paren werkend: werken, studeren, duren, beloven, vertrouwen, beweren, veranderen verschijnen nu in beide units
- [x] twee nieuwe evaluatortests voor Tier-1 homofoonparen in `domain-logic.test.ts`

### Taakgroep 2 — nieuwe unit verleden tijd
- [ ] ontwerp leerdoelen en misconceptiecategorieën
- [ ] maak eerste versie van `unit-03-pv-vt`
- [ ] voeg evaluator/tests toe waar nodig
- [ ] voeg transferopdracht toe

### Taakgroep 3 — nieuwe unit infinitief
- [ ] ontwerp leerdoelen en misconceptiecategorieën
- [ ] maak eerste versie van `unit-04-infinitief`
- [ ] toets functieonderscheid expliciet
- [ ] voeg evaluator/tests toe waar nodig

### Taakgroep 4 — nieuwe unit bijvoeglijk gebruikt voltooid deelwoord
- [ ] voeg `bijvoeglijk-deelwoord` toe aan `grammaticalFunction`-enum in `docs/content-schema.md`
- [ ] voeg `classifyOptions`-veld toe aan schema voor `type: classify`-items
- [ ] voeg taxonomiecode(s) toe voor bijvoeglijk/werkwoordelijk verwarring
- [ ] werk evaluatorlogica bij voor nieuwe `grammaticalFunction`-waarde en `classify`-type
- [ ] ontwerp leerdoelen en misconceptiecategorieën
- [ ] maak eerste versie van `unit-05-bijvoeglijk-vd`
- [ ] voeg contrastitems toe met werkwoordelijke functie
- [ ] voeg evaluator/tests toe waar nodig

### Taakgroep 5 — nieuwe unit onvoltooid deelwoord
- [ ] voeg `onvoltooid-deelwoord` toe aan `grammaticalFunction`-enum in `docs/content-schema.md`
- [ ] voeg taxonomiecode(s) toe voor verwarring met persoonsvorm/voltooid deelwoord
- [ ] werk evaluatorlogica bij voor nieuwe `grammaticalFunction`-waarde
- [ ] ontwerp leerdoelen en misconceptiecategorieën
- [ ] maak eerste versie van `unit-06-onvoltooid-deelwoord`
- [ ] voeg classify-contrastitems toe (persoonsvorm/voltooid-deelwoord/onvoltooid-deelwoord)
- [ ] voeg evaluator/tests toe waar nodig

---

## Werkafspraak voor Claude en Codex
Bij werk aan deze roadmap:
1. pak **één taakgroep tegelijk** op
2. wijzig content, taxonomie en tests in dezelfde run als dat nodig is
3. verbreed pas naar een nieuw domein als de huidige uitbreidingsslag inhoudelijk stabiel is
4. geef in elke output expliciet aan:
   - welke unit(s) zijn uitgebreid
   - welke misconcepties zijn toegevoegd of gewijzigd
   - welke tests zijn aangepast
   - welke didactische winst dat oplevert

---

## Definition of done voor deze roadmapfase
Deze roadmapfase is pas klaar als:
- unit 01 en unit 02 inhoudelijk duidelijk zijn verdiept
- er minstens één nieuwe kernunit is toegevoegd op basis van deze volgorde
- content, taxonomie en evaluator consistent blijven
- testdekking is bijgewerkt
- de app didactisch duidelijk meer biedt dan een simpele werkwoorden- of vervoegingentrainer
