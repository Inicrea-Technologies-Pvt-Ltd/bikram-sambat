# Vendored Yorion Engine (build-time only)

Yorion Engine v0.4.0, Node.js WASM target.
Source: https://github.com/Yorion-io/yorion_engine/releases/tag/v0.4.0
Licence: MIT OR Apache-2.0

This copy exists ONLY to generate the calendar tables in
`packages/core/src/data.ts` and the golden test fixtures. It is a devDependency
of the build and is **never** shipped in any published npm package. The
published core is pure TypeScript with zero runtime dependencies.

Regenerate with: `pnpm gendata`
