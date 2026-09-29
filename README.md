# GST HSN/SAC Classification API

A keyless REST API for searching a community-maintained Indian HSN/SAC classification dataset: 16,825 goods codes, 568 service codes, and 98 chapter records. It supports exact code lookup, text search, and paginated HSN chapter browsing.

The data files were derived from the [QuantumByteStudios HSN/SAC dataset](https://github.com/QuantumByteStudios/gst-hsn-sac-codes), which describes its source as CBIC notifications. The data is pinned to upstream commit `c901c1b8bc4375080354eb17aba37b37c6a67c45` (6 June 2026), reported by `GET /v1/freshness`. Treat results as a classification reference, not proof that a code is currently valid.

Dataset size: **16,825 HSN records, 568 SAC records, 98 chapter records**.

No signup or API key is required, and CORS permits all origins. **This API does not provide GST rates or tax advice.** The imported source contains incomplete and ambiguous rates, so public responses intentionally omit all rate fields. Check current [CBIC GST rate schedules](https://cbic-gst.gov.in/) and applicable notifications before calculating tax.

**Response change:** Earlier deployments exposed `igst_rate`, `cgst_rate`, and `sgst_rate`. These fields are removed from all public endpoints in this release because their values cannot be relied on. Clients using those fields must migrate before updating.

The closest known free, keyless alternative, [HSN Code Finder](https://hsn.krakelabsindia.com/developers), already supports HSN/SAC search, rate results, batch lookup, snapshot metadata, and OpenAPI. This API's current distinction is deterministic catalogue browsing: it returns up to 500 records per HSN chapter page and includes the section, heading, and group text carried by the SAC dataset. These are useful for exploring classification structure, but they do not establish rate accuracy.

## Quick start

```bash
# Health check & API discovery
curl https://gst-hsn-sac-api.vercel.app/health

# Search goods by description
curl "https://gst-hsn-sac-api.vercel.app/v1/hsn/search?q=rice"

# Lookup exact HSN or SAC code
curl https://gst-hsn-sac-api.vercel.app/v1/hsn/0101
curl https://gst-hsn-sac-api.vercel.app/v1/sac/995411

# List all tariff chapters
curl https://gst-hsn-sac-api.vercel.app/v1/hsn/chapters

# List items within Chapter 10 (Cereals)
curl "https://gst-hsn-sac-api.vercel.app/v1/hsn/chapters/10?limit=20"

# Search services by description
curl "https://gst-hsn-sac-api.vercel.app/v1/sac/search?q=software"
```

## Response format

For example, `GET /v1/hsn/search?q=horses&limit=1` uses this envelope; exact lookups return a single object in `data` and `meta.code`/`meta.type`:

```json
{
  "success": true,
  "data": [{ "code": "0101", "description": "Live horses, asses, mules and hinnies.", "type": "goods", "section": null, "heading": "0101", "heading_description": null, "group": null, "group_description": null }],
  "meta": {
    "query": "horses",
    "count": 1,
    "limit": 1,
    "offset": 0
  }
}
```

## Endpoints

| Endpoint | Method | Query / Path Params | Description |
|---|---|---|---|
| `/health` | GET | none | Health check, API overview, and dataset statistics (`/` serves the web portal in production) |
| `/v1/freshness` | GET | none | Snapshot provenance: upstream repository, commit, snapshot date, age in days, row counts |
| `/v1/hsn/search` | GET | `q` (required), `limit` (opt), `offset` (opt) | Case-insensitive token search across HSN code descriptions |
| `/v1/hsn/:code` | GET | `code` (required path param) | Exact goods HSN lookup; use `/v1/sac/:code` for services |
| `/v1/hsn/chapters` | GET | none | List the 98 chapter records in this dataset |
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

## Data source, limitations, and local setup

- Dataset provenance: [QuantumByteStudios/gst-hsn-sac-codes](https://github.com/QuantumByteStudios/gst-hsn-sac-codes), licensed MIT by its publisher. It is a third-party parsing of government schedules; this API does not independently certify every record against a current official publication.
- The source files contain rates, but all 568 SAC rates are null and 4,397 HSN IGST rates are null. Some non-null heading-level values also collapse conditional rates. The service strips all rate fields before indexing or responding.
- Snapshot: `backend/data/meta.json` records the upstream commit, its date (2026-06-06), and SHA-256 checksums for every data file; tests fail if a file drifts from it. `hsn_codes.json` and `sac_codes.json` are byte-identical to that upstream commit; `chapters.json` is derived by this project.
- Refresh: the `upstream-check` workflow runs every Monday, compares the pinned commit with the newest upstream commit touching `data/`, and opens an `upstream-drift` issue when they differ. Data is then refreshed by hand and re-verified; nothing is overwritten automatically. Run `node backend/scripts/check-snapshot.js --upstream` to check locally (exit 0 in sync, 2 drift, 1 error).
- No effective-date history is published, so a missing code is not proof of an invalid classification. Recheck primary sources for compliance work.
- Run `npm --prefix backend install` and `npm --prefix backend test`, then `npm --prefix backend start` for a local server on port 3000. Run `npm --prefix frontend install` and `npm --prefix frontend run dev` for the portal.
