# Assignment 7 — DoS/DDoS Attacks, Website Availability, and AI Movie Creation

Requirements-based audit against the professor's instructions supplied by the student in this conversation. No separate points rubric was provided. **Assignment 7 is not complete.** No deployment was performed.

## Part 1 — Cybersecurity research

| Requirement | Status | File-level evidence and gap |
| --- | --- | --- |
| Public Kaggle/Hugging Face DoS/DDoS dataset | Complete | `workbench.html`, Lab 07 `#dg-data`: Kaggle dhoogla/cicddos2019 link and original CIC citation. `ddos-guard/results/metrics.json`: source, 17 source filenames, row counts and recorded SHA-256s. Existing Parquet files are present under `ddos-guard/data/flows/`. No data was downloaded in this task. |
| Normal versus attack traffic | Complete | `#dg-classes`, `#dg-hist` in `workbench.html`; `ddos-guard/controller.js` normalizes benign/attack feature histograms by class. `#dg-guide` warns that a single flow cannot establish a coordinated flood. |
| Traffic volume and abnormal patterns | Partial | Flow Packets/s, Flow Bytes/s and duration distributions exist, with per-class normalization. There is no time-window aggregate request/load analysis or measured website response-time study. The latter are gaps in the current explanation/evidence, not invented additional grading criteria or fabricated telemetry. |
| Detection methods | Complete | `#dg-scan` and `ddos-guard/controller.js` implement the exported decision tree. `ddos-guard/protocol.md` and `train.py` define the fixed tree/forest comparison. Browser tree decisions are triage signals, not live detection. |
| Research objectives | Partial | Explicit objectives and research question exist in `ddos-guard/submission.md`, but its title remains Assignment 6 and they are not clearly presented in Lab 07. Consolidate the existing objectives into the Assignment 7 website write-up before submission. |
| Dataset details and preprocessing | Complete | `#dg-data` explains mirror partitions, features, training-only imputation, overlap exclusions and limitations. `protocol.md`, `train.py` and stored metrics provide supporting details. Training was not rerun. |
| Visualizations | Complete | Lab 07 has model comparison bars, three feature distributions, two ROC curves and two confusion matrices. Data is stored experiment output, not generated artwork or live measurements. |
| Results and ML metrics | Complete | `#dg-model-table`, `#dg-confusion` and `#research-errors`; metric provenance and arithmetic verified below. |
| Conclusions | Partial | The negative result and trade-off are stated in `ddos-guard/submission.md`: forest has fewer false alarms but lower recall/F1. Lab 07 allows investigating counts but lacks a clear standalone Assignment 7 conclusion paragraph. |
| Limitations | Complete | Existing Lab 07 text covers historical mirror, feature-pattern versus host/time independence, no calibrated confidence, and no live monitoring. `submission.md` adds single-split, class imbalance and generalization caveats. |

## Displayed metric provenance

`workbench.html`'s `script#ddos-results` is **structurally identical** to `ddos-guard/results/metrics.json`. The original inline controller renders its counters, charts, examples and model table from that JSON. `platform.js`'s error investigator uses `window.DDoSGuard.results`, not a separate invented dataset. `research-data.js` contains a small homepage summary; it was left unchanged.

| Model | Precision | Recall | F1 | Accuracy | False-positive rate |
| --- | --- | --- | --- | --- | --- |
| Decision tree | 99.8929% | 86.5061% | 92.7188% | 89.0766% | 0.3803% |
| Random forest | 99.9796% | 85.5002% | 92.1747% | 88.3285% | 0.0717% |

Matrices (rows actual benign/attack, columns predicted benign/attack): tree `[[36149,138],[20083,128747]]`; forest `[[36261,26],[21580,127250]]`. Each totals **185,117 held-out flows**; retained training is **93,696**. Raw source label counts sum to **431,371**; these are not retained sample counts. The recorded overlap exclusion is **26,328**.

Precision, recall, F1, accuracy and false-positive rate were independently recomputed from these matrices, matching the stored values to numerical tolerance. Retained class counts sum to the held-out total. This verifies artifact consistency; it does not prove the experiment was scientifically independent or reproduce training.

ROC curves, AUC, average precision, distributions and measured historical training times trace to `ddos-guard/train.py` and `results/metrics.json`. No raw held-out score/label vectors are exported for independent AUC recomputation. Histograms cannot be recreated from JSON alone. Raw Parquet files were not processed and their recorded hashes were not recomputed in this lightweight task. These deeper reproducibility checks are **Not Verified**, not claimed as passed. The browser model is a compact numeric decision tree, not generative AI or GPU inference.

## Part 2 — AI movie

| Requirement | Status | Evidence and gap |
| --- | --- | --- |
| Educational AI-generated cybersecurity movie | Partial | Existing `film/under-siege/under-siege-ltx-draft.mp4`, copied unchanged into `kean-v2/media/`. Approximately five seconds, 1024×1536 portrait. It introduces an analyst/dashboard, not the full attack/detection/recovery story. |
| Exported video embedded in existing website | Partial | New native `video#a7-movie-video` inside Lab 07 `#research-movie`, constructed by the existing `platform.js` adapter. Preview only. Exact label: “AI Movie Preview — Full Film in Production.” Full film is missing. |
| Published playback verified | Not Verified | Not deployed and no published URL was tested. Local testing cannot satisfy this requirement. |
| Non-Google alternative approved | Not Verified | Existing preview was generated online with LTX via a public service. Professor approval is still required. No Google service, local generation or new video generation was used for this integration. |

