# Assignment 6

The research question, fixed configuration and selection rule are in `protocol.json`. This is a validation-selected ensemble of traditional ML components using lexical and character representations, not a deep-learning or LLM experiment.

From `phishguard-ai`:
```powershell
.venv\Scripts\python.exe assignment6\experiment.py
.venv\Scripts\python.exe assignment6\verify_experiment.py
.venv\Scripts\python.exe assignment6\make_deliverables.py
```
Use the existing project environment. The dataset and trusted baseline models must exist first (see parent README). The notebook is original and reads actual experiment artifacts. Execute it in this directory using the project kernel. Retraining is a separate explicit command so opening the notebook does not silently change the experiment.

From the website root, export with `node build-assignment6.mjs` and validate with `node verify-assignment6.mjs`. The current single-file workbench contains the report and structured results for offline access. Do not run old reconstruction scripts. K.E.A.N. Tab 7's earlier precomputed-feature dataset is a separate experiment.

`submission.md` covers the requested problem, method, baseline, proposed change, experiments, results, XSS controls and limitations. Review it before submitting to Canvas. `verification.md` records actual tests. Large locally generated artifacts are ignored by Git. The deployed URL scanner's baseline models are unchanged.
