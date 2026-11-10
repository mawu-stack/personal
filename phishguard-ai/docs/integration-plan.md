# K.E.A.N. integration — pending approval

The standalone Flutter/FastAPI application is a new experiment using raw URLs. Keep the existing Tab 7 and its historical results intact until the user approves an explicit integration change.

After review, add a clearly labelled link to the separately hosted Flutter app. Deploy the backend with HTTPS and configure an exact frontend-origin CORS allowlist. Build Flutter with `--dart-define=API_URL=https://your-approved-backend`.

Do not embed new inference logic, credentials or model artifacts in K.E.A.N. Do not reuse the old precomputed-feature metrics for the new scanner. No integration or deployment has been performed.

Baseline SHA-256 of `index-cmdk.html` before this standalone work: `F4B76832E6020CF73B5F9D1ADDBB707C9902EF2C0B686AF45E5BCE3D4D82DDF4`.
