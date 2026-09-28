---
title: "SAC vs HSN Codes: Building a Dual Tax Classification Pipeline in Node.js"
slug: "sac-vs-hsn-codes-invoicing-pipeline"
meta_description: "How Services Accounting Codes (Chapter 99) differ from HSN tariff codes and how to handle dual goods and services classification in invoicing software."
keywords: "sac code search api, services accounting code gst lookup, difference between hsn and sac code api, chapter 99 gst services, sac code 9954 9983"
author: "Open Source Companion Engineering"
published_date: "2026-09-27"
canonical_url: "https://gst-hsn-sac.osc.internal/guides/sac-vs-hsn-codes-invoicing-pipeline"
schema_type: "TechArticle"
status: "archived-inaccurate-draft"
---

> Archived draft: the tax calculations and rate examples below are outside the classification-only API contract. Do not publish or use them for implementation. See the current [README](../../README.md) and [public guide](../../frontend/src/content/guidesData.js).

# SAC vs HSN Codes: Building a Dual Tax Classification Pipeline in Node.js

Enterprise billing, SaaS platforms, and ERP applications operating in India must handle two distinct tax classification systems under GST:

1. **HSN (Harmonized System of Nomenclature):** Classifies tangible goods across Chapters 01 to 98 (16,825 individual entries in India's tariff schedule).
2. **SAC (Services Accounting Codes):** Classifies intangible services exclusively within Chapter 99 (568 individual service entries).

Treating SAC codes as simple HSN codes causes database constraint errors, incorrect digit validation, and faulty tax calculation. Here is how both systems differ and how to construct a unified classification router.

## Structural Differences

The numbering conventions and legal sources of truth diverge significantly:

| Dimension | HSN (Goods) | SAC (Services) |
| :--- | :--- | :--- |
| **Origin** | World Customs Organization (WCO) | Central Board of Indirect Taxes and Customs (CBIC) |
| **Chapters** | Chapters 01 to 98 | Chapter 99 only |
| **Digit Format** | 2, 4, 6, or 8 digits | Standardized 6 digits (always starting with `99`) |
| **Mandatory Prefix** | Varies by commodity (01 to 98) | Uniformly begins with `99` |
| **Active Count** | ~16,825 entries | ~568 entries |
| **Typical Slabs** | 0%, 5%, 12%, 18%, 28% | Predominantly 18% (with 5% and 12% exceptions) |

```text
HSN Code (8 digits):  [ 09 ] [ 01 ] [ 11 ] [ 10 ]  (Chapter 01 - 98)
SAC Code (6 digits):  [ 99 ] [ 83 ] [ 13 ]        (Always Chapter 99)
                        │      │      └── Sub-service (IT consulting)
                        │      └───────── Service Group (Professional / Tech)
                        └──────────────── Chapter 99 (Services)
```

## Common SAC Groups for Digital & Tech Businesses

Most developers, agencies, and SaaS providers bill under the following Chapter 99 groups:

- `998311`: Management consulting services
- `998313`: Information technology consulting and support services
- `998314`: Internet telecommunication and hosting infrastructure services
- `998315`: Web design and hosting services
- `998319`: Other information technology services not elsewhere classified
- `998431`: On-line text and software retrieval services

## Building the Unified Dual Classifier

A production billing system needs a single classification interface that determines whether an item is goods or services, checks code length, and routes the search to the correct registry table.

```javascript
// dual-classifier.js

class UnifiedTaxClassifier {
  constructor(apiBase = "http://localhost:3000") {
    this.apiBase = apiBase.replace(/\/+$/, "");
  }

  /**
   * Automatically detects line item category and queries the appropriate registry.
   *
   * @param {string} input - Search term or numeric code.
   * @param {'auto' | 'goods' | 'service'} forceType - Force specific registry query.
   */
  async search(input, forceType = "auto") {
    const query = String(input || "").trim();
    if (query.length < 2) return [];

    const isNumeric = /^\d+$/.test(query);
    const startsWith99 = query.startsWith("99");

    let targetType = forceType;
    if (targetType === "auto") {
      if (isNumeric && startsWith99) {
        targetType = "service";
      } else if (isNumeric && !startsWith99) {
        targetType = "goods";
      }
    }

    if (targetType === "service") {
      return this.searchServices(query);
    }

    if (targetType === "goods") {
      return this.searchGoods(query);
    }

    // Parallel lookup when type is ambiguous text (e.g. "consulting" or "cable")
    const [goods, services] = await Promise.all([
      this.searchGoods(query).catch(() => []),
      this.searchServices(query).catch(() => []),
    ]);

    return [
      ...services.map((item) => ({ ...item, category: "service" })),
      ...goods.map((item) => ({ ...item, category: "goods" })),
    ];
  }

  async searchGoods(query) {
    const res = await fetch(`${this.apiBase}/v1/hsn/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error(`HSN search failed: HTTP ${res.status}`);
    const json = await res.json();
    return json.success ? json.data : [];
  }

  async searchServices(query) {
    const res = await fetch(`${this.apiBase}/v1/sac/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error(`SAC search failed: HTTP ${res.status}`);
    const json = await res.json();
    return json.success ? json.data : [];
  }

  async lookupCode(code) {
    const clean = String(code).replace(/\D/g, "");
    if (clean.startsWith("99") && clean.length === 6) {
      const res = await fetch(`${this.apiBase}/v1/sac/${clean}`);
      if (res.status === 404) return null;
      const json = await res.json();
      return json.success ? { ...json.data, category: "service" } : null;
    }

    const res = await fetch(`${this.apiBase}/v1/hsn/${clean}`);
    if (res.status === 404) return null;
    const json = await res.json();
    return json.success ? { ...json.data, category: "goods" } : null;
  }
}

module.exports = { UnifiedTaxClassifier };
```

## Invoice Line Item Schema Integration

When constructing invoice payloads for accounting exports or e-invoicing APIs, structure line items with explicit category tags:

```json
{
  "line_items": [
    {
      "id": 1,
      "description": "SaaS Platform Subscription (Annual)",
      "category": "service",
      "code": "998315",
      "quantity": 1,
      "unit_price": 50000.00,
      "gst_rate": 0.18,
      "taxable_amount": 50000.00,
      "igst_amount": 9000.00,
      "total_amount": 59000.00
    },
    {
      "id": 2,
      "description": "Hardware Security Key (FIDO2)",
      "category": "goods",
      "code": "847170",
      "quantity": 2,
      "unit_price": 2500.00,
      "gst_rate": 0.18,
      "taxable_amount": 5000.00,
      "igst_amount": 900.00,
      "total_amount": 5900.00
    }
  ]
}
```
