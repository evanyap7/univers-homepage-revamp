# Agent instructions

## Deterministic check (backpressure)
Before saying a task is done, or committing, run `node scripts/check.mjs` (JS syntax, locale-key
parity across `i18n/*.json`, every `data-i18n` key exists in `en.json`, no broken local
links/assets) and read the output. If it fails, fix the cause; never skip hooks (`--no-verify`) or
loosen the check to get green. Report the actual result.

When you add or rename a UI string, add the key to **all** locale files.

One-time per clone: `git config core.hooksPath .githooks` (runs the same check on every commit).
