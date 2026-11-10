# Lab 05 corrective implementation

## Delivered

Lab 05 now renders a real Cytoscape.js topology, rather than using the component buttons as the primary presentation. Nine selectable component nodes sit inside five compound trust zones. Sixteen directed edges connect the proposed request, identity, session, authorization, data and encryption responsibilities. The thirteen-step request/response walkthrough selects each relevant component and highlights the current edge, retaining earlier edges as a visible trail.

The topology is proposed academic infrastructure, not a deployed backend. The graph frame, introduction, status text and accessible description state this explicitly. The walkthrough sends no attack or application traffic.

## Why Cytoscape

Reviewed the [official documentation](https://js.cytoscape.org/) and [repository](https://github.com/cytoscape/cytoscape.js). Compound nodes, directed edge styling, selection, viewport controls and responsive preset layouts directly address the corrective requirements. These are meaningful improvements over the previous button-based adapter. This supersedes the earlier decision to avoid a graph engine.

Pinned **3.34.4**, confirmed by npm metadata and the actual browser runtime. The MIT license is included. The 435,649-byte minified library is served locally and lazy-loaded only when Lab 05 first becomes active; there is no runtime CDN dependency. Its SHA-256 and source URLs are recorded in `vendor/CYTOSCAPE-README.md` and checked by `verify-topology.mjs`.

## Diagram and interactions

- Browser/frontend, reverse proxy/web server, application, database, authentication provider, authorization checks, encryption boundaries, session management and input validation are all graph nodes.
- Compound containers distinguish the untrusted client, public edge, private service, private data and identity trust boundary.
- The identity provider returns to the application; the application then resolves session context and checks authorization. The diagram does not imply that the external identity provider writes the application's session store directly.
- Node clicks select a component and populate the inspector with its original explanation verbatim.
- Next/previous, play/pause and reset control a thirteen-step path from browser to database and back. The current edge uses a strong mint highlight; earlier traversed edges remain visible.
- Background drag, scroll/pinch zoom, zoom buttons, four pan buttons and Fit diagram operate on the actual Cytoscape viewport.
- Keyboard: arrows select components, Home/End select first/last, plus/minus zoom, zero fits. A labeled native selector and the nine original component buttons provide alternatives to the canvas. All original next/reset/read controls remain.
- Playback stops on lab exit, session end or page hiding. Theme changes restyle the graph using the existing dark/light state.
- A portrait preset supports narrow screens. Mobile Lab 05 alone moves floating assistant/command controls into document flow and lets its header accommodate wrapped controls, preventing the graph from being covered. The other labs retain their original behavior.

## Coursework preservation

The graph precedes a native expandable **Complete Assignment 3 research** section. Original introduction, all nine component articles, request flow, original disclosure controls, walkthrough, verification text and references were moved together, without rewording or removing content. The existing read-assignment action opens that section and focuses the original `a3-flow-title` heading.

Browser comparison against the frozen original confirms the complete original Tab 5 text after removing only new presentation wrappers. Tab 6 text was also compared. Static preservation checks confirm all nine original panel fragments and every original controller script remain byte-exact in `workbench.html`.

## Exact files changed

### Application/build

1. `architecture.js` — replaces the prior architecture presentation adapter with the Lab 05 graph, controls, inspector and preserved research wrapper.
2. `architecture.css` — new Lab 05 stylesheet; every selector is scoped to `#panel-tab-5` or a body state containing active Lab 05. No `!important` added.
3. `platform.js` — one Lab 05-only guard: skip its older architecture playback addition when the new topology adapter owns the section. All other shared-module code is unchanged.
4. `build.mjs` — includes the new Lab 05 stylesheet, fixture and local library/license files in the local static output.
5. `vendor/cytoscape.min.js` — new pinned library.
6. `vendor/CYTOSCAPE-LICENSE.txt` — new upstream MIT license.
7. `vendor/CYTOSCAPE-README.md` — new provenance/version/hash notes.

### Verification/documentation

8. `topology-check.html` — new actual-browser topology regression suite.
9. `verify-topology.mjs` — new syntax, scope, untouched-file, library hash and license checks.
10. `docs/architecture-topology-report.md` — this report.
11. Evidence: `architecture-topology-full.png`, `architecture-topology-selected.png`, `architecture-topology-path.png`, `architecture-topology-mobile.png`, `architecture-topology-tests.txt` in `evidence/`.
12. `backups/pre-architecture-topology/` — backup copies of the five pre-change adapter/build/workbench files.
13. `dist/` — regenerated local preview copies of the changed/new application and fixture files. No publication.

`workbench.html`, `workbench.css`, `legacy-compat.css`, gateway files, authentication controllers, original source files, datasets and the other eight labs were not modified. `verify-topology.mjs` compares the shared module against its backup and permits only the Lab 05 guard change. Existing broad platform tests with assumptions about the former four-step button layout are not claimed as passing this corrective iteration; the new topology suite covers the new behavior.

## Actual browser verification

**83 assertions passed** in `topology-check.html` using the real application and real locally loaded Cytoscape instance:

- Runtime version, nine components, five trust zones, sixteen edges and one set of playback controls.
- Original Tab 5 and Tab 6 text preserved exactly.
- Every graph node's handler selects its original explanation and synchronizes the native selector.
- All thirteen request steps select one component and highlight one current edge; the full path returns to the browser.
- Previous/reset, both zoom buttons, all four pan buttons, fit bounds, selector, arrow keys and keyboard fit.
- Playback advances and pause stops progression.
- Light/dark graph palettes update.
- No horizontal page overflow and complete fitted diagram at 1440, 1024, 768 and 390px fixture widths.
- Mobile assistant controls do not overlay the graph.
- Read-assignment opens research and focuses the original heading; all nine articles remain available.
- Navigation to Coursework and back retains the correct Lab 05 view.
- No runtime errors during those interactions.

Separately, a real desktop canvas pointer click on the database node selected **Database** and displayed the original database explanation. The native selector was also exercised in the preview. A real browser viewport override at 390 × 900 was used for mobile inspection/capture, then reset. The final preview's console error/warning log was empty.

Early text comparison was affected by the inherited heading-scramble animation; the fixture now waits for the original heading to settle. Navigation checks wait for visible state rather than assuming a fixed 40ms completion time. The custom wheel sensitivity was removed after an upstream usability warning; the final runtime uses the library default.

## Screenshots

- [Complete graph](../evidence/architecture-topology-full.png)
- [Selected component and contextual explanation](../evidence/architecture-topology-selected.png)
- [Active request path reaching the database](../evidence/architecture-topology-path.png)
- [Mobile topology](../evidence/architecture-topology-mobile.png)

## Static verification

Passed `verify-topology.mjs`, `verify-migration.mjs`, `verify.mjs` and the local static build. Adapter syntax and new CSS brace balance pass; original panel/controller preservation and 218 supporting source-file hashes pass. The new library is locally pinned with a verified checksum and included license.

## Limits and preview

Canvas event tests exercise every node handler; the separate physical pointer test covers one node. No real touch-device pinch test, screen-reader session or multi-browser compatibility sweep was performed. The canvas is supplemented by native controls and complete text alternatives; a full accessibility certification is not claimed. No backend infrastructure is deployed or contacted by the walkthrough.

Preview: http://127.0.0.1:3513/personal/kean-v2/workbench.html#tab-5

Use the public demo credentials displayed on the existing gateway. Run `node kean-v2/build.mjs` and, if needed, `node kean-v2/preview.cjs` from the website directory. Test page: `topology-check.html` under the same local prefix.

No deployment and no original live-site changes.
