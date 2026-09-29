# GST HSN/SAC Classification API - Status

## Current State
- Backend under `backend/`; live at `https://gst-hsn-sac-api.vercel.app` (Vercel, deploys from `main`).
- Datasets loaded: 16,825 HSN codes, 568 SAC codes, 98 chapters. Public responses are classification-only; every tax-rate field is stripped.
- Snapshot provenance (2026-09-29): `backend/data/meta.json` pins upstream `QuantumByteStudios/gst-hsn-sac-codes` commit `c901c1b8bc4375080354eb17aba37b37c6a67c45` (2026-06-06) with SHA-256 checksums. `hsn_codes.json` and `sac_codes.json` are byte-identical to that commit. `GET /v1/freshness` and `/health` report it.
- Refresh process: `.github/workflows/upstream-check.yml` runs weekly and opens an `upstream-drift` issue when upstream has a newer data commit. Refresh itself is manual and reviewed. Local check: `node backend/scripts/check-snapshot.js --upstream` (0 in sync, 2 drift, 1 error).
- Tests: 19/19 pass (`npm --prefix backend test`).

## Pending
- Refresh is manual: `chapters.json` has no generator script, so a data refresh means rebuilding it by hand.
- No CI runs the test suite on push; only the weekly upstream check exists.
- `public-apis` submission PR: `add-india-gst-hsn-api` in `api-projects/projects/public-apis-fork`.
