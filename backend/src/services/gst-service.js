"use strict";

const fs = require("node:fs");
const path = require("node:path");

class GstService {
  constructor(options = {}) {
    const dataDir = options.dataDir || path.resolve(__dirname, "..", "..", "data");
    const hsnPath = path.join(dataDir, "hsn_codes.json");
    const sacPath = path.join(dataDir, "sac_codes.json");
    const chaptersPath = path.join(dataDir, "chapters.json");

    this.hsnList = fs.existsSync(hsnPath) ? JSON.parse(fs.readFileSync(hsnPath, "utf8")) : [];
    this.sacList = fs.existsSync(sacPath) ? JSON.parse(fs.readFileSync(sacPath, "utf8")) : [];
    this.chapters = fs.existsSync(chaptersPath) ? JSON.parse(fs.readFileSync(chaptersPath, "utf8")) : [];

    this.byCode = new Map();
    this.byChapter = new Map();

    this._index();
  }

  _index() {
    for (const item of this.hsnList) {
      const code = String(item.code || "").trim();
      if (!code) continue;
      this.byCode.set(code, item);

      const ch = code.slice(0, 2);
      if (!this.byChapter.has(ch)) {
        this.byChapter.set(ch, []);
      }
      this.byChapter.get(ch).push(item);
    }

    for (const item of this.sacList) {
      const code = String(item.code || "").trim();
      if (!code) continue;
      this.byCode.set(code, item);

      const ch = code.slice(0, 2);
      if (!this.byChapter.has(ch)) {
        this.byChapter.set(ch, []);
      }
      this.byChapter.get(ch).push(item);
    }
  }

  getByCode(code) {
    if (!code) return null;
    const clean = String(code).trim().replace(/\s+/g, "");
    return this.byCode.get(clean) || null;
  }

  getChapters() {
    return this.chapters;
  }

  getByChapter(chapterCode, limit = 100, offset = 0) {
    if (!chapterCode) return [];
    const clean = String(chapterCode).trim();
    if (clean.length > 2) return [];
    const ch = clean.padStart(2, "0");
    const list = this.byChapter.get(ch) || [];
    return list.slice(offset, offset + limit);
  }

  getChapterCount(chapterCode) {
    if (!chapterCode) return 0;
    const clean = String(chapterCode).trim();
    if (clean.length > 2) return 0;
    const ch = clean.padStart(2, "0");
    return (this.byChapter.get(ch) || []).length;
  }

  searchHsn(query, limit = 50, offset = 0) {
    if (!query) return [];
    const tokens = String(query).toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!tokens.length) return [];

    const results = [];
    for (const item of this.hsnList) {
      const text = `${item.code} ${item.description || ""} ${item.heading_description || ""}`.toLowerCase();
      const matches = tokens.every((token) => text.includes(token));
      if (matches) {
        results.push(item);
      }
    }
    return results.slice(offset, offset + limit);
  }

  searchSac(query, limit = 50, offset = 0) {
    if (!query) return [];
    const tokens = String(query).toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!tokens.length) return [];

    const results = [];
    for (const item of this.sacList) {
      const text = `${item.code} ${item.description || ""} ${item.heading_description || ""} ${item.group_description || ""}`.toLowerCase();
      const matches = tokens.every((token) => text.includes(token));
      if (matches) {
        results.push(item);
      }
    }
    return results.slice(offset, offset + limit);
  }

  searchAll(query, limit = 50, offset = 0) {
    if (!query) return [];
    const tokens = String(query).toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!tokens.length) return [];

    const results = [];
    const combined = [...this.hsnList, ...this.sacList];
    for (const item of combined) {
      const text = `${item.code} ${item.description || ""}`.toLowerCase();
      const matches = tokens.every((token) => text.includes(token));
      if (matches) {
        results.push(item);
      }
    }
    return results.slice(offset, offset + limit);
  }

  getStats() {
    return {
      total_hsn_codes: this.hsnList.length,
      total_sac_codes: this.sacList.length,
      total_chapters: this.chapters.length,
    };
  }
}

module.exports = { GstService };
