---
title: "Free HSN Code Lookup in Node.js Without Paid GSP Gateways"
slug: "free-hsn-code-lookup-api-nodejs"
meta_description: "Query India's 16,825 HSN tariff codes and slab rates in Node.js and React using a keyless, zero-dependency public REST API."
keywords: "free hsn code api, gst hsn search nodejs, hsn code lookup api india, cbic hsn codes, gst rate lookup api"
author: "Open Source Companion Engineering"
published_date: "2026-09-27"
canonical_url: "https://gst-hsn-sac.osc.internal/guides/free-hsn-code-lookup-api-nodejs"
schema_type: "TechArticle"
status: "archived-inaccurate-draft"
---

> Archived draft: this article describes tax-rate fields and examples the API does not provide. Do not publish or use it for implementation. See the current [README](../../README.md) and [public guide](../../frontend/src/content/guidesData.js).

# Free HSN Code Lookup in Node.js Without Paid GSP Gateways

Building invoicing software or e-commerce checkouts for Indian businesses requires classifying products against the Central Board of Indirect Taxes and Customs (CBIC) Harmonized System of Nomenclature (HSN). Most commercial GST Suvidha Providers (GSPs) put basic code search behind monthly subscriptions, credit card forms, and opaque API authentication tokens.

The GST classification table is public domain data under Section 52(1)(q) of the Indian Copyright Act 1957. A search service for this data does not need private tokens or monthly subscriptions.

Here is how to query all 16,825 official HSN codes with live rate lookup in Node.js.

## The HSN Numbering Structure

Indian HSN codes follow an 8-digit hierarchical tree:

1. **Chapter (Digits 1–2):** Broad commodity group (e.g., Chapter 09 covers Coffee, Tea, Mate, and Spices).
2. **Heading (Digits 3–4):** Specific product classification within the chapter (e.g., 0901 covers Coffee).
3. **Sub-heading (Digits 5–6):** Intermediate product condition, such as roasted or decaffeinated (e.g., 0901.11 covers Coffee, not roasted, not decaffeinated).
4. **Tariff Item (Digits 7–8):** Specific national product definition used for duty assessment (e.g., 0901.11.10 covers Arabica plantation coffee).

```text
[ 09 ] . [ 01 ] . [ 11 ] . [ 10 ]
   │        │        │        └── Tariff Item (Arabica plantation)
   │        │        └────────── Sub-heading (Not roasted, not decaffeinated)
   │        └─────────────────── Heading (Coffee)
   └──────────────────────────── Chapter (Coffee, Tea, Spices)
```

## REST Endpoint Architecture

The public API serves four query patterns over HTTP:

| Method | Route | Description | Expected Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/v1/hsn/search?q=:query` | Prefix and keyword search across 16,825 codes | `q` (string, min 2 chars) |
| `GET` | `/v1/hsn/:code` | Exact match for 2, 4, 6, or 8-digit codes | `code` (numeric string) |
| `GET` | `/v1/hsn/chapters` | List of all 98 active tariff chapters | None |
| `GET` | `/v1/hsn/chapters/:chapter` | All items nested under a specific chapter | `chapter` (string 01–98) |

All responses return standard JSON envelopes:

```json
{
  "success": true,
  "data": [
    {
      "code": "09011110",
      "description": "Coffee, not roasted : Not decaffeinated : Arabica plantation",
      "rate": "5%",
      "chapter": "09"
    }
  ],
  "meta": {
    "count": 1,
    "query": "09011110"
  }
}
```

## Node.js Implementation

The following service client queries the endpoint, handles network timeouts, and returns typed classification results.

```javascript
// hsn-client.js
const http = require("node:http");

class HsnClient {
  constructor(baseUrl = "http://localhost:3000") {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  async search(query, { timeoutMs = 3000 } = {}) {
    if (!query || typeof query !== "string" || query.trim().length < 2) {
      throw new Error("Search query must be at least 2 characters");
    }

    const url = `${this.baseUrl}/v1/hsn/search?q=${encodeURIComponent(query.trim())}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();
      if (!json.success || !Array.isArray(json.data)) {
        throw new Error(json.error?.message || "Invalid API response structure");
      }

      return json.data;
    } finally {
      clearTimeout(timeout);
    }
  }

  async getExactCode(code) {
    const cleanCode = String(code).replace(/\D/g, "");
    if (![2, 4, 6, 8].includes(cleanCode.length)) {
      throw new Error(`HSN code length must be 2, 4, 6, or 8 digits. Received ${cleanCode.length}.`);
    }

    const url = `${this.baseUrl}/v1/hsn/${cleanCode}`;
    const response = await fetch(url);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const json = await response.json();
    return json.success ? json.data : null;
  }
}

module.exports = { HsnClient };
```

## React Frontend Autocomplete Pattern

For checkout inputs or invoice forms, wrap search calls in a debounce handler to prevent firing an HTTP request on every keystroke:

```jsx
// HsnAutocomplete.jsx
import React, { useState, useEffect } from 'react';

export function HsnAutocomplete({ onSelectCode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/v1/hsn/search?q=${encodeURIComponent(searchTerm.trim())}`);
        const result = await res.json();
        if (result.success) {
          setSuggestions(result.data.slice(0, 8));
        }
      } catch (err) {
        console.error("HSN lookup failed:", err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div style={{ position: 'relative', width: 340 }}>
      <input
        type="text"
        placeholder="Search HSN code or item..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 6 }}
      />
      {loading && <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Querying CBIC records...</div>}
      {suggestions.length > 0 && (
        <ul style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 6,
          boxShadow: '0 4px 6px rgba(0,0,0,0.08)', listStyle: 'none', padding: 0, margin: '4px 0', zIndex: 10
        }}>
          {suggestions.map((item) => (
            <li
              key={item.code}
              onClick={() => {
                onSelectCode(item);
                setSearchTerm(item.code);
                setSuggestions([]);
              }}
              style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', fontSize: 13 }}
            >
              <strong style={{ color: '#1d4ed8', fontFamily: 'monospace' }}>{item.code}</strong>
              <span style={{ marginLeft: 8, color: '#0f172a' }}>{item.description}</span>
              <span style={{ float: 'right', color: '#64748b', fontSize: 11 }}>{item.rate}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## Production Caching Strategy

The official CBIC tariff schedule changes through formal GST Council notifications, typically a few times per year. Because changes are infrequent, an in-memory or Redis cache with an hourly or daily TTL reduces database queries to near zero:

```javascript
const cache = new Map();

async function getCachedHsn(client, code) {
  if (cache.has(code)) {
    return cache.get(code);
  }
  const result = await client.getExactCode(code);
  if (result) {
    cache.set(code, result);
  }
  return result;
}
```
