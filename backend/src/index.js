"use strict";

const { createApp } = require("./app");

const PORT = parseInt(process.env.PORT || "3000", 10);
const { app } = createApp();

if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`[gst-hsn-sac-api] listening on port ${PORT}`);
  });

  process.on("SIGTERM", () => {
    server.close(() => {
      console.log("[gst-hsn-sac-api] terminated");
    });
  });
}

module.exports = app;
