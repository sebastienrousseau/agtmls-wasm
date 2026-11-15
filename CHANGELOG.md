<!-- SPDX-FileCopyrightText: 2026 Sebastien Rousseau -->
<!-- SPDX-License-Identifier: Apache-2.0 OR MIT -->

# Changelog

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
