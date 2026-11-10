# PhishGuard AI — standalone Flutter + FastAPI

This is the current raw-URL research application. The older K.E.A.N. Tab 7 experiment, its `src/`, `web/`, `results/` and `docs/` artifacts remain separate and unchanged. Do not run `src/export_site.py` for this standalone project.

## Run on this Windows machine

Quick start: double-click `START-PHISHGUARD.cmd` in this folder. It starts loopback-only servers and opens http://127.0.0.1:8080. If PowerShell policy prevents the launcher, use the manual commands below without weakening your execution policy.

The generated HTML entry point is `flutter_app/build/web/index.html`; the editable HTML shell is `flutter_app/web/index.html`, and application source is `flutter_app/lib/main.dart`. Opening the HTML through `file://` shows setup instructions because Flutter and the API require HTTP. The separate K.E.A.N. file remains `../index-cmdk.html`.

## Tool features added 15 October 2026

- URL results retain the trained model verdict, with separately labelled rules for misleading subdomains, spelling lookalikes, IP addresses, user information and unusual structure. These observations are not causal explanations of the model.
- Live confidence percentages are hidden because the model is uncalibrated. Dataset evaluation metrics remain actual measured values.
- `/analyze-message` uses explicit rules for urgency, claimed identity, credentials and payment requests. It checks up to 10 unique links through the same prediction function. Text is handled as data, never HTML. No link is fetched.
- URL scans are saved in browser localStorage (100 entries maximum), with revisit, per-entry deletion and clear controls. Pasted messages and extracted-link scans are not saved. Message text is processed only by the configured backend; there is no third-party AI service.
- Recommended next steps are available from results and navigation, with FTC references.
- No new model, dataset or external API key is required. Run the backend to use inference; failures are explicit. Keep the same `127.0.0.1:8080` origin to retain the same local history.

## Manual startup

Terminal 1, from `phishguard-ai/backend`:
```powershell
..\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
Terminal 2, from `phishguard-ai/flutter_app`:
```powershell
..\.tools\flutter\bin\flutter.bat run -d web-server --web-hostname 127.0.0.1 --web-port 8080
```
Open http://127.0.0.1:8080. The API docs are at http://127.0.0.1:8000/docs.

For the built release, serve `flutter_app/build/web` on port 8080 using Python's `http.server 8080 --bind 127.0.0.1` from that directory while FastAPI runs.

## Reproduce from source

Use Python 3.12 and Flutter 3.47.7 / Dart 3.13.5. The tested Python environment and Dart lockfile pin dependencies. Install Flutter from https://docs.flutter.dev/install/manual; `.tools/flutter` is a local SDK, not committed source.

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r backend/requirements.txt
cd backend
..\.venv\Scripts\python.exe download_data.py
..\.venv\Scripts\python.exe train.py
..\.venv\Scripts\python.exe prepare_deliverables.py
..\.venv\Scripts\python.exe -m pytest tests -q
cd ../flutter_app
flutter pub get
flutter analyze
flutter test
flutter build web --no-web-resources-cdn
```

The training command uses all retained benign/phishing rows, not a sample. Expect several minutes and sufficient memory. Models and large raw/derived datasets are ignored by Git; retrain after cloning. Load only locally generated trusted joblib files. Hash checks detect accidental replacement, not malicious modification of both model and manifest.

## Source and experiment

Dataset: https://www.kaggle.com/datasets/sid321axn/malicious-urls-dataset · version 1 · Kaggle metadata lists CC0: Public Domain. Public archive downloaded without credentials on 2026-10-13. `backend/download_data.py` verifies the CSV SHA-256. Attribution is retained despite CC0.

The source columns are `url` and `type`. Use benign=0, phishing=1; exclude malware and defacement because they are not equivalent to phishing. The shared `backend/app/features.py` implements 19 lexical features, with no DNS/HTTP lookups. Missing schemes are interpreted as HTTP identically during training and inference. This is an assumption, not evidence of the original protocol.

See `reports/report.md`, `reports/proposal.md`, `presentation/outline.md`, `docs/standalone-methodology.md`, `notebooks/raw_url_research.ipynb`, and `backend/models/metrics.json`. Run the notebook with the project Python kernel from its `notebooks` directory. It recomputes EDA from the real prepared data and verifies saved test predictions; `backend/train.py` trains both pipelines.

## Security

No API key is needed. URLs are processed locally and never visited. The API accepts only bounded HTTP(S) URL strings. CORS allows only localhost/127.0.0.1 on port 8080. Keep the server bound to loopback for the classroom demo. A remote deployment needs explicit hosting, HTTPS, rate limits and an approved CORS origin. Backend failures show explicit errors; no mock prediction is substituted.

Probabilities are uncalibrated. Predicted Legitimate never means guaranteed safe. Source bias, historical labels and lexical-only features limit generalization. All metrics are a single held-out experiment, not five-fold performance or production assurance.

## Integration

`index-cmdk.html` was not modified. See `docs/integration-plan.md`; integration requires approval.
