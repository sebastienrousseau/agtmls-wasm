<!-- SPDX-FileCopyrightText: 2026 Sebastien Rousseau -->
<!-- SPDX-License-Identifier: Apache-2.0 OR MIT -->

# Changelog

## [0.0.35] - 2026-11-17

**In lockstep with the AgtMLS family.** Every member of the family now
releases at one version, so agtmls-wasm moves from 0.0.6 to 0.0.35.

### Changed

- `agtmls-core` pinned at `=0.0.35` (was `=0.0.5`), built against
  agtmls-spec 0.0.35 (57 rules). No API change.

## [0.0.6] - 2026-11-15

### Changed

- `agtmls-core` is the crates.io release `0.0.5`, an exact version,
  instead of git revision `181d318`. The module now applies the core's
  matching since that revision: NFKC folding and invisible-character
  stripping, `applies_to` scoping, JSON escape decoding, the
  AGT-STEG-001 emoji context and the tool table.
- The rules are embedded as JSON, converted from the spec's TOML at build
  time, and loaded with `RuleSet::from_json_sources`. The module no
  longer links a TOML parser: it is 438 KB gzipped, against 502 KB with
  TOML rules on the new core (budget 500 KB). NFKC's Unicode tables
  account for most of the growth from 0.0.5's 419 KB.

## [0.0.5] - 2026-11-15

### Changed

- CI and the release workflow harden every runner (Harden-Runner, audit
  mode) and no checkout keeps the job's credentials.
- The first release published to npm by the release workflow through the
  trusted publisher, with npm provenance; 0.0.4 was published by hand.

## [0.0.4] - 2026-11-15

### Changed

- The npm package is `@sebastienrousseau/agtmls-wasm`. It was named
  `@agtmls/wasm`, but the `@agtmls` scope was never created on npm, so no
  release could publish (v0.0.3's publish failed with 404). Install it with
  `npm install @sebastienrousseau/agtmls-wasm`.

### Fixed

- CI and the release build pin wasm-pack v0.15.0. `jetli/wasm-pack-action`
  resolved "latest" through an unauthenticated GitHub API call and, when
  that was rate-limited, fell back to wasm-pack v0.9.1 (2020), whose bundled
  `wasm-opt` rejected the module ("Only 1 table definition allowed in MVP",
  then "Unknown option '--enable-multivalue'"), so builds passed or failed
  by run.

## [0.0.3] - 2026-11-15

### Changed

- `KEYS.asc` trusts a second maintainer signing key,
  `SHA256:kIOPAavp1TCEauTr1tTIN3cv+tSs6F9m/4lZjuM9tqk`, so release tags can
  be signed on either maintainer machine. Each key line now carries its
  fingerprint for out-of-band checks.
- **The MSRV is now Rust 1.89.0** (was 1.86.0), the floor shared by the
  portfolio's Rust repositories. `rust-version` and the README badge move
  together.

### Fixed

- The release build passes `wasm-opt` every feature rustc enables by default
  (reference types, sign extension and multivalue were missing). With
  `strip = true` the module carries no feature section, so `wasm-opt` parsed
  it as MVP and refused a second table, failing the macOS build whenever its
  build cache was warm.

## [0.0.2] - 2026-10-11

### Added

- `audit`, `audit_skill`, `skill_digest`, `normalise`, `rule_count`,
  `rule_ids` and `spec_version`, exported to JavaScript.
- Rules embedded at compile time from `agtmls-spec`. `build.rs` panics when
  the specification is absent rather than embedding an empty set.
- `rule_count()`, so a caller can assert the module is armed. Zero findings
  from a module with zero rules is not the same answer as zero findings from
  a module with nineteen, and only the caller can tell the difference.
- A size budget of 500 KB gzipped, enforced in CI. Currently 486 KB.
- Digest parity with `agtmls-core` and the Python implementation, proven
  against the `agtmls-spec` vectors including the byte-order trap where
  `SKILL.md` must sort before `reference.md`.
