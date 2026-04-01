# Werkwoordspellingsdidactiek — kaders voor Werkwoordlab

## Status van dit document
Dit document legt de **evidence-informed didactische ontwerpregels** vast voor Werkwoordlab.

Het doel is niet om losse onderwijsclaims te verzamelen, maar om een klein aantal goed verdedigbare principes expliciet te maken, zodat Claude en Codex:
- inhoudelijk consistenter werken
- geen willekeurige of traditionele routines reproduceren
- nieuwe units, feedback en taxonomie alleen toevoegen als daar didactische grond voor is

## Hoe dit document gebruikt moet worden
Bij inhoudelijke wijzigingen aan:
- units
- zinnenbank
- misconceptietaxonomie
- evaluatorlogica
- learner feedback
- transferopdrachten

moet dit document samen gelezen worden met:
- `AGENTS.md`
- `docs/didactic-principles.md`
- `docs/content-schema.md`
- `docs/testing-strategy.md`
- `docs/content-expansion-roadmap.md`

---

## Leidende principes

### 1. Grammaticale functie vóór spellingkeuze
Werkwoordspelling moet in Werkwoordlab nooit primair als letterkeuzeprobleem worden aangeboden.

De leerling moet eerst bepalen:
- is dit een persoonsvorm?
- is dit een infinitief?
- is dit een voltooid deelwoord?
- is dit een bijvoeglijk gebruikt voltooid deelwoord?

Pas daarna komt de vraag welke vorm of regel van toepassing is.

**Ontwerpgevolg:**
- geen items die uitsluitend op klank, sjabloon of visuele herkenning oplosbaar zijn
- homofone gevallen krijgen expliciete functiecontrasten

### 2. Expliciete instructie en zichtbare redenering
Werkwoordspelling is geen puur impliciete vaardigheid. Het systeem moet de redeneerstappen zichtbaar maken, zeker in vroege items.

**Ontwerpgevolg:**
- vroege items hebben expliciete scaffold-stappen
- feedback herstelt de redenering, niet alleen het antwoord
- transfer komt pas na voldoende gerichte voorbereiding

### 3. Contrastdidactiek boven losse voorbeeldverzameling
Leerlingen leren sterker van betekenisvolle contrasten dan van veel losse, quasi-unieke voorbeeldzinnen.

Belangrijke contrasten zijn bijvoorbeeld:
- `word` / `wordt`
- `vind` / `vindt`
- `gebeurt` / `gebeurd`
- persoonsvorm versus infinitief
- persoonsvorm versus voltooid deelwoord
- werkwoordelijk versus bijvoeglijk gebruikt voltooid deelwoord

**Ontwerpgevolg:**
- liever minder items met sterk contrast dan veel oppervlakkig verschillende items
- elke uitbreiding moet aantonen welk onderscheid nieuw geoefend wordt

### 4. Diagnostische feedback op fouttype
Feedback moet gebaseerd zijn op een herkenbaar fouttype of misconceptie.

Minimaal onderscheid:
- functiefout
- regeltoepassingsfout
- vormspecifieke fout of uitzonderingsfout
- contextspecifieke fout, alleen als die didactisch aantoonbaar winst oplevert

**Ontwerpgevolg:**
- nieuwe taxonomy-codes alleen toevoegen als ze echt een nieuw, nuttig didactisch onderscheid markeren
- brede restcategorieën zijn toegestaan als tijdelijke fallback, maar niet als eindmodel

### 5. Van expliciete steun naar afbouw en transfer
Het doel is niet alleen correcte itemoplossing, maar overdraagbare toepassing in context.

**Ontwerpgevolg:**
- progression: geïsoleerde oefening -> contrast/revisie -> korte transfer
- ondersteuning mag afnemen, maar niet verdwijnen vóór het onderscheid voldoende is geoefend

### 6. Variatie moet didactisch functioneel zijn
Variatie in zinnen is alleen zinvol als die iets toevoegt aan het denkwerk.

Functionele variatie is bijvoorbeeld:
- inversie
- onderwerp op afstand
- andere woordvolgorde
- andere grammaticale functie bij vergelijkbare klank
- scheidbare werkwoorden
- onregelmatige vormen

