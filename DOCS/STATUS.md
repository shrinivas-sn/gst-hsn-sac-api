# GST HSN/SAC Classification API - Status

## Current State
- Backend scaffolded under `api-projects/projects/gst-hsn-sac-api/backend/`
- Datasets loaded: 16,825 HSN codes, 568 SAC codes, 98 chapters
- The local API strips incomplete or ambiguous source tax rates from every public response. A local regression suite covers this classification-only contract and keeps SAC records out of HSN exact lookup.
- The public Vercel deployment still runs the previous rate-returning revision until these changes are deployed and live-smoked.
- No verified source snapshot date or automated refresh is available. Hold any `public-apis` PR until these gates and the live documentation check pass.
