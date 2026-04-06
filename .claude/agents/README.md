# Werkwoordlab Claude Agents

Deze map bevat **project-level Claude Code agents** voor Werkwoordlab.

## Gebruik
Deze agents zijn bedoeld voor Claude Code / Claude-compatible agent runners die agentbestanden in `.claude/agents/` lezen.

Gebruik deze agents alleen binnen de grenzen van:
- `AGENTS.md` (verplicht leespunt voor alle agents)
- `docs/product-contract.md` (lokale adoptiecontract en source-of-truth regel)
- `docs/didactic-principles.md`
- `docs/content-schema.md`
- `docs/testing-strategy.md`
- `docs/content-expansion-roadmap.md`

## Shared canon locatie
Gedeelde grammar-core canon staat in `shared/grammar-core/`. Agents raadplegen dit alleen via de referenties in hun eigen "Always read first"-sectie.

Zie `shared/grammar-core/docs/agent-catalog.md` voor de canonieke shared agents in `grammar-core`.

## Beschikbare agents
- `01_didactic-architect.md`
- `02_content-expander.md`
- `03_taxonomy-evaluator-guardian.md`
- `04_learner-ui-accessibility.md`
- `05_test-hardener.md`
- `06_teacher-insights-analyst.md`

## Werkafspraak
- pak één duidelijke taak tegelijk op
- volg de leeshiërarchie uit `AGENTS.md`: `AGENTS.md` → relevante `shared/grammar-core` docs → `docs/product-contract.md` → lokale code/runtime → taakopdracht
- wijzig content, logica en tests in dezelfde run als ze inhoudelijk bij elkaar horen
- introduceer geen nieuwe productscope zonder expliciete opdracht
- laat grammaticale functie altijd vóór spellingkeuze komen
- voor feitelijk gedrag van de repo: lokale code/runtime heeft voorrang boven documentatie
