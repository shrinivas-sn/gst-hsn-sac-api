# GST HSN/SAC Code & Tax Rate Lookup API

A keyless REST API for India's complete GST (Goods and Services Tax) classification directory: ~16,825 HSN codes for goods and ~568 SAC codes for services with CGST, SGST, IGST tax rates, conditions, and chapter classifications.

The underlying data originates from statutory rate schedules and gazette notifications published by the Central Board of Indirect Taxes and Customs (CBIC), Ministry of Finance, Government of India.

Current dataset: **16,825 HSN codes, 568 SAC codes, 98 active chapters**.

No signup, no API key, CORS open to all origins. Every response carries a standard JSON envelope with metadata.

## Quick start

```bash
# Health check & API discovery
curl http://localhost:3000/

# Search goods by description
curl "http://localhost:3000/v1/hsn/search?q=rice"

# Lookup exact HSN or SAC code
curl http://localhost:3000/v1/hsn/0101
curl http://localhost:3000/v1/hsn/995411

# List all tariff chapters
curl http://localhost:3000/v1/hsn/chapters

# List items within Chapter 10 (Cereals)
curl "http://localhost:3000/v1/hsn/chapters/10?limit=20"

# Search services by description
curl "http://localhost:3000/v1/sac/search?q=software"
```

## Response format

Every successful response uses the standard envelope:

```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "count": 10,
    "limit": 50,
    "offset": 0
  }
}
```

## Endpoints

| Endpoint | Method | Query / Path Params | Description |
|---|---|---|---|
| `/` | GET | none | Health check, API overview, and dataset statistics |
| `/v1/hsn/search` | GET | `q` (required), `limit` (opt), `offset` (opt) | Case-insensitive token search across HSN code descriptions |
| `/v1/hsn/:code` | GET | `code` (required path param) | Exact lookup by 2/4/6/8-digit HSN or SAC code |
| `/v1/hsn/chapters` | GET | none | List of all 98 chapters with item counts and headings |
| `/v1/hsn/chapters/:chapter` | GET | `chapter` (path, 2 digits), `limit`, `offset` | List all commodities belonging to a specific chapter |
| `/v1/sac/search` | GET | `q` (required), `limit` (opt), `offset` (opt) | Case-insensitive token search across Services Accounting Codes |
| `/v1/sac/:code` | GET | `code` (required path param) | Exact lookup for a service accounting code |

## Errors

Error responses return standard JSON envelopes with machine-readable codes:

```json
{
  "success": false,
  "error": {
    "code": "MISSING_PARAM",
    "message": "Query parameter 'q' is required for search (e.g., /v1/hsn/search?q=rice)"
  }
}
```

| Code | Status | Trigger |
|---|---|---|
| `MISSING_PARAM` | 400 | A required query parameter (`q`) was omitted or empty |
| `NOT_FOUND` | 404 | The requested code, chapter, or route does not exist |
| `RATE_LIMITED` | 429 | Exceeded 100 requests per 15 minutes per IP |

## Data source and license

- Primary source: Central Board of Indirect Taxes and Customs (CBIC), Ministry of Finance, Government of India (`cbic-gst.gov.in`, `services.gst.gov.in`).
- Legal status: Statutory rate schedules and gazette notifications are public domain per Section 52(1)(q) of the Indian Copyright Act, 1957.
- Community parsing: Parsed and standardized from gazette notifications by QuantumByteStudios open-source directory.
