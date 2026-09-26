"use strict";

const express = require("express");

function createSacRouter(gstService) {
  const router = express.Router();

  // GET /v1/sac/search?q=consulting
  router.get("/search", (req, res) => {
    const q = req.query.q;
    if (!q || !String(q).trim()) {
      return res.status(400).json({
        success: false,
        error: {
          code: "MISSING_PARAM",
          message: "Query parameter 'q' is required for SAC search (e.g., /v1/sac/search?q=legal)",
        },
      });
    }

    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 50, 1), 100);
    const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);

    const items = gstService.searchSac(q, limit, offset);
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

  // GET /v1/sac/:code
  router.get("/:code", (req, res) => {
    const code = req.params.code;
    const item = gstService.getByCode(code);
    if (!item || item.type !== "service") {
      return res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: `SAC code '${code}' not found in Services Accounting Codes directory.`,
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

module.exports = { createSacRouter };
