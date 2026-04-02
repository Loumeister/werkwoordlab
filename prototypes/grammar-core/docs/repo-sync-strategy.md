# Repo Sync Strategy

## Problem
Claude and Codex agents can only reliably work from files that are physically visible in the current repository context.

That means cross-repo governance cannot depend on one repo invisibly reading the docs and agents of another.

## Recommended strategy
Use `grammar-core` as the canonical shared repo and mirror it into each product repo via **git subtree**.

## Why package-only is insufficient
Package dependencies may share runtime code, but they do not reliably solve:
- agent visibility
- didactic governance visibility
- taxonomy governance visibility
- canonical docs visibility

## Why subtree is preferred now
Subtree gives:
- physically visible shared files in each repo
- reviewable sync diffs
- minimal infrastructure overhead
- no immediate monorepo requirement

## Local wrapper rule
Product repos may keep local Claude/Codex files, but they must be wrappers that:
1. read `shared/grammar-core/` first
2. apply local repo constraints second
3. apply the task prompt last

## Responsibility rule
Canonical shared changes start in `grammar-core`.
Product repos then sync the updated shared subtree into their own context.
