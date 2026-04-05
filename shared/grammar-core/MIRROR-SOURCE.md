# MIRROR-SOURCE — shared/grammar-core

## Status
This directory is a **manually bootstrapped snapshot** of `Loumeister/grammar-core`.

**This is NOT a git subtree.** It was populated by fetching individual files from the upstream repository at a pinned commit because `git subtree add` was blocked by the local git proxy at integration time.

## Upstream details

| Field | Value |
|---|---|
| Repository | `Loumeister/grammar-core` |
| Pinned commit | `4a4cfeceac2fe4f37cf81eb395446acd977460a7` |
| Bootstrap method | Manual file fetch from GitHub raw content at pinned commit |
| Bootstrap date | 2026-04-05 |

## Replacing this snapshot with a true git subtree

When git access to `Loumeister/grammar-core` is available, replace this snapshot with a proper subtree:

```bash
# Remove the manually bootstrapped files
git rm -r shared/grammar-core/
git commit -m "Remove manual grammar-core snapshot before subtree add"

# Add as a proper git subtree
git subtree add --prefix=shared/grammar-core https://github.com/Loumeister/grammar-core.git main --squash
```

## Updating after true subtree is in place

```bash
git subtree pull --prefix=shared/grammar-core https://github.com/Loumeister/grammar-core.git main --squash
```

## Documenting intentional local divergences

If werkwoordlab intentionally diverges from shared canon in any way:
- document the divergence in `docs/product-contract.md`
- do NOT silently modify files in `shared/grammar-core/`
- files in `shared/grammar-core/` must remain identical to upstream

## Scope of this snapshot

Files included in this snapshot are the governance docs needed for downstream alignment. Not all grammar-core files are included. Notably excluded:
- `docs/ontleedlab-master-operating-map.md` (Ontleedlab-specific, not relevant to werkwoordlab)
- `.claude/agents/` and `.codex/skills/` (tool-native agent files — these can be added in a future pass if needed)
- `schemas/`, `content/` (shared schemas and sentence seeds — not yet operationally consumed by werkwoordlab)
