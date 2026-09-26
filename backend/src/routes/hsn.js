"use strict";

const express = require("express");

function createHsnRouter(gstService) {
  const router = express.Router();

  // GET /v1/hsn/search?q=rice
  router.get("/search", (req, res) => {
    const q = req.query.q;
    if (!q || !String(q).trim()) {
      return res.status(400).json({
        success: false,
        error: {
          code: "MISSING_PARAM",
          message: "Query parameter 'q' is required for search (e.g., /v1/hsn/search?q=rice)",
        },
      });
    }

    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 50, 1), 100);
    const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);

    const items = gstService.searchHsn(q, limit, offset);
    return res.status(200).json({
      success: true,
      data: items,
      meta: {
        query: String(q).trim(),
        count: items.length,
        limit,
        offset,
      },
    });
  });

  // GET /v1/hsn/chapters
  router.get("/chapters", (req, res) => {
    const chapters = gstService.getChapters();
    return res.status(200).json({
      success: true,
      data: chapters,
      meta: {
        count: chapters.length,
      },
    });
  });

  // GET /v1/hsn/chapters/:chapter
  router.get("/chapters/:chapter", (req, res) => {
    const chParam = req.params.chapter;
    const count = gstService.getChapterCount(chParam);
    if (count === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: `Chapter '${chParam}' not found. Valid chapters range from 01 to 99.`,
        },
      });
    }

    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 100, 1), 500);
    const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);
    const items = gstService.getByChapter(chParam, limit, offset);

    return res.status(200).json({
      success: true,
      data: items,
      meta: {
        chapter: String(chParam).padStart(2, "0").slice(0, 2),
        total_in_chapter: count,
        count: items.length,
        limit,
        offset,
      },
    });
  });

  // GET /v1/hsn/:code
  router.get("/:code", (req, res) => {
    const code = req.params.code;
    const item = gstService.getByCode(code);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: `HSN/SAC code '${code}' not found in official CBIC rate directory.`,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: item,
      meta: {
        code: item.code,
        type: item.type,
      },
    });
  });

  return router;
}

module.exports = { createHsnRouter };
