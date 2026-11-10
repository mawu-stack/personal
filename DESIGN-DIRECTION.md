# Cybersecurity Workbench: Figma + coded prototype

## Scope

Refine the redesign first. Preserve all academic coursework and existing tools. Assignment 3 follows this visual stage. The existing working prototype is `index.html`.

## Researched references

- [Pulse — engineering metrics and incident response console, built with v0](https://v0.app/templates/3hZwaLtyRbc): relevant reference for operational status, incidents, and metric hierarchy. Adapt the information organization to educational security simulations; never import fabricated production metrics.
- [Tasko — v0 dashboard template](https://v0.app/templates/SGGKgsJdrxG), with its [running preview](https://v0-dashboard-ui-redesign-nine.vercel.app/): reference for separating navigation, summaries, analytics, and actions into understandable groups. Preserve the requested six-tab navigation instead of copying its sidebar.
- [Efferd Dashboard 2 — 21st.dev](https://21st.dev/@efferd/components/efferd-dashboard-2): reference for a dense metric grid with charts and an activity feed. Use deliberate panel spacing and consistent card anatomy.
- [21st.dev dashboard composition guide](https://21st.dev/blog/react-dashboard-components): one dominant metric, stable numeric widths, semantic status colors, and table equivalents for charts.
- [React Bits](https://reactbits.dev/): motion reference for selective headline reveals and card interactions. Keep the existing single-file JavaScript implementation and reduced-motion support.

The v0 examples are publicly listed as v0 templates. The component libraries are design resources, not evidence that every showcased site was AI-built. No external paid generation was run.

## Proposed next pass

1. Keep the large editorial hero on the overview. In active labs, favor a compact context header so the actual tools are immediately visible.
2. Establish a consistent card anatomy: eyebrow, title, primary value/action, supporting explanation, details disclosure.
3. Give STRIDE one primary control-coverage summary, the radar, and a readable table alternative. Keep simulation status explicit.
4. Keep cyan for interaction, emerald for enabled defenses, amber for partial coverage, and rose for exposure. Never use color as the only status signal.
5. Use fixed-width/tabular digits in timers and metrics, and reduce competing glow effects around dense tool content.
6. Make all six tabs discoverable on mobile, with a clear overflow affordance and keyboard access.

## Figma deliverable

Target team supplied by the user: `1685133885083562395`.

Create an editable Design file with a foundations page and composed desktop/mobile workbench views. Discover available library assets first, then use shared components and tokens for buttons, tabs, status pills, cards, and the telemetry dock. Capture the coded prototype as a layout reference once file access works. Keep generated illustration or 3D work separate from UI structure; it should support the emblem, not replace accessible controls.

Figma is connected. [Open the editable design file](https://www.figma.com/design/XXsB9g6E4thEGhsEpDkJum).

Delivered two overview compositions: desktop (1440 px) and mobile (390 px). Both use imported Simple Design System button, tab, and card instances, shared spacing, and the project's navy/cyan palette. The current website was captured as a reference; the temporary capture was removed after composing and visually checking the editable screens. The mobile composition exposes all six destinations vertically. These are design references, not interactive implementations of every lab. A full foundations library and individual lab screens are not included in this pass. Assignment 3 remains deferred until after the redesign.
