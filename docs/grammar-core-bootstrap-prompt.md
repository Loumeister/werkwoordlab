# Grammar Core Bootstrap Prompt

Gebruik onderstaande prompt om de nieuwe repo `grammar-core` in één gerichte run te bootstrapen.

```text
You are creating a new GitHub repository called `grammar-core`.

Goal
Bootstrap `grammar-core` as the shared canonical core for:
- Werkwoordlab
- ontledingstrainer

This repo must solve five problems:
1. shared didactic governance
2. shared content and sentence reuse
3. shared taxonomy governance
4. shared agent visibility for Claude and Codex
5. phased integration toward one grammar-and-verb-spelling platform

Important
Do NOT build a full runtime library yet.
Do NOT create a monorepo.
Do NOT overengineer the first version.
Start with a lightweight but canonical documentation/content/agent core.

Main outcome
Create the initial repo structure and first files so that:
- the repo is immediately useful as a source of truth
- both product repos can later sync it into their own context
- Claude and Codex agents can treat it as the canonical shared source

Create these files and folders:

grammar-core/
  README.md
  docs/
    werkwoordspellingsdidactiek-kaders.md
    grammar-platform-principles.md
    content-authoring-rules.md
    taxonomy-governance.md
    repo-sync-strategy.md
  agents/
    claude/
      didactic-architect.md
      content-expander.md
      taxonomy-evaluator-guardian.md
    codex/
      evidence-based-workwoordspellingsdidactiek.md
      shared-content-integration.md
  schemas/
    shared-sentence.schema.json
    parsing-metadata.schema.json
    spelling-metadata.schema.json
    shared-grammar-task.schema.json
    misconception.schema.json
  content/
    taxonomy/
      misconceptions.nl.json
    shared-sentences/
      README.md
      seed-unit-01.json
      seed-unit-02.json
  adapters/
    werkwoordlab.md
    ontledingstrainer.md

Detailed requirements

## 1. README.md
Write a real repo README that explains:
- why `grammar-core` exists
- which repos use it
- what is canonical here
- why local file visibility matters for Claude/Codex agents
- why git subtree is the recommended first sync strategy
- what phase 1 includes and excludes

## 2. docs/werkwoordspellingsdidactiek-kaders.md
This is the canonical didactic framework for Dutch verb spelling.
It must explicitly define:
- grammatical function before spelling choice
- explicit reasoning and visible scaffolding
- contrastdidactiek over loose sentence accumulation
- diagnostic feedback on recognizable error types
- scaffolding -> fading -> transfer
- functionally meaningful variation
- when a new misconception distinction is justified
- that proposals may not be called evidence-based without explicit principle linkage

## 3. docs/grammar-platform-principles.md
Explain the long-term integrated product principles:
- one shared grammar core
- multiple instructional modes on the same content
- parsing and spelling as one learning chain
- teacher insight should combine analysis and spelling bottlenecks

## 4. docs/content-authoring-rules.md
Define how shared sentence objects and tasks must be authored.
Include rules such as:
- no cosmetic variation without didactic value
- one sentence should preferably support multiple instructional uses
- contrast items have priority over bulk expansion
- metadata must be sufficient for both parsing and spelling reuse

## 5. docs/taxonomy-governance.md
Define taxonomy governance.
Include:
- when a new misconception code may be added
- relation between parsing misconceptions and spelling misconceptions
- requirement that new codes must imply a distinct recovery path or teacher signal
- product repos must not silently create canonical codes locally

## 6. docs/repo-sync-strategy.md
Explain:
- why agents need physically visible local files
- why package-only sharing is insufficient for governance and agent behavior
- why git subtree is the preferred first strategy
- how local wrappers in product repos should work

## 7. Claude agents
Create canonieke Claude agent files:
- `agents/claude/didactic-architect.md`
- `agents/claude/content-expander.md`
- `agents/claude/taxonomy-evaluator-guardian.md`

Each must:
- read the relevant docs first
- explicitly forbid unsupported “evidence-based” language
- require naming the supporting didactic principle
- remain concise and operational

## 8. Codex files
Create canonieke Codex files:
- `agents/codex/evidence-based-workwoordspellingsdidactiek.md`
- `agents/codex/shared-content-integration.md`

They must:
- treat this repo as canonical
- reinforce didactic framework use
- prevent vague content growth or taxonomy drift
- stay concise and implementation-oriented

## 9. Schemas
Create first-draft schemas for:
- shared sentence
- parsing metadata
- spelling metadata
- shared grammar task
- misconception

They do not need to be perfect, but they must be coherent and useful as a first canonical direction.

## 10. Taxonomy seed
Create `content/taxonomy/misconceptions.nl.json` with a small but meaningful initial set covering:
- at least a few verb-spelling misconception types
- room for future parsing misconception integration
- consistent structure with code/title/descriptions/remediation

## 11. Shared sentence seed
Create two small seed files:
- `seed-unit-01.json`
- `seed-unit-02.json`

Use a small number of strong sentences.
Prioritize:
- persoonsvorm tt
- inversie met jij
- homophone contrasts
- persoonsvorm vs voltooid deelwoord
- separable verbs where useful

These seed files should demonstrate the shared model, not exhaust the curriculum.

## 12. Adapter docs
Create:
- `adapters/werkwoordlab.md`
- `adapters/ontledingstrainer.md`

Explain how each product should consume the shared core and where local adaptation begins.

Constraints
- keep everything focused on phase 1
- avoid runtime implementation complexity
- avoid fake completeness
- prefer clarity and governance over cleverness
- keep writing operational and reusable by agents

Definition of done
This task is done only if:
- the repo structure exists
- the README is real and useful
- the didactic framework is explicit
- the agent files are operational
- the first schemas exist
- the first shared taxonomy exists
- the first shared sentence seeds exist
- the repo is ready to be synced into product repos later

Before finishing
- review the repo for duplication and contradictions
- make sure the docs, agents, schemas, and seed content tell one coherent story

Return
- created files
- short summary of what phase 1 now supports
- what the first sync step into Werkwoordlab and ontledingstrainer should be
```
