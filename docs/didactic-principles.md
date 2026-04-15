# Didactische principes

## Verplicht didactisch patroon
1. **Functie eerst**: bepaal persoonsvorm/infinitief/voltooid deelwoord vóór spellingkeuze.
2. **Homofonen expliciet**: oefen contrasterende gevallen (word/wordt, vind/vindt, gebeurt/gebeurd).
3. **Zichtbare scaffolding**: toon redeneerstappen expliciet in vroege items.
4. **Diagnostische feedback**: label denkfout als misconceptie + geef korte herstelactie.
5. **Transferopbouw**: geïsoleerde oefening -> revisie -> korte schrijftaak.
6. **Fading**: ondersteuning neemt af per unitprogressie (Verkennen → Oefenen → Zelfstandig).

## Fasemodel en oefentypen
De leerlingflow is opgedeeld in drie actieve fasen + transfer. Per fase varieert de mate van ondersteuning en het type oefening:

- **Verkennen**: volledig gesupported (functie-stap + spellinghints zichtbaar). Geen repair.
- **Oefenen**: hints op aanvraag. RepairExercise verschijnt adaptief als remedie bij eerder gemaakte fouten op een misconceptiepatroon.
- **Zelfstandig**: geen hints standaard zichtbaar. RepairExercise verschijnt als robustheidscheck wanneer mastery al bewezen is (≥ 2 correcte pogingen op het patroon).

### Reparateur-modus (RepairExercise)
De reparateur-modus is didactisch waardevoller dan invullen vanuit scratch omdat het actief foutdetectie vereist — dezelfde vaardigheid als corrigeren in eigen schrijfwerk. De leerling:
1. Herkent of de gemarkeerde vorm klopt.
2. Herstelt de fout (geeft de juiste vorm).

Alleen misconceptiecodes waarbij de gegenereerde fout ondubbelzinnig en realistisch is, zijn geschikt (whitelist in `lib/repair-generator.ts`). Liever geen repair-item dan een matige variant.

### Bewijs-chips (metacognitieve redenering)
Na de spelling-stap wordt soms gevraagd: "Waarom klopt deze regel hier?" De leerling kiest uit twee redeneringen (correct vs. typische denkfout). Dit maakt de redenering zichtbaar zonder de flow zwaar te maken. Chips verschijnen alleen:
- na een fout antwoord (diagnostisch meest relevant), of
- bij de eerste keer dat een misconceptiepatroon in een unit voorkomt (onboarding).

De nauwkeurigheid van de redenering-keuze wordt apart bijgehouden (`proofCorrect`) en zichtbaar op de Groei-pagina.

### Twijfelduel (ContrastPairExercise)
Twee vergelijkbare zinnen naast elkaar. Na foute antwoorden toont de UI het onderscheid: welk woord maakt het verschil en waarom. Dit past bij de consultant-suggestie "kun jij een misleidend alternatief ontmaskeren?".

## Anti-patronen (afkeur)
- Alleen goed/fout zonder fouttype.
- Spellingkeuze zonder functiebepaling.
- Open schrijfopdracht zonder voorbereidende oefenset.
- UI-complexiteit die redeneerstappen verbergt.
- Repair-items voor niet-whitelisted codes (te ambigu of te kunstmatig).
- Bewijs-chips na elk item ongeacht correctheid (wordt een administratieve last).

## Minimale metadata per item
- leerdoel
- grammaticale functie
- homophonePair (of expliciet null)
- primaryMisconception
- scaffold-stappen
- transferkoppeling op unitniveau
