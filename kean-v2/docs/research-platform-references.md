# Implementation research and decisions

Research performed before interface modifications. Existing vanilla HTML/CSS/JS, original controllers and the lower-priority compatibility layer remain the architecture. No libraries installed or upgraded in this pass.

## Repository review

All requested GitHub repository landing pages/README material were opened. Selected source and licenses were inspected to assess compatibility, not to copy implementations.

| Repository | Inspection and decision |
|---|---|
| [Cytoscape.js](https://github.com/cytoscape/cytoscape.js) | README, MIT license, [API documentation](https://js.cytoscape.org/). Selection/inspectors are useful; a layout/zoom engine does not demonstrate enough benefit for five fixed Sentry nodes or nine architecture controls. Native DOM retained. Attempted animation source path returned a cache miss. |
| [vis-network](https://github.com/visjs/vis-network) | README, MIT license file, `lib/network/modules/InteractionHandler.js` source: selection/drag/touch handlers. No need for another canvas interaction stack. |
| [G6](https://github.com/antvis/G6) | README and `packages/g6/src/behaviors/zoom-canvas.ts`: configurable viewport interaction. Small fixed graph does not need its runtime. Not installed; no license compatibility claim for a bundled copy. |
| [ECharts](https://github.com/apache/echarts) | README, Apache-2.0 source header and `src/component/aria/preprocessor.ts`. Keep existing SVG ROC curves and readable tables; add semantic button-based error investigation. [Examples](https://echarts.apache.org/examples/en/index.html) required JS and could not be inspected through text retrieval. |
| [Mermaid](https://github.com/mermaid-js/mermaid) | README, MIT license, architecture renderer source: layout brings Cytoscape/fcose/d3 dependencies. Preserve existing interactive diagram and verbatim inspector instead of replacing it. |
| [GSAP](https://github.com/greensock/GSAP) | README and `src/gsap-core.js` license header/timeline internals. Keep existing pinned project runtime; no upgrade or duplicate animation library. License is GSAP's standard license, not assumed MIT. |
| [Motion](https://github.com/motiondivision/motion) | README and MIT license. Existing project motion is sufficient; no installation. |
| [Lenis](https://github.com/darkroomengineering/lenis) | README, MIT license, `packages/core/src/lenis.ts`: wheel interception/smoothing. Avoid adding more scroll interception to an accessible technical workbench. |
| [shadcn/ui](https://github.com/shadcn-ui/ui) | README, MIT license, dialog source at `apps/v4/registry/new-york-v4/ui/dialog.tsx`. Consistent control dimensions and labeled native controls inform the new UI; no React/Radix introduction. |
| [Lucide](https://github.com/lucide-icons/lucide) | README and ISC license with inherited notices. No icons copied or installed. Avoid an additional runtime for the small new control set. |
| [Floating UI](https://github.com/floating-ui/floating-ui) | README, MIT license, `packages/dom/src/autoUpdate.ts` observer/event lifetime management. Use inline inspectors rather than positioning another floating layer. |
| [React Bits](https://github.com/DavidHDev/react-bits) | README, current MIT + Commons Clause license, `FadeContent.jsx` source using GSAP/ScrollTrigger. Study purposeful entrance/state feedback; no React components copied or ported. |
| [Playwright](https://github.com/microsoft/playwright) | README and Apache-2.0 license. Use the available browser tool with DOM locators and local browser fixtures. Attempted example path returned 404; do not claim it was reviewed. |

The repository review did not exhaust every documentation page, example or source file. No new dependency was selected, so there is no unverified new library version in the build.

## Visual references

- [Hart Studio](https://madebyhart.com/): accessible page composition/project selection concept. Translate curated project navigation into three purposeful overview entry points; no assets or layouts copied.
- [React Bits](https://reactbits.dev/): accessible categories and source; motion should support state and discovery. Use explicit play/pause/reset rather than mandatory looping effects.
- [Sen](https://about.senbuzy.com/): request returned no readable content. Visual review not completed.
- [Quang](https://quangding.im/): request failed. Visual review not completed.

## Data provenance

[Original CIC-DDoS2019 page](https://www.unb.ca/cic/datasets/ddos-2019.html) was accessible. The [Kaggle mirror](https://www.kaggle.com/datasets/dhoogla/cicddos2019) returned no readable text through the research tool. UI results are sourced from actual `ddos-guard/results/metrics.json` and the existing loaded `DDoSGuard.results`, not from a web summary. The local artifact records source files, hashes, retained rows, classes, model metrics and curve points. Existing training script, tree model, data and calculations were not changed or retrained.

## Movie integration

No exported movie, poster or captions were supplied. The new section displays a missing-asset state. Optional reviewed local media may be configured before `platform.js` as `window.KeanMovie={video:'media/under-siege.mp4',poster:'media/under-siege.webp',captions:'media/under-siege.vtt'}`. Only local `media/` paths without traversal are accepted. Add actual assets to the build and configure server MIME types before testing that branch. The native player supports controls, inline playback, metadata preload, poster and English captions, with an error fallback. This branch remains unverified without real assets. The [Flow tool](https://labs.google/fx/tools/flow) was requested as the production tool, but no account interaction, upload, generation or publication was performed.
