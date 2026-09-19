<!-- SPDX-FileCopyrightText: 2026 Sebastien Rousseau -->
<!-- SPDX-License-Identifier: Apache-2.0 OR MIT -->

# Changelog

## Unreleased

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
