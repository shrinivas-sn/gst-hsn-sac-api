"use strict";

// Verifies backend/data against backend/data/meta.json, and (with --upstream)
// checks whether the upstream dataset has published a newer data commit.
// Exit codes: 0 in sync, 1 integrity failure or network error, 2 upstream drift.

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const DATA_DIR = path.join(__dirname, "..", "data");

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

// Offline: recompute every file hash and row count and compare with meta.json.
function checkSnapshot(dataDir = DATA_DIR) {
  const errors = [];
  const meta = JSON.parse(fs.readFileSync(path.join(dataDir, "meta.json"), "utf8"));
  const counts = {};
  for (const [name, info] of Object.entries(meta.files)) {
    const buffer = fs.readFileSync(path.join(dataDir, name));
    if (sha256(buffer) !== info.sha256) errors.push(`${name}: SHA-256 differs from meta.json`);
    if (buffer.length !== info.bytes) errors.push(`${name}: byte size differs from meta.json`);
    counts[name] = JSON.parse(buffer.toString("utf8")).length;
  }
  const expected = {
    "hsn_codes.json": meta.row_counts.hsn,
    "sac_codes.json": meta.row_counts.sac,
    "chapters.json": meta.row_counts.chapters,
  };
  for (const [name, count] of Object.entries(expected)) {
    if (counts[name] !== count) errors.push(`${name}: row count ${counts[name]} differs from meta.json (${count})`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.source_date)) errors.push("meta.json: source_date is not YYYY-MM-DD");
  return { errors, meta };
}

// Online: newest upstream commit that touched data/ versus the pinned one.
async function checkUpstream(meta, fetchImpl = fetch) {
  const url = `https://api.github.com/repos/${meta.source_repo}/commits?path=data&per_page=1`;
  const headers = { Accept: "application/vnd.github+json", "User-Agent": "gst-hsn-sac-api-snapshot-check" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetchImpl(url, { headers });
  if (!res.ok) throw new Error(`GitHub API answered ${res.status} for ${url}`);
  const [latest] = await res.json();
  if (!latest) throw new Error("Upstream returned no commits for data/");
  return {
    pinned: meta.source_commit,
    latest: latest.sha,
    latest_date: latest.commit.committer.date,
    drift: latest.sha !== meta.source_commit,
  };
}

async function main() {
  const { errors, meta } = checkSnapshot();
  const result = { source_commit: meta.source_commit, source_date: meta.source_date, errors };
  if (process.argv.includes("--upstream")) {
    try {
      result.upstream = await checkUpstream(meta);
    } catch (err) {
      errors.push(err.message);
    }
  }
  console.log(JSON.stringify(result, null, 2));
  if (errors.length) process.exitCode = 1;
  else if (result.upstream && result.upstream.drift) process.exitCode = 2;
}

if (require.main === module) main();

module.exports = { checkSnapshot, checkUpstream };
