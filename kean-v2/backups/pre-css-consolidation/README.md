# Phase 2 update

Incremental development and migration are now authorized. See [phase2-report.md](phase2-report.md). AuthGuard and SentrySim have a migrated presentation in workbench.html, with the original runtime preserved exactly; the remaining seven panels stay available for their next presentation pass. Original source files and live site remain untouched.

# K.E.A.N. 2.0 — separate prototype workspace

This is the discovery/design/prototype stage requested on 25 October 2026. It does not migrate or replace the original application and is not published.

## Review

Run from the website directory:

```
node kean-v2/verify.mjs
node kean-v2/build.mjs
node kean-v2/preview.cjs
```

Open http://127.0.0.1:3513/personal/kean-v2/. Prototype checks: http://127.0.0.1:3513/test. Stop the local server with Ctrl+C when finished reviewing. All paths are tested under the GitHub Pages-style `/personal/kean-v2/` prefix, not deployed there.

Main source: `index.html`, `styles.css`, `app.js`, `field.svg`, `mark.svg`, `research-data.js`. `field-motion.js` loads only when requested. No npm install or runtime framework is needed for this stage. `dist/` is the static review build. No credentials, provider requests, fake chats or automatic microphone permissions are introduced.

## Documents

1. `docs/01-audit-and-preservation.md` — feature inventory and preservation destinations, status and risks.
2. `docs/02-reference-analysis.md` — observed reference principles and unavailable references.
3. `docs/03-design-and-architecture.md` — sitemap, homepage, design tokens, components and architecture/library recommendation.
4. `docs/04-plan-validation-and-rollback.md` — migration gates, full validation plan and deployment/rollback preparation.
5. `docs/inventory.json` — parser-derived controls/content/functions/state/dependencies and nine panel hashes.
6. `docs/source-manifest.json`, `backup-manifest.json` — immutable baseline fingerprints.
7. `VALIDATION.md` — current executed checks and explicit remaining limits.

## Preservation and approval

The original root `index-cmdk.html` and `index.html`, and 218 supporting source/document files, are unchanged. Their snapshots are under `legacy/`. Prototype links open that unmodified application with its existing sign-in and behavior. All academic text remains inside the byte-identical snapshot. The standalone source/data/archives remain in their original directories.

The original app is not a new React implementation. Full feature migration waits for approval of this concrete prototype, as required by the user's brief. Publication is a separate future approval. Never run the older build scripts over the originals during review.
