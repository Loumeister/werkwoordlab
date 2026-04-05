# Dataset onregelmatige werkwoorden

## Doel
Deze dataset legt de lijst uit het aangeleverde document vast als machineleesbare bron voor toekomstig gebruik in Werkwoordlab.

Bestand:
- `content/reference/irregular-verbs.nl.json`

Bijbehorend schema:
- `content/reference/irregular-verbs.schema.json`

## Wat wel en niet is gedaan

### Wel
- De lijst uit het document is brongetrouw getranscribeerd.
- Alternatieve vormen zijn als arrays opgeslagen, bijvoorbeeld `wilde/wou`.
- Hulpwerkwoorden zijn genormaliseerd naar `hebben` en `zijn`.
- Onpersoonlijke markeringen zoals `spijten` en `vriezen` zijn als notitie opgenomen.
- Een ontbrekende perfectumvorm in de bron, zoals bij `zullen`, is als lege array opgeslagen met notitie.

### Niet
- Er is nog geen didactische prioritering toegevoegd.
- Er zijn nog geen frequentieklassen toegevoegd.
- Er zijn nog geen foutpatronen of voorbeeldzinnen toegevoegd.
- De runtime is nog niet gekoppeld aan deze dataset.

## Dataconventies
- `pastSingular`: lijst met enkelvoudsvormen van het imperfectum.
- `pastPlural`: lijst met meervoudsvormen van het imperfectum.
- `perfectum`: lijst met voltooid-deelwoordsvormen zoals de bron die geeft.
- `auxiliaries`: genormaliseerde hulpwerkwoorden.
- `notes`: bronopmerkingen of normalisaties.

## Bekende brongebonden grenzen
Op basis van de beschikbare informatie is dit een zorgvuldige transcriptie van het aangeleverde document, niet automatisch een volledig taalkundig of didactisch eindmodel voor alle onregelmatige werkwoorden in het Nederlands. Voor leerlingoefeningen is later waarschijnlijk nog verrijking nodig met:
- didactische prioriteit
- frequentie
- foutgevoelige patronen
- voorbeeldzinnen
- koppeling aan oefentypen en feedbackcodes
