"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { createApp } = require("../src/app");

let server;
let baseUrl;

test.before(async () => {
  const { app } = createApp({ rateLimit: false });
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

test.after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("GET / returns 200 with health and API info", async () => {
  const res = await fetch(`${baseUrl}/`);
  assert.equal(res.status, 200);
  const json = await res.json();

  assert.equal(json.success, true);
  assert.equal(json.data.name, "GST HSN/SAC Code & Tax Rate Lookup API");
  assert.equal(json.data.status, "healthy");
  assert.ok(Array.isArray(json.data.endpoints));
  assert.ok(json.data.endpoints.length >= 5);
  assert.ok(json.data.stats.total_hsn_codes > 16000);
  assert.ok(json.data.stats.total_sac_codes > 500);
});

test("CORS headers are present on all routes", async () => {
  const res = await fetch(`${baseUrl}/`, { method: "OPTIONS" });
  assert.equal(res.headers.get("access-control-allow-origin"), "*");
});

test("GET /v1/hsn/search requires q parameter", async () => {
  const res = await fetch(`${baseUrl}/v1/hsn/search`);
  assert.equal(res.status, 400);
  const json = await res.json();

  assert.equal(json.success, false);
  assert.equal(json.error.code, "MISSING_PARAM");
  assert.ok(json.error.message.includes("Query parameter 'q' is required"));
});

test("GET /v1/hsn/search returns matching items", async () => {
  const res = await fetch(`${baseUrl}/v1/hsn/search?q=horses`);
  assert.equal(res.status, 200);
  const json = await res.json();

  assert.equal(json.success, true);
  assert.ok(Array.isArray(json.data));
  assert.ok(json.data.length > 0);
  assert.equal(json.meta.query, "horses");
  assert.ok(json.data.some((d) => d.code === "0101"));
});

test("GET /v1/hsn/:code returns exact match", async () => {
  const res = await fetch(`${baseUrl}/v1/hsn/0101`);
  assert.equal(res.status, 200);
  const json = await res.json();

  assert.equal(json.success, true);
  assert.equal(json.data.code, "0101");
  assert.equal(json.data.type, "goods");
  assert.ok(json.data.description.toLowerCase().includes("horses"));
});

test("GET /v1/hsn/:code returns 404 for unknown code", async () => {
  const res = await fetch(`${baseUrl}/v1/hsn/00000000`);
  assert.equal(res.status, 404);
  const json = await res.json();

  assert.equal(json.success, false);
  assert.equal(json.error.code, "NOT_FOUND");
});

test("GET /v1/hsn/chapters returns chapter list", async () => {
  const res = await fetch(`${baseUrl}/v1/hsn/chapters`);
  assert.equal(res.status, 200);
  const json = await res.json();

  assert.equal(json.success, true);
  assert.ok(Array.isArray(json.data));
  assert.ok(json.data.length >= 90);
  const ch10 = json.data.find((c) => c.chapter === "10");
  assert.ok(ch10);
  assert.equal(ch10.name, "Cereals");
});

test("GET /v1/hsn/chapters/:chapter returns items in chapter", async () => {
  const res = await fetch(`${baseUrl}/v1/hsn/chapters/10`);
  assert.equal(res.status, 200);
  const json = await res.json();

  assert.equal(json.success, true);
  assert.ok(Array.isArray(json.data));
  assert.ok(json.data.length > 0);
  assert.equal(json.meta.chapter, "10");
  assert.ok(json.data.every((item) => item.code.startsWith("10")));
});

test("GET /v1/hsn/chapters/:chapter returns 404 for nonexistent chapter", async () => {
  const res = await fetch(`${baseUrl}/v1/hsn/chapters/999`);
  assert.equal(res.status, 404);
  const json = await res.json();

  assert.equal(json.success, false);
  assert.equal(json.error.code, "NOT_FOUND");
});

test("GET /v1/sac/search requires q parameter", async () => {
  const res = await fetch(`${baseUrl}/v1/sac/search`);
  assert.equal(res.status, 400);
  const json = await res.json();

  assert.equal(json.success, false);
  assert.equal(json.error.code, "MISSING_PARAM");
});

test("GET /v1/sac/search returns matching services", async () => {
  const res = await fetch(`${baseUrl}/v1/sac/search?q=construction`);
  assert.equal(res.status, 200);
  const json = await res.json();

  assert.equal(json.success, true);
  assert.ok(Array.isArray(json.data));
  assert.ok(json.data.length > 0);
  assert.ok(json.data.some((d) => d.code === "995411"));
});

test("GET /v1/sac/:code returns exact service match", async () => {
  const res = await fetch(`${baseUrl}/v1/sac/995411`);
  assert.equal(res.status, 200);
  const json = await res.json();

  assert.equal(json.success, true);
  assert.equal(json.data.code, "995411");
  assert.equal(json.data.type, "service");
  assert.ok(json.data.description.toLowerCase().includes("construction"));
});

test("GET /v1/nonexistent returns 404", async () => {
  const res = await fetch(`${baseUrl}/v1/nonexistent`);
  assert.equal(res.status, 404);
  const json = await res.json();

  assert.equal(json.success, false);
  assert.equal(json.error.code, "NOT_FOUND");
});
