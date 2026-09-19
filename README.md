<!-- SPDX-FileCopyrightText: 2026 Sebastien Rousseau -->
<!-- SPDX-License-Identifier: Apache-2.0 OR MIT -->

<h1 align="center">agtmls-wasm</h1>

<p align="center">
  Audit agent skills in a browser, with nothing leaving the page.
</p>

---

## Why this exists

A skill is often the most sensitive thing a team has written down: internal
process, architecture, the shape of their systems. Asking someone to upload one
to a scanning service to find out whether it is safe is a poor trade, and it is
the trade every hosted analyzer asks for.

Compiled to WebAssembly, the analyzer runs in the page. **"We cannot see your
skill because it never reaches us"** is a stronger claim than any privacy
policy, and it is the one this package exists to make true.

It also removes the platform matrix from anything that embeds the analyzer:
[`agtmls-action`](https://github.com/sebastienrousseau/agtmls-action) runs this
under Node with no Rust toolchain, no compilation and no per-OS builds.

## Install

```bash
npm install @agtmls/wasm
```

## Use

```js
import init, { audit, audit_skill, skill_digest, rule_count } from "@agtmls/wasm";

await init();

// A module with no rules reports zero findings, which is indistinguishable
// from a clean input. Assert it is armed before you trust a clean result.
if (rule_count() === 0) throw new Error("analyzer has no rules");

audit("SKILL.md", "Nothing here︁︂ at all.\n");
// → [{ rule: "AGT-STEG-001", severity: "CRITICAL", line: 1, … }]

audit_skill({
  "SKILL.md": "---\nname: x\ndescription: y\nallowed-tools: Bash\n---\n",
  "metadata.json": '{"safety_policy":{"executes_commands":false}}',
});
// → [{ rule: "AGT-CAP-001", … }]  frontmatter grants what the policy denies

skill_digest({ "SKILL.md": "# S\n", "reference.md": "ref\n" });
// → "sha256:765b2f9a…"  identical to the CLI, per agtmls-spec 3.1
```

| Export | Returns |
| :--- | :--- |
| `audit(name, content)` | Findings for one document |
| `audit_skill(files)` | Findings for a whole skill, including the structural rules |
| `skill_digest(files)` | Content address, per `agtmls-spec` 3.1 |
| `normalise(content)` | Whitespace-collapsed text, to show *why* a split payload matched |
| `rule_count()` / `rule_ids()` / `spec_version()` | What this module is armed with |

## What it detects

Rules are **data**, loaded from
[`agtmls-spec`](https://github.com/sebastienrousseau/agtmls-spec) and embedded
at compile time, so a browser build enforces exactly what the CLI does.

| Class | Detects |
| :--- | :--- |
| `AGT-STEG` | Invisible code points — zero-width, bidirectional overrides, **variation selectors**, soft hyphens, the Unicode tag block |
| `AGT-INJ` | Instruction overrides and jailbreak phrasing |
| `AGT-EXEC` | Pipe-to-shell execution, credential access, reverse shells |
| `AGT-EXFIL` | Markdown image pingbacks that leak context on render |
| `AGT-CAP` | Frontmatter granting a tool the skill's own `safety_policy` denies |
| `AGT-POLICY` | A declared policy contradicted by the prose, or absent entirely |

Matching happens against the **whitespace-normalised** document, so a payload
split across a newline does not walk past a rule.

## Guarantees

- **The build fails if the specification is absent.** `build.rs` panics rather
  than embedding an empty rule set: a module reporting zero findings because it
  has no rules is indistinguishable, to its caller, from one that found nothing.
- **No network, no telemetry, no filesystem.** The module is given bytes and
  returns findings. `audit` takes content rather than a path for exactly that
  reason.
- `#![forbid(unsafe_code)]`.
- **Size budget: 500 KB gzipped**, enforced in CI.

## Relationship to the rest

```
agtmls-spec     rules + conformance corpus, the normative source
   └── agtmls-core   the Rust engine
          └── agtmls-wasm   this package
                 └── agtmls-action   GitHub Action, vendors this module
```

`agtmls-core` is pinned by revision until it is published to crates.io, at
which point this pins a version. A branch dependency would not be
reproducible, and reproducibility is the claim.

## Licence

Apache-2.0 OR MIT.
