# K.E.A.N. 2.0 — Phase 2 progress

## Scope and authorization

The user approved development and incremental migration after the initial prototype. Work remains local and confined to `kean-v2/`. No publishing, root entry-file replacement or original supporting-source modification is performed. Phase 1 backups and the initial prototype versions remain available under `legacy/` and `phase2/*-before.*`.

## Migrated this phase

AuthGuard and SentrySim now run inside a derived `workbench.html` with a new sidebar workspace, return-to-portfolio navigation, contextual section label, restrained result/control styling and short panel entrance transitions. This is an incremental **presentation migration using the exact original runtime**, not a React rewrite or independently rebuilt security engine. All nine original panels remain available; the other seven retain their baseline panel presentation for subsequent migration.

`migrate.mjs` derives the page by appending one stylesheet and one presentation adapter. Removing those additions restores the frozen original byte-for-byte. No original controller, academic paragraph, data structure, route, provider request, timer, wake-word handler or export implementation is edited. The adapter observes navigation; it never replaces `routeCommand`, `switchTab`, `SecurityState` or authentication.

## Creative improvements

- Five distinct projected 3D Canvas scenes replace the shared sphere: a layered credential lattice, five-plane threat path, connected AI core, six-facet STRIDE constellation, and a flowing traffic field.
- Project selectors update the scene, accessible description and real tool destination. Mouse dragging rotates the scene; mobile touch keeps vertical scrolling available. Automatic rotation requires explicit activation. Scenes remain meaningful when static.
- Rendering is capped near 30 frames/second, device pixel ratio at 2, and pauses outside the viewport or hidden tab. Reduced-motion preference stops continuous scene animation and disables the motion toggle.
- Pinned, locally served GSAP 3.12.5 powers scroll-entry and project-caption transitions. Content is never dependent on animation to become visible; failure leaves the full page readable. No ScrollSmoother, WebGL scene or forced scroll hijacking is introduced. A native panel transition supplies immediate workspace navigation feedback.
- Project showcases gain restrained hover responses, tier elevation feedback, a scroll-position line and consistent explorer framing. Relative repository paths still support the GitHub Pages-style prefix.

## Reference follow-up

Hart's authored project-selection object and Sen's central character/scene informed subject-specific exploration. Deji Ajetomobi's site was successfully inspected in the browser this phase: a restrained multi-column case-study index and very large identity typography inform the balance between expressive scale and readable project indexing. Linear/Cursor and the prior Dribbble/gallery review inform product clarity and showcase variety.

Quang Ding and Meer Mohsin were retried in both web retrieval and the browser; both domains returned name-resolution failures. Their current visual treatment is not invented. All five requested URLs were investigated, but those two could not be visually studied. React Bits' official component/source overview was reviewed; its interactive-background and microinteraction approach informed the original native implementation. No React Bits source was copied or React runtime added merely to obtain an effect.

GSAP was retrieved from the official npm `gsap@3.12.5` tarball, matching the version already in the application. The package declares the GSAP standard no-charge license, not MIT; copyright/license header and upstream README are retained under `vendor/`. The direct standard-license web URL redirected to the forums-offline page during this check; no broader redistribution entitlement or current-version upgrade is asserted. This local portfolio does not sell an animation-authoring service. Recheck license terms before any different commercial distribution. Official docs: https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/ and https://reactbits.dev/.

## Executed checks

- Static verification: original root files and 218 supporting files unchanged; backups byte-identical; prototype syntax, IDs, landmarks and CSS valid; research values match original JSON.
- Exact migration verification: stripping the two presentation assets reconstructs the full original application; all nine panels and all original scripts/text retained.
- Browser side-by-side: 61 parity/smoke checks. Four representative passwords × three output comparisons; full audit receipt equality with timestamps normalized; visibility, clear and passphrase generation; TTC exact equality at 32/41/64/128 bits × three defense profiles; all eight vector controls produce their actual matching telemetry; SQLi neutralization, all nine tab routes, user authorization denial, existing palette and mobile navigation.
- Homepage: 32 browser checks passed, expanded from the previous 26 and refreshed for the new destination/canvas; expanded scene-specific tests cover five accessible labels and distinct rendered scenes. All five rendered images differ. Final count: 32 homepage checks. Reduced-motion application branches passed three additional isolated mock checks; this does not simulate the actual CSS media/OS setting.
- Visual review found and fixed a legacy late-loaded grid rule overriding the sidebar; the presentation stylesheet is now loaded after original inline styles. This does not alter original content or controllers.

The attack tests compare the configured exercised paths; they do not certify every defense combination. Random passphrases are checked for a functional result, not equality between random outputs. Physical microphone, paid provider success, long session expiry, clipboard/download permissions, full screen-reader review and all model/provider error branches remain unverified in this phase.

## Remaining work

1. Migrate the AI Security, STRIDE, DDoS and coursework presentation incrementally; retain byte-equal academic text and test feature-specific filters/exports/history/chat paths.
2. Extract and type narrowly scoped adapters/controllers only after equivalent tests exist; current migration deliberately retains the monolithic runtime.
3. Complete accessibility, mobile overflow/focus and light-theme polish across every panel. The current sidebar switches to a mobile grid; device testing and full screen-reader review remain pending.
4. Profile and split inherited workbench assets/background engines. The homepage avoids a new heavy 3D library, but the unchanged legacy runtime still loads its original graphics dependencies.
5. Validate real Gemini/Claude/search requests with an available user-entered session key and physical voice input on the presentation machine. Never mark source preservation as successful live API verification.
6. Prepare the final GitHub Pages artifact and rollback package after complete migration validation. Live deployment still requires explicit user approval.

This is a tested next-phase build, not a claim that the final website is finished.
