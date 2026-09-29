"use strict";

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { GstService } = require("./services/gst-service");
const { createHsnRouter } = require("./routes/hsn");
const { createSacRouter } = require("./routes/sac");

function createApp(options = {}) {
  const app = express();
  const gstService = options.gstService || new GstService(options);

  // Enable CORS for all origins (Public API Convention)
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "HEAD", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Accept"],
    })
  );

  // Rate Limiting (100 req / 15 mins default per CONVENTIONS.md)
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: options.rateLimitMax || 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: {
        code: "RATE_LIMITED",
        message: "Too many requests. Rate limit is 100 requests per 15 minutes.",
      },
    },
  });
  if (options.rateLimit !== false) {
    app.use(limiter);
  }

  app.use(express.json());

  // Root route & Health check: API Discovery per CONVENTIONS.md
  const handleHealth = (req, res) => {
    const stats = gstService.getStats();
    res.status(200).json({
      success: true,
      data: {
        name: "GST HSN/SAC Classification API",
        version: "1.0.0",
        description:
          "Free, keyless HSN and SAC classification search and chapter browsing from a community-maintained dataset. Tax rates are not supplied.",
        data_source: "https://github.com/QuantumByteStudios/gst-hsn-sac-codes",
        rate_data: "not_provided",
        source_date: gstService.meta ? gstService.meta.source_date : null,
        endpoints: [
          "GET /v1/freshness",
          "GET /v1/hsn/search?q=:query",
          "GET /v1/hsn/:code",
          "GET /v1/hsn/chapters",
          "GET /v1/hsn/chapters/:chapter",
          "GET /v1/sac/search?q=:query",
          "GET /v1/sac/:code",
        ],
        stats,
        status: "healthy",
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  };

  app.get("/", handleHealth);
  app.get("/health", handleHealth);

  // Snapshot provenance: which upstream commit and date the data comes from.
  app.get("/v1/freshness", (req, res) => {
    const data = gstService.getFreshness();
    if (!data) {
      return res.status(503).json({
        success: false,
        error: { code: "SNAPSHOT_UNAVAILABLE", message: "Dataset snapshot metadata is not available." },
      });
    }
    res.set("Cache-Control", "no-store").status(200).json({ success: true, data, meta: { timestamp: new Date().toISOString() } });
  });

  // Mount API routers
  app.use("/v1/hsn", createHsnRouter(gstService));
  app.use("/v1/sac", createSacRouter(gstService));

  // 404 Handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Route '${req.originalUrl}' not found. See GET / for available endpoints.`,
      },
    });
  });

  // Central Error Handler
  app.use((err, req, res, next) => {
    console.error("[app-error]", err);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "An internal server error occurred.",
      },
    });
  });

  return { app, gstService };
}

module.exports = { createApp };
