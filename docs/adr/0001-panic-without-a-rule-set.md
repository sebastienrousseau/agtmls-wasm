<!-- SPDX-FileCopyrightText: 2026 Sebastien Rousseau -->
<!-- SPDX-License-Identifier: MIT OR Apache-2.0 -->

# ADR 0001 — The build panics when the specification is absent

**Status:** accepted · **Date:** 2026-09-19

## Context

Rules are embedded at compile time from an `agtmls-spec` checkout. A build can
run without one: the crate compiles, `wasm-pack` succeeds, the module loads,
every exported function returns.

It returns an empty array for every input.

## Decision

`build.rs` panics when no specification can be found. It does not embed an
empty rule set, and there is no fallback.

## Consequences

**Good.** The failure happens where it is cheap and unambiguous — a build
error naming the missing checkout — rather than in a browser tab reporting a
malicious skill as clean. `rule_count()` is exported so a caller can assert
the module is armed, and the CI smoke script refuses to pass on a module with
zero rules.

**Costly.** The crate cannot be built from a bare `cargo build` in a fresh
clone; it needs a sibling checkout or `AGTMLS_SPEC`. That is friction every
contributor meets on their first build, and the panic message says exactly
what to do about it.

**Why it is worth the friction.** Zero findings from an unarmed analyzer is
indistinguishable, to its caller, from zero findings from a clean input.
Every other failure mode in this crate announces itself; that one does not.

## Alternatives rejected

**Vendor a copy of the rules.** Removes the friction and reintroduces drift:
a vendored rule set is one that will silently fall behind, which is the defect
the shared specification exists to prevent.

**Fall back to an empty set with a runtime warning.** A warning on a channel
nobody reads is indistinguishable from no warning at all.
