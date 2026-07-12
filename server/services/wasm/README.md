# Vendored WebAssembly grammars

`tree-sitter-c.wasm` — the Tree-sitter grammar for C, used by
`server/services/c-analysis.ts` to parse student C code server-side (structure
checks + value injection for the lesson judge). Loaded at runtime via
`web-tree-sitter` (pure JS + WASM, no native build step — VPS/Nix safe).

- Source grammar: [tree-sitter/tree-sitter-c](https://github.com/tree-sitter/tree-sitter-c) — MIT License.
- Prebuilt binary extracted from the `tree-sitter-wasms` npm package (MIT) and
  vendored here so the grammar ships with the repo (prod runs `tsx server/...`
  straight from the working tree — no build copy needed).

Committed as a binary on purpose; do not regenerate unless bumping the grammar.