Additional online scene prompts are in `docs/assignment7-online-prompts.md`. They are preparation, not generated footage. Final film, continuity review and final educational narrative remain missing. Captions should be prepared for the finished edit; no unverified speech transcription is attached to the draft.

## Part 3 — Submission

| Requirement | Status | Evidence and gap |
| --- | --- | --- |
| Research and movie on existing website | Partial | Research is in Lab 07; only the preview is embedded. Objectives/conclusions should be consolidated under Assignment 7, and full movie must replace preview. |
| Published website works | Not Verified | No deployment authorized or performed; published player, routes and media delivery remain untested. |
| Published URL submitted through Blackboard/Canvas | Not Verified | No submission performed or confirmed. Do not infer submission from a local preview. |

## Changes in this task

- `platform.js`: replaced only Lab 07's missing-movie adapter block, added native player, exact preview label, description, file download, safe error state and one Lab 07 movie navigation link. Existing calculations/controllers remain unchanged.
- `a7-movie.css`: new styles scoped to Lab 07; portrait footage is contained without cropping or misleading stretching. Reuses existing theme variables. No autoplay, new animation or player dependency.
- `media/under-siege-ltx-draft.mp4`: byte-identical copy of the existing 933,923-byte source. No rendering, compression or transcoding.
- `build.mjs`: packages movie/CSS and local QA assets. `dist/`: regenerated local files only.
- `preview.cjs`: permits `video/mp4` and byte-range/HEAD requests for native seeking. It was edited and unit-tested without opening a server socket; no process started.
- Support: `add-a7-preview.mjs`, `finish-a7-preview.mjs`, `audit-a7.mjs`, `prepare-a7-test.mjs`, `a7-browser-test.js`, generated `a7-check.html`, this audit, prompts and `evidence/assignment7-metric-audit.json`.
- Rollback: `backups/pre-a7-preview/` contains original adapter/build/preview plus a protected-file hash manifest.

## Verification status

**PASS:** original panels and controllers remain byte-exact; protected Lab 05/Lab 02/gateway/theme/homepage source hashes unchanged; MP4 copies match SHA-256; metric arithmetic/JSON identity/counts; JS compilation; scoped CSS brace balance; static build. MP4 MIME, range, invalid-range and HEAD response logic passed using the real handler with a mocked listener (no socket or background process).

**Browser follow-up:** an existing localhost preview became reachable without starting a process. The first fixture run exposed test timing issues (login initialized on page load; tab changes complete asynchronously). The fixture now waits for both; production authentication/navigation code was not changed.

**PASS: 42 actual browser checks** covering original demo login and Lab 07 navigation; dataset/model counters; ROC rendering; three distribution selectors; four metric selectors; all 24 held-out example predictions and decision paths; opt-in history save/revisit/delete; invalid protocol and missing-field errors; original JSON export creation; error-investigator count; no captured runtime errors. History storage was restored after testing. Raw output: `evidence/assignment7-browser-tests.txt`.

**PASS: responsive containment** at 390px: no horizontal page overflow, movie section 335.2px, video 272px, native controls enabled, preview status unchanged. Desktop and mobile screenshots of the pending media state are `evidence/assignment7-desktop-pending.png` and `assignment7-mobile-pending.png`. Viewport override was reset.

**FAIL: current localhost media delivery — HTTP 404. Not Verified: playback, pause and seeking.** The MP4 exists in source and built media directories and matches the original checksum. The running preview appears to predate the new MP4 MIME/range handling and needs a foreground restart. The player correctly shows its unavailable-media fallback. A foreground restart was requested from the user; no process was stopped, started or restarted by the agent. Do not mistake research/UI passes for successful video playback. Published playback remains unverified regardless of local results.

The browser's earlier `file://` rejection was respected; no local-file URL-policy bypass or alternative browser surface was used. Testing proceeded only through the existing permitted HTTP localhost preview.

No software installed; no models or unknown files downloaded; no AI generation, training, GPU use, rendering or background process started. No deployment. Assignment 7 remains **in progress**.

## Local test instructions

If approved and started by the user, run `node kean-v2/preview.cjs` in a foreground terminal from the website folder. Leave that terminal visible; Ctrl+C stops it. If an older preview exists, stop it first to load MP4 serving support. The build has already been refreshed.

- Preview: `http://127.0.0.1:3513/personal/kean-v2/workbench.html#tab-7`
- Prepared local-only QA: `http://127.0.0.1:3513/personal/kean-v2/a7-check.html`
- Static audit: `node kean-v2/audit-a7.mjs` (terminates; does not train, render or start a server).

Do not publish until explicitly authorized. After the full approved film is available, embed it, verify it on the published site, then submit the verified URL through the course portal.
