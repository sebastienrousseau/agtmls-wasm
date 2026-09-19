#!/usr/bin/env node
// SPDX-FileCopyrightText: 2026 Sebastien Rousseau
// SPDX-License-Identifier: MIT OR Apache-2.0

/**
 * Name the generated package for npm.
 *
 * wasm-pack writes a package.json named after the crate (`agtmls-wasm`). The
 * published package is `@agtmls/wasm`, and the generated file carries neither
 * the scope, the repository link, nor the licence files -- all of which npm
 * provenance and anyone auditing the package will look for.
 */

import { copyFile, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const PKG = path.join(ROOT, "pkg");

const cargo = await readFile(path.join(ROOT, "Cargo.toml"), "utf8");
const version = cargo.match(/^version = "(.*?)"/m)?.[1];
if (!version) {
  console.error("FAIL: no version in Cargo.toml");
  process.exit(1);
}

const manifest = JSON.parse(await readFile(path.join(PKG, "package.json"), "utf8"));
Object.assign(manifest, {
  name: "@agtmls/wasm",
  version,
  description:
    "Audit agent skills in a browser, with nothing leaving the page. WebAssembly bindings for the AgtMLS engine.",
  license: "Apache-2.0 OR MIT",
  repository: { type: "git", url: "git+https://github.com/sebastienrousseau/agtmls-wasm.git" },
  homepage: "https://github.com/sebastienrousseau/agtmls-wasm",
  bugs: { url: "https://github.com/sebastienrousseau/agtmls-wasm/issues" },
  keywords: ["agent", "skills", "security", "audit", "wasm", "prompt-injection", "sarif"],
  author: "Sebastien Rousseau <sebastian.rousseau@gmail.com>",
  sideEffects: ["./snippets/*"],
});
manifest.files = [...new Set([...(manifest.files ?? []), "README.md", "LICENSE-APACHE", "LICENSE-MIT"])];

await writeFile(path.join(PKG, "package.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
for (const file of ["README.md", "LICENSE-APACHE", "LICENSE-MIT"]) {
  await copyFile(path.join(ROOT, file), path.join(PKG, file));
}
console.log(`OK: pkg/package.json is @agtmls/wasm@${version}`);