Niet-functionele variatie is bijvoorbeeld:
- hetzelfde regeltype in veel bijna-identieke zinnen zonder nieuw onderscheid

---

## Ontwerpregels voor units en zinnenbank

### Regel 1
Elke unit moet een **beperkt aantal kernonderscheiden** centraal zetten.

### Regel 2
Elke nieuwe zin moet aantoonbaar bijdragen aan ten minste één van de volgende dingen:
- nieuw fouttype
- nieuwe context voor hetzelfde fouttype
- scherper contrast met een naburig fouttype
- betere transfer naar revisie of schrijven

### Regel 3
Nieuwe zinnen moeten natuurlijk Nederlands blijven voor onderbouw VO.

### Regel 4
Als een item zonder functiebepaling op te lossen is, is het didactisch zwak en moet het worden herzien.

### Regel 5
Een unit wordt pas verbreed naar een nieuw domein als de bestaande unitinhoud diep genoeg is.

---

## Ontwerpregels voor misconceptietaxonomie

### Wanneer een nieuwe code wél gerechtvaardigd is
Voeg een nieuwe misconception-code alleen toe als:
1. de fout systematisch terugkomt
2. de fout een ander herstelpad vraagt dan bestaande codes
3. docentinzichten inhoudelijk beter worden door dit onderscheid

### Wanneer een nieuwe code níét gerechtvaardigd is
Voeg geen nieuwe code toe als:
- het alleen een cosmetische variant van een bestaande fout is
- het onderscheid geen andere feedback of instructie oplevert
- het verschil alleen op zinsoppervlak zit

### Praktische vuistregel
Liever taxonomie:
- klein maar scherp

Dan:
- groot maar diffuus

---

## Ontwerpregels voor feedback

### Leerlingfeedback
Moet:
- kort zijn
- herstelgericht zijn
- de redenering opnieuw activeren

Moet niet:
- alleen het antwoord geven
- te veel metataal stapelen als dat het herstel belemmert

### Docentfeedback / labels
Mag preciezer zijn dan leerlingfeedback.

**Ontwerpgevolg:**
- `teacherDescription` en `learnerDescription` hoeven niet dezelfde detaillering te hebben

---

## Prioritering van grammaticale domeinen

### Eerst verdiepen
1. persoonsvorm tegenwoordige tijd
2. voltooid deelwoord

### Daarna toevoegen
3. persoonsvorm verleden tijd
4. infinitief
5. bijvoeglijk gebruikt voltooid deelwoord

### Nog niet prioriteren
- onvoltooid deelwoord als aparte kernunit

Reden:
- lagere opbrengst voor deze fase
- minder centraal in de belangrijkste onderbouwproblemen
- verhoogt complexiteit sneller dan de leerwinst op dit moment rechtvaardigt

---

## Evidence-based werkafspraak voor Claude en Codex
Bij inhoudelijke voorstellen moeten agents niet volstaan met: "dit lijkt logisch".

Ze moeten expliciet kunnen aangeven op welk ontwerpprincipe de keuze rust, bijvoorbeeld:
- functie eerst
- expliciete instructie
- contrastdidactiek
- diagnostische feedback
- afbouw en transfer
- functionele variatie

### Verplicht format bij didactische voorstellen
Noem altijd:
1. welk didactisch probleem wordt opgelost
2. welk onderscheid of fouttype wordt geoefend
3. welk principe uit dit document de keuze ondersteunt
4. welke test- of contentwijziging nodig is om dat te borgen

---

## Niet toegestaan
- claims als "evidence-based" zonder verwijzing naar een concreet principe uit dit document
- uitbreiding van content zonder aantoonbare didactische meerwaarde
- veel nieuwe items toevoegen zonder nieuwe contrastwerking
- taxonomie uitbreiden zonder beter herstelpad of betere docentinformatie
- open transfer zonder voldoende voorbereiding

---

## Definition of done voor didactisch werk
Didactisch werk is pas klaar als:
- de wijziging function-first blijft
- het fouttype of contrast expliciet is
- content, taxonomie en evaluator logisch op elkaar aansluiten
- feedback herstelgericht is
- tests of validatiechecks meebewegen waar nodig
