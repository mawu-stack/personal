# Design specification and architecture recommendation

## Sitemap

```
Home — introduction / interactive field / selected work / research / creator
Explore — searchable launch dialog, all nine existing destinations
Labs — AuthGuard / SentrySim / STRIDE
K.E.A.N. — AI security terminal / existing provider + voice settings
Research — DDoS Guard / results / method + limitations
Coursework — architecture / original coursework / identity & AI / XSS & research
Original workbench — unchanged runtime, every original tab and export
```

Prototype URLs use relative files and hashes: `index.html#work`, `#research`, `#about` and `legacy/index-cmdk.html#tab-1` through `#tab-9`. These resolve under `/personal/kean-v2/` or file:// without origin-root assumptions. The frozen legacy snapshot remains navigable and separately authenticated. This is coexistence, not full migration or a duplicate router inside the tools.

## Homepage concept

1. Compact monogram/wordmark, three section links, “Explore labs” launcher, small prototype disclosure.
2. Two-column hero: editorial “Security is a practice. Make it visible.” and one field sculpture. Label owner/student research; no invented recruiter claims. Primary action opens AuthGuard; secondary action explores the project index.
3. Five accessible orbit selectors: AuthGuard, SentrySim, K.E.A.N., STRIDE, DDoS Guard. Pointer/focus selection updates the field annotation and launch link. Native buttons work without pointer motion. A still graphic remains strong with reduced motion.
4. Selected work: an oversized SentrySim pipeline exhibit and an AuthGuard receipt/entropy exhibit. Miniatures are labeled visual previews and do not fabricate live security values.
5. Research plate: actual DDoS baseline results and confusion counts imported from the current JSON. Clearly offline/historical and single-split; link into the real flow inspector.
6. Coursework index: all four coursework destinations, with the architecture entry retained. Full original academic text remains in the unchanged snapshot.
7. About: Mawutorwu Klu, TECH 3498 and skills drawn from existing coursework; direct access to original biography.
8. Footer: prototype status, full original workbench access and documentation.

## Design tokens

Ink `#0b0c10`; raised ink `#111218`; hairline `#282a33`; paper `#f2f0e9`; muted `#a9a8b2`; violet `#a89bff`; mint `#b6f5d1`. Mint is the primary action/signal, violet belongs to field structure. On light paper panels use ink text. Validate rendered contrast, not token names alone.

Primary typography uses the local system sans stack for a fast, reliable prototype; large editorial headlines use tight tracking with an optional Georgia italic for contrast. Labels/data use the system monospace stack. No remote font or image required. Maximum content width 1400px, 24–64px side gutters, 96–144px major section rhythm, 8px spacing base. Borders and open layouts replace repetitive elevated cards. Focus rings are mint, 3px, offset 4px.

Reusable components: SectionHeading, ProjectOrbit, ProjectLaunch, Exhibit, EvidenceStat, CourseworkRow, CommandDialog, MobileMenu and PrototypeNotice. All are semantic HTML/CSS/ES modules in this stage, with no shared production globals. Dialogs have native focus containment, Escape dismissal and explicit focus restoration. Mobile navigation remains ordinary links in a disclosure. No forced smooth scrolling or hover-only information.

## Architecture choices

**Now:** buildless HTML/CSS/JS prototype with native SVG and a small separately loaded field module. Existing runtime is frozen and linked; no new runtime library or package is installed. CSS and JS are separated for caching. Field animation is opt-in through user interaction and respects reduced-motion. No WebGL, external AI call, secrets, background microphone access or fake telemetry in the homepage.

**After approval:** evaluate React + TypeScript + Vite for the shell and reusable presentation components, retaining vanilla lab controllers behind explicit adapters until parity checks pass. [React supports adding components to an existing project](https://react.dev/learn/add-react-to-an-existing-project); avoid converting everything at once. [Vite GitHub Pages guidance](https://vite.dev/guide/static-deploy.html#github-pages) requires the correct repository base path. For `/personal/`, use that base or relative assets; test the exact deployment prefix. Keep hash navigation or static entry files, not unconfigured history routes that 404 on refresh.

| Candidate | Decision / rationale |
|---|---|
| React, TypeScript, Vite | Recommended only for approved shell migration. Useful component boundaries, typed adapters and production splitting; not necessary to ship this prototype. Confirm exact versions and lock dependencies at that stage. |
| Tailwind, shadcn/ui | Optional implementation helpers after approval; avoid a second style system now. [shadcn](https://ui.shadcn.com/docs) provides editable components, not a finished visual identity. Native dialogs suffice here. |
| React Bits / Aceternity / Magic UI | Defer. Their copy/paste effects do not justify introducing React and multiple visual systems for this stage. Verify per-component licenses/requirements before adopting any. |
| GSAP / Motion | Existing legacy GSAP is left intact. No new animation library in the prototype. If React motion is adopted later, honor [reduced motion](https://motion.dev/docs/react-reduced-motion) at the component boundary and check current licensing/version. |
| Three.js / R3F | Existing legacy scenes are retained. No new WebGL scene here: SVG/CSS achieves the concept with a smaller fallback-friendly asset. Consider WebGL only if tested interaction benefit warrants GPU/maintenance cost. |
| Rive | Defer: no authored asset, runtime or accessibility plan exists yet. |
| Lucide | Defer dependency; use a few original inline line icons with accessible text. Check license if a package is later adopted. |

No unverified package compatibility or licensing claim is needed because this prototype adds no package dependency. The inherited app's dependency/version/security review remains a migration task.
