# Domain documentation

Use the repository's domain documentation when investigating terminology or design decisions.

## Before domain work

- Read `GLOSSARY.md` at the repository root when it exists.
- Read the ADRs under `docs/adr/` that apply to the area you're working in.

If the glossary or ADR directory is absent, continue without treating that as a problem or proposing new documents. Create domain documentation only when a term or design decision has actually been resolved through the `/domain-modeling` workflow, reached via `/grill-with-docs` or `/improve-codebase-architecture`.

## Use established terminology

Use terms as defined in `GLOSSARY.md` when naming domain concepts in issues, proposals, hypotheses, or tests. Avoid synonyms the glossary explicitly rejects.

If a needed concept is not defined, verify that it is genuinely part of the project's domain before noting a glossary gap for `/domain-modeling`.

## Surface ADR conflicts

If your findings or proposal conflict with an existing ADR, name the ADR and explain why it may need to be reconsidered. Do not silently override it.
