---
title: "4-Digit vs 6-Digit vs 8-Digit HSN Codes: GST Invoicing Rules and Validation"
slug: "hsn-code-digits-rules-einvoicing"
meta_description: "Mandatory HSN code length rules under CBIC Notification 78/2020 for Indian B2B invoicing, e-invoicing, and exports, with automated validation logic."
keywords: "hsn code digits rule gst e-invoicing, b2b gst hsn validation api, turnover 5 crore hsn mandatory digits, cbic notification 78 2020 central tax, hsn code length validation"
author: "Open Source Companion Engineering"
published_date: "2026-09-27"
canonical_url: "https://gst-hsn-sac.osc.internal/guides/hsn-code-digits-rules-einvoicing"
schema_type: "TechArticle"
---

# 4-Digit vs 6-Digit vs 8-Digit HSN Codes: GST Invoicing Rules and Validation

One of the most frequent rejection reasons on India's Invoice Registration Portal (IRP) during e-invoice generation is an invalid or truncated HSN code. Taxpayers submitting invoices to NIC or GSP gateways encounter errors like `2150: HSN code is invalid` or `2151: HSN does not exist in master data`.

These rejections occur because the Central Board of Indirect Taxes and Customs (CBIC) altered the mandatory digit requirements under Notification No. 78/2020 – Central Tax.

Understanding the turnover thresholds and enforcing automated length validation prevents compliance failures before invoices reach the government portal.

## The Statutory Length Rules (Notification 78/2020)

Effective 1st April 2021, the mandatory number of digits depends strictly on the supplier's Aggregate Annual Turnover (AATO) in the preceding financial year:

| Preceding FY Turnover | Transaction Type | Mandatory Digits | Optional Allowance |
| :--- | :--- | :--- | :--- |
| **Up to ₹5 Crore** | B2B Supplies | **4 Digits** | 6 or 8 digits permitted |
| **Up to ₹5 Crore** | B2C Supplies | Optional | 4 digits encouraged |
| **Above ₹5 Crore** | B2B Supplies | **6 Digits** | 8 digits permitted |
| **Above ₹5 Crore** | B2C Supplies | **6 Digits** | 8 digits permitted |
| **Any Turnover** | Export & Import | **8 Digits** | Strict requirement |
| **Any Turnover** | Chemical / Spec. Goods | **8 Digits** | Mandatory 49 notified items |

```text
Turnover <= ₹5 Cr ───(B2B)───> Min 4 Digits (e.g. 0901)
Turnover > ₹5 Cr  ───(All)───> Min 6 Digits (e.g. 090111)
Cross-Border      ───(All)───> Full 8 Digits (e.g. 09011110)
```

## Why 2-Digit Chapter Codes Fail

In the initial 2017 rollout of GST, some small taxpayers used 2-digit chapter numbers on invoices. Under current regulations, a 2-digit number (e.g., `09` for Coffee and Spices) is rejected for all B2B transactions. The minimum valid level is the 4-digit heading (e.g., `0901`).

Furthermore, 4-digit or 6-digit codes must be valid prefixes of real 8-digit tariff lines in the official Customs Tariff Act schedule. Arbitrarily truncating an invalid 8-digit number does not make it a valid 4-digit heading.

## Programmatic Code Length and Existence Validator

The following TypeScript/JavaScript validation module verifies both the digit length according to company turnover and checks whether the code exists in the official 16,825-code registry.

```javascript
// hsn-validator.js

const VALID_LENGTHS = [4, 6, 8];

/**
 * Validates HSN requirements against CBIC Notification 78/2020.
 *
 * @param {string} hsn - The HSN code string to check.
 * @param {Object} context - Invoice context parameters.
 * @param {number} context.annualTurnoverInCrores - Turnover of preceding FY.
 * @param {boolean} context.isExport - Whether the supply is cross-border/SEZ.
 * @param {string} context.supplyType - 'B2B' or 'B2C'.
 * @param {string} apiBase - Public HSN API base URL.
 */
async function validateInvoiceHsn(hsn, context, apiBase = "http://localhost:3000") {
  const clean = String(hsn || "").trim().replace(/\D/g, "");

  // 1. Structural digit check
  if (!VALID_LENGTHS.includes(clean.length)) {
    return {
      isValid: false,
      code: "INVALID_LENGTH",
      message: `HSN code must be 4, 6, or 8 digits. Received ${clean.length} digits (${clean}).`,
    };
  }

  // 2. Turnover threshold check
  if (context.isExport && clean.length !== 8) {
    return {
      isValid: false,
      code: "EXPORT_REQUIRES_8_DIGITS",
      message: `Cross-border export invoices require full 8-digit tariff items. Received ${clean.length}.`,
    };
  }

  if (context.annualTurnoverInCrores > 5 && clean.length < 6) {
    return {
      isValid: false,
      code: "TURNOVER_EXCEEDS_5CR_REQUIRES_6_DIGITS",
      message: `Suppliers with turnover > ₹5 Cr must supply at least 6-digit HSN codes per Notification 78/2020.`,
    };
  }

  if (context.annualTurnoverInCrores <= 5 && context.supplyType === "B2B" && clean.length < 4) {
    return {
      isValid: false,
      code: "B2B_REQUIRES_4_DIGITS",
      message: `B2B transactions require minimum 4-digit heading codes.`,
    };
  }

  // 3. Official registry existence check
  try {
    const res = await fetch(`${apiBase}/v1/hsn/${clean}`);
    if (res.status === 404) {
      return {
        isValid: false,
        code: "HSN_NOT_FOUND",
        message: `Code ${clean} is structurally valid but does not exist in the official CBIC tariff schedule.`,
      };
    }

    if (!res.ok) {
      throw new Error(`Registry API returned status ${res.status}`);
    }

    const payload = await res.json();
    return {
      isValid: true,
      data: payload.data,
    };
  } catch (err) {
    return {
      isValid: false,
      code: "REGISTRY_LOOKUP_FAILED",
      message: `Unable to verify code with registry: ${err.message}`,
    };
  }
}

module.exports = { validateInvoiceHsn };
```

## Unit Test Matrix

Testing your ERP or invoicing validator against known edge cases prevents production filing rejections:

```javascript
// test/validator.test.js
const { validateInvoiceHsn } = require("../hsn-validator");
const assert = require("node:assert/strict");

async function runTests() {
  // Case A: 2-digit code must fail
  const test1 = await validateInvoiceHsn("09", { annualTurnoverInCrores: 2, supplyType: "B2B" });
  assert.equal(test1.isValid, false);
  assert.equal(test1.code, "INVALID_LENGTH");

  // Case B: 4-digit code passes for turnover <= 5 Cr
  const test2 = await validateInvoiceHsn("0101", { annualTurnoverInCrores: 4.5, supplyType: "B2B" });
  assert.equal(test2.isValid, true);

  // Case C: 4-digit code fails for turnover > 5 Cr
  const test3 = await validateInvoiceHsn("0101", { annualTurnoverInCrores: 8.0, supplyType: "B2B" });
  assert.equal(test3.isValid, false);
  assert.equal(test3.code, "TURNOVER_EXCEEDS_5CR_REQUIRES_6_DIGITS");

  // Case D: Export requires 8 digits
  const test4 = await validateInvoiceHsn("010121", { isExport: true });
  assert.equal(test4.isValid, false);
  assert.equal(test4.code, "EXPORT_REQUIRES_8_DIGITS");

  console.log("All HSN validation tests passed.");
}

runTests().catch(console.error);
```
