# Phases, gates and deployment preparation

## Current authorized scope

1. Discovery: freeze both original entry files; inventory all nine panels, controls, content, dependencies, state/events and supporting source hashes.
2. Specification: complete sitemap, reference study, tokens, component plan, page strategy and risk register.
3. Prototype: build separate public homepage and project exploration UI. Launch links lead to the unchanged frozen application; existing tools are not migrated.
4. **Approval gate:** show the concrete prototype and preservation plan to the user. Full migration waits for explicit approval per the supplied brief, not because a skill imposed an extra publishing gate.

## Future phases, after approval

4. Feature migration: extract one lab at a time, first shared adapters/events, then AuthGuard, SentrySim, STRIDE, AI terminal, DDoS, assignments. Compare functions and exact academic block hashes at every step. Keep legacy page until parity is demonstrated.
5. Polish: purposeful transitions, contextual assistant state, responsive graphics and progressive disclosure. A static/reduced-motion version must remain complete. Never animate away a control or technical value.
6. Validation: test the entire approved replacement, including providers/microphone when user/environment allows. Do not infer behavior from source presence or passing syntax.
7. Deployment preparation: reviewed build, asset manifest, base-path checks and rollback package. **Publication remains separately approval-gated.** No GitHub push or live replacement in this stage.

## Migration test matrix

- AuthGuard: exact known passwords/passphrases, penalties/entropy/estimates, presets, clear/visibility, generator and audit receipt; compare deterministic outputs with the frozen baseline.
- SentrySim: all eight vectors, each relevant defense on/off, tracer/telemetry/TTC and safe regex timeout; label mock hardware and intentional vulnerabilities. Never run real floods.
- STRIDE: all six classifications/CVSS text, filter choices, radar, current posture and actual report download.
- K.E.A.N.: shared router and palette navigation/explanations/actions, no-key fallback, measured acknowledgment, genuine Gemini/Claude normal/search calls with user-supplied session keys, request timeout/error logging, stale-response cancellation and session-bound approval.
- Voice: interim/final wake detection/dedup, wake aliases, restart watchdog, full natural question capture, turn taking/chime, once-per-event commentary; voices changed/empty-list fallback, sliders, personality defaults. Synthetic tests cannot prove physical microphone behavior.
- Auth/session: valid/invalid credentials, third-failure lockout, timed warning/expiry/logout, role checks at execution, user enable/disable/change and annotation logs; keep authorization educational caveat.
- Assignments: byte-equal original Tab 5/6 content; role-demo, chat runtime self-test, image type/5 MB/consent/remove, local digital person status, XSS tests/report downloads.
- DDoS: exported tree/reference parity, empty/invalid feature inputs, held-out examples, charts/selectors, opt-in history, storage unavailable, deletion/clear, data/export provenance and model limitations.
- Shell: keyboard-only menu/dialog focus, arrows/Enter/Escape, 390/768/1440 layouts, zoom, reduced motion and no horizontal overflow. Static route/assets under `/personal/kean-v2/`, direct refresh and case-sensitive filenames.

## Rollback and GitHub Pages

No deployment is executed. Root `index.html` and `index-cmdk.html` must match `backup-manifest.json` hashes at completion. All prototype files are confined to `kean-v2/`; rollback at this stage is simply not using that folder. The unchanged original application remains available.

For a future approved preview deployment, add `kean-v2/dist/` under the existing repository at a separate preview path, verify repository Pages workflow and origin, and review the artifact before pushing. Do not assume repository access or that the currently untracked workspace is already committed. Root deployment replacement requires a second explicit instruction. Retain the last known published artifact/commit and test its restoration process before replacing it. No credentials go into Git or a deployment ZIP.

## Verification reporting

Record current-stage checks in `VALIDATION.md`. Mark each as tested, source-only, inherited prior evidence or pending. Provider success, physical speech and full migration regressions must never be marked PASS solely because untouched code is linked. Local prototype checks cannot prove GitHub Pages publication.
