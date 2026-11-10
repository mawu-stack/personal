import 'dart:convert';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'api.dart';
import 'history.dart';
import 'tool_views.dart';

void main() => runApp(const PhishGuard());
const blue = Color(0xff408cff),
    teal = Color(0xff28c9ab),
    amber = Color(0xffffb85c);
String pct(dynamic n) => '${((n as num) * 100).toStringAsFixed(1)}%';
String title(String s) => s
    .split('_')
    .map((s) => s.isEmpty ? s : '${s[0].toUpperCase()}${s.substring(1)}')
    .join(' ');
Widget txt(String s, {double size = 15, Color? color, bool bold = false}) =>
    Text(
      s,
      style: TextStyle(
        fontSize: size,
        color: color,
        fontWeight: bold ? FontWeight.w700 : FontWeight.normal,
        height: 1.5,
      ),
    );
const gap = SizedBox(height: 24);

class PhishGuard extends StatefulWidget {
  final PhishApi? api;
  const PhishGuard({super.key, this.api});
  @override
  State<PhishGuard> createState() => _PhishGuardState();
}

class _PhishGuardState extends State<PhishGuard> {
  bool dark = true;
  @override
  Widget build(BuildContext context) => MaterialApp(
    title: 'PhishGuard AI',
    debugShowCheckedModeBanner: false,
    theme: ThemeData(
      useMaterial3: true,
      brightness: dark ? Brightness.dark : Brightness.light,
      colorScheme: ColorScheme.fromSeed(
        seedColor: blue,
        brightness: dark ? Brightness.dark : Brightness.light,
      ),
      scaffoldBackgroundColor: dark
          ? const Color(0xff0a1220)
          : const Color(0xfff2f5fa),
      cardTheme: CardThemeData(
        elevation: 0,
        color: dark ? const Color(0xff131f31) : Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(18),
          side: BorderSide(
            color: dark ? const Color(0xff26344a) : const Color(0xffdbe2ed),
          ),
        ),
      ),
      inputDecorationTheme: const InputDecorationTheme(
        border: OutlineInputBorder(),
        filled: true,
      ),
    ),
    home: Dashboard(
      api: widget.api ?? PhishApi(),
      toggleTheme: () => setState(() => dark = !dark),
    ),
  );
}

class Dashboard extends StatefulWidget {
  final PhishApi api;
  final VoidCallback toggleTheme;
  const Dashboard({super.key, required this.api, required this.toggleTheme});
  @override
  State<Dashboard> createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard> {
  Map<String, dynamic>? data, result;
  String? error, scanError;
  bool busy = false, loading = true;
  int page = 1;
  final history = ScanHistory();
  String model = 'random_forest', feature = 'length', metric = 'f1';
  final input = TextEditingController();
  final names = [
    'Overview',
    'URL Scanner',
    'Dataset Explorer',
    'Model Comparison',
    'Security Insights',
    'Development Log',
    'Documentation',
    'Message Checker',
    'Scan History',
    'Next Steps',
  ];
  final icons = [
    Icons.dashboard_outlined,
    Icons.radar,
    Icons.dataset_outlined,
    Icons.analytics_outlined,
    Icons.shield_outlined,
    Icons.timeline,
    Icons.description_outlined,
    Icons.mail_outline,
    Icons.history,
    Icons.support,
  ];
  @override
  void initState() {
    super.initState();
    load();
  }

  @override
  void dispose() {
    input.dispose();
    history.dispose();
    super.dispose();
  }

  Future<void> load() async {
    setState(() {
      loading = true;
      error = null;
    });
    try {
      final d = await widget.api.metrics();
      if (mounted) setState(() => data = d);
    } catch (e) {
      if (mounted) setState(() => error = e.toString());
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  Future<void> scan() async {
    if (input.text.trim().isEmpty) {
      setState(() => scanError = 'Enter a URL first.');
      return;
    }
    setState(() {
      busy = true;
      result = null;
      scanError = null;
    });
    try {
      final submittedUrl = input.text.trim();
      final r = await widget.api.predict(submittedUrl, model);
      if (mounted) {
        history.save(submittedUrl, r);
        setState(() => result = r);
      }
    } catch (e) {
      if (mounted) setState(() => scanError = e.toString());
    } finally {
      if (mounted) setState(() => busy = false);
    }
  }

  Widget heading(String eyebrow, String value, String description) => Padding(
    padding: const EdgeInsets.only(bottom: 28),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        txt(eyebrow.toUpperCase(), size: 12, bold: true, color: blue),
        const SizedBox(height: 10),
        txt(value, size: 34, bold: true),
        const SizedBox(height: 8),
        txt(description),
      ],
    ),
  );
  Widget box(String label, List<Widget> children) => Card(
    margin: EdgeInsets.zero,
    child: Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          txt(label, size: 18, bold: true),
          const SizedBox(height: 18),
          ...children,
        ],
      ),
    ),
  );
  Widget notice(String s) => Container(
    width: double.infinity,
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(
      color: blue.withValues(alpha: .12),
      borderRadius: BorderRadius.circular(12),
    ),
    child: txt(s),
  );
  Widget grid(List<Widget> items) => LayoutBuilder(
    builder: (context, c) {
      final columns = c.maxWidth > 850 ? 2 : 1;
      final width = (c.maxWidth - (columns - 1) * 24) / columns;
      return Wrap(
        spacing: 24,
        runSpacing: 24,
        children: items.map((w) => SizedBox(width: width, child: w)).toList(),
      );
    },
  );
  Widget stat(String label, String value) =>
      box(label, [txt(value, size: 32, bold: true, color: blue)]);
  Widget bar(String label, num value, {Color color = blue, String? trailing}) =>
      Padding(
        padding: const EdgeInsets.only(bottom: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(child: txt(label, size: 13)),
                txt(trailing ?? pct(value), size: 13, bold: true),
              ],
            ),
            const SizedBox(height: 7),
            LinearProgressIndicator(
              value: value.toDouble().clamp(0, 1),
              minHeight: 9,
              borderRadius: BorderRadius.circular(5),
              color: color,
              backgroundColor: color.withValues(alpha: .12),
            ),
          ],
        ),
      );
  @override
  Widget build(BuildContext context) => LayoutBuilder(
    builder: (context, c) {
      final wide = c.maxWidth >= 1000;
      return Scaffold(
        appBar: AppBar(
          title: Row(
            children: [
              const Icon(Icons.security, color: blue),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  'PhishGuard AI',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
          actions: [
            IconButton(
              tooltip: 'Toggle light/dark theme',
              onPressed: widget.toggleTheme,
              icon: const Icon(Icons.contrast),
            ),
            IconButton(
              tooltip: 'Reconnect backend',
              onPressed: load,
              icon: const Icon(Icons.refresh),
            ),
          ],
        ),
        drawer: wide ? null : Drawer(child: SafeArea(child: nav(drawer: true))),
        body: Row(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (wide) SizedBox(width: 240, child: nav()),
            Expanded(
              child: SingleChildScrollView(
                key: ValueKey(page),
                padding: EdgeInsets.all(c.maxWidth < 600 ? 16 : 36),
                child: Center(
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 1180),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(
                              error != null
                                  ? Icons.cloud_off
                                  : loading
                                  ? Icons.hourglass_top
                                  : Icons.check_circle_outline,
                              size: 16,
                              color: error != null ? amber : teal,
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: txt(
                                error != null
                                    ? 'Backend unavailable'
                                    : loading
                                    ? 'Connecting to local backend…'
                                    : 'LOCAL INFERENCE · NO URL VISITS',
                                size: 11,
                                bold: true,
                              ),
                            ),
                          ],
                        ),
                        gap,
                        if (error != null) ...[notice(error!), gap],
                        if (loading) const LinearProgressIndicator(),
                        if (page == 1)
                          scanner()
                        else if (page == 7)
                          MessageChecker(
                            api: widget.api,
                            nextSteps: () => setState(() => page = 9),
                          )
                        else if (page == 8)
                          HistoryView(
                            history: history,
                            revisit: (e) => setState(() {
                              input.text = e['url'];
                              result = Map<String, dynamic>.from(e['result']);
                              page = 1;
                              scanError = null;
                            }),
                          )
                        else if (page == 9)
                          const NextSteps()
                        else if (page == 5)
                          logView()
                        else if (page == 6)
                          docs()
                        else if (data != null)
                          switch (page) {
                            0 => overview(),
                            2 => explorer(),
                            3 => comparison(),
                            _ => insights(),
                          }
                        else
                          notice(
                            'Start the Python backend to load real research results. No sample metrics are substituted.',
                          ),
                        gap,
                        txt(
                          'EDUCATIONAL RESEARCH PROTOTYPE · Predictions are not safety guarantees.',
                          size: 11,
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      );
    },
  );
  Widget nav({bool drawer = false}) => ListView(
    padding: const EdgeInsets.all(16),
    children: [
      Padding(
        padding: const EdgeInsets.symmetric(vertical: 24),
        child: txt('RESEARCH WORKSPACE', size: 11, bold: true, color: blue),
      ),
      for (final i in [1, 7, 8, 9, 0, 2, 3, 4, 5, 6])
        Padding(
          padding: const EdgeInsets.only(bottom: 6),
          child: ListTile(
            selected: page == i,
            selectedTileColor: blue.withValues(alpha: .12),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            leading: Icon(icons[i]),
            title: txt(names[i], size: 14),
            onTap: () {
              setState(() => page = i);
              if (drawer) Navigator.pop(context);
            },
          ),
        ),
      gap,
      txt('Python + scikit-learn\nFastAPI + Flutter', size: 12),
    ],
  );
  Widget overview() {
    final d = data!['dataset'];
    final models = data!['models'] as Map;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        heading(
          'Machine learning / research lab',
          'Examine the URL.\nUnderstand the risk.',
          'Can machine learning accurately identify phishing URLs, while balancing threat detection and false alarms?',
        ),
        FilledButton.icon(
          onPressed: () => setState(() => page = 1),
          icon: const Icon(Icons.radar),
          label: const Text('Open live URL scanner'),
        ),
        gap,
        grid([
          stat('Records retained', d['retained'].toString()),
          stat('Lexical features', d['feature_count'].toString()),
          for (final e in models.entries)
            stat('${title(e.key)} · test F1', pct(e.value['f1'])),
        ]),
        gap,
        box('Evidence before verdict', [
          txt(
            'Raw URLs → local lexical features → domain-separated holdout → two saved pipelines → real FastAPI inference.',
          ),
          gap,
          txt(data!['split']['method']),
          gap,
          notice(
            'The previous K.E.A.N. experiment used precomputed features. This is a separate raw-URL experiment; its results must not be mixed with that dashboard.',
          ),
        ]),
      ],
    );
  }

  Widget scanner() => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      heading(
        'Live URL scanner',
        'Inspect without visiting.',
        'A real trained model analyzes lexical signals locally. The server never opens or fetches your URL.',
      ),
      box('Analyze a URL', [
        TextField(
          enabled: !busy,
          controller: input,
          maxLength: 2048,
          decoration: const InputDecoration(
            labelText: 'URL',
            hintText: 'https://example.com/account',
          ),
          onSubmitted: busy ? null : (_) => scan(),
        ),
        const Text(
          'URL checks are saved in this browser on your device. Manage or clear them in Scan History. Avoid pasting URLs containing private tokens.',
        ),
        gap,
        DropdownButtonFormField<String>(
          isExpanded: true,
          initialValue: model,
          decoration: const InputDecoration(labelText: 'Model'),
          items: const [
            DropdownMenuItem(
              value: 'random_forest',
              child: Text('Random Forest'),
            ),
            DropdownMenuItem(
              value: 'logistic_regression',
              child: Text('Logistic Regression'),
            ),
          ],
          onChanged: busy
              ? null
              : (v) => setState(() {
                  model = v!;
                  result = null;
                }),
        ),
        gap,
        FilledButton.icon(
          onPressed: busy ? null : scan,
          icon: busy
              ? const SizedBox(
                  width: 18,
                  height: 18,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              : const Icon(Icons.search),
          label: Text(busy ? 'Analyzing…' : 'Analyze URL'),
        ),
        if (scanError != null) ...[gap, notice(scanError!)],
      ]),
      if (result != null) ...[
        gap,
        ScanResult(result: result!, nextSteps: () => setState(() => page = 9)),
        if (history.error != null) notice(history.error!),
      ],
    ],
  );
  Widget explorer() {
    final d = data!['dataset'];
    final classes = d['classes'] as Map;
    final hist = data!['histograms'][feature];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        heading(
          'Dataset explorer',
          'Know the evidence.',
          'Kaggle · Malicious URLs dataset · version 1 · CC0. Only benign and phishing labels enter this binary experiment.',
        ),
        grid([
          box('Class distribution', [
            for (final e in classes.entries)
              bar(
                title(e.key),
                e.value / d['retained'],
                color: e.key == 'phishing' ? amber : teal,
                trailing: e.value.toString(),
              ),
          ]),
          box('Data audit', [
            txt('${d['raw_rows']} raw rows · 2 source columns'),
            txt('Missing source cells: ${d['missing']}'),
            txt('Exact raw duplicates: ${d['raw_duplicates']}'),
            txt('Invalid binary URLs removed: ${d['invalid_binary_rows']}'),
            txt(
              'Conflicting-label rows removed: ${d['conflicting_rows_removed']}',
            ),
            txt(
              'Canonical duplicates removed: ${d['canonical_duplicates_removed']}',
            ),
            txt('Retained: ${d['retained']}'),
          ]),
        ]),
        gap,
        box('Feature distributions', [
          DropdownButton<String>(
            isExpanded: true,
            value: feature,
            items: (data!['features'] as List)
                .map(
                  (f) => DropdownMenuItem(
                    value: f.toString(),
                    child: Text(title(f)),
                  ),
                )
                .toList(),
            onChanged: (v) => setState(() => feature = v!),
          ),
          const Text('Teal: benign · amber: phishing · raw counts per bin'),
          const SizedBox(height: 12),
          SizedBox(
            height: 200,
            width: double.infinity,
            child: CustomPaint(
              painter: HistogramPainter(
                (hist['benign'] as List).cast<num>(),
                (hist['phishing'] as List).cast<num>(),
              ),
            ),
          ),
          txt(
            'Bin edges: ${(hist['edges'] as List).map((x) => (x as num).toStringAsFixed(1)).join(' · ')}',
            size: 11,
          ),
        ]),
        gap,
        box('Pearson correlation · lexical features', [
          txt(
            'Tap or hover over a cell to inspect the pair. Association is not causation.',
            size: 13,
          ),
          gap,
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Column(
              children: [
                for (var i = 0; i < (data!['features'] as List).length; i++)
                  Row(
                    children: [
                      SizedBox(
                        width: 150,
                        child: txt(data!['features'][i], size: 11),
                      ),
                      for (
                        var j = 0;
                        j < (data!['features'] as List).length;
                        j++
                      )
                        Tooltip(
                          message:
                              '${data!['features'][i]} / ${data!['features'][j]}: ${(data!['correlation'][i][j] as num).toStringAsFixed(2)}',
                          triggerMode: TooltipTriggerMode.tap,
                          child: Container(
                            width: 25,
                            height: 25,
                            margin: const EdgeInsets.all(1),
                            color: Color.lerp(
                              const Color(0xff26344a),
                              (data!['correlation'][i][j] as num) >= 0
                                  ? teal
                                  : amber,
                              (data!['correlation'][i][j] as num)
                                  .abs()
                                  .toDouble(),
                            ),
                          ),
                        ),
                    ],
                  ),
              ],
            ),
          ),
        ]),
      ],
    );
  }

  Widget comparison() {
    final models = data!['models'] as Map;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        heading(
          'Model evaluation',
          'Measure the trade-offs.',
          'Both models share the same domain-disjoint holdout. Positive class = phishing. Threshold = 0.5.',
        ),
        notice(
          '${data!['split']['train']} train / ${data!['split']['test']} test · seed 42 · zero shared registrable domains',
        ),
        gap,
        box('Compare test metrics', [
          DropdownButton<String>(
            value: metric,
            items:
                [
                      'accuracy',
                      'precision',
                      'recall',
                      'f1',
                      'roc_auc',
                      'fpr',
                      'fnr',
                    ]
                    .map(
                      (m) => DropdownMenuItem(value: m, child: Text(title(m))),
                    )
                    .toList(),
            onChanged: (v) => setState(() => metric = v!),
          ),
          for (final e in models.entries)
            bar(
              title(e.key),
              e.value[metric],
              color: e.key == 'random_forest' ? blue : teal,
            ),
          txt(
            'Higher is better except false-positive rate (FPR) and false-negative rate (FNR).',
            size: 12,
          ),
        ]),
        gap,
        grid([
          for (final e in models.entries)
            box(title(e.key), [
              for (final m in [
                'accuracy',
                'precision',
                'recall',
                'f1',
                'roc_auc',
                'fpr',
                'fnr',
              ])
                Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Row(
                    children: [
                      Expanded(child: txt(title(m), size: 13)),
                      txt(pct(e.value[m]), bold: true),
                    ],
                  ),
                ),
              const Divider(),
              txt(
                'Confusion matrix · rows actual / columns predicted',
                size: 12,
              ),
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: DataTable(
                  columnSpacing: 18,
                  columns: const [
                    DataColumn(label: Text('Actual')),
                    DataColumn(label: Text('Legit.')),
                    DataColumn(label: Text('Phish.')),
                  ],
                  rows: [
                    for (var i = 0; i < 2; i++)
                      DataRow(
                        cells: [
                          DataCell(Text(i == 0 ? 'Legit.' : 'Phish.')),
                          DataCell(
                            Text('${e.value['confusion_matrix'][i][0]}'),
                          ),
                          DataCell(
                            Text('${e.value['confusion_matrix'][i][1]}'),
                          ),
                        ],
                      ),
                  ],
                ),
              ),
            ]),
        ]),
        gap,
        box('ROC curves', [
          const Text('Teal: Logistic Regression · blue: Random Forest'),
          const SizedBox(height: 16),
          SizedBox(
            height: 240,
            width: double.infinity,
            child: CustomPaint(painter: RocPainter(models)),
          ),
          txt(
            'x: False-positive rate (0–1) · y: True-positive rate (0–1)',
            size: 12,
          ),
        ]),
      ],
    );
  }

  Widget insights() {
    final importance = data!['models']['random_forest']['importance'] as List;
    final maximum = (importance.first['value'] as num).toDouble();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        heading(
          'Security insights',
          'A signal, not a verdict.',
          'A false negative can expose a user to credential theft. A false positive disrupts legitimate browsing and erodes trust.',
        ),
        grid([
          box('Random Forest feature importance', [
            for (final e in importance.take(10))
              bar(
                title(e['feature']),
                e['value'] / maximum,
                trailing: (e['value'] as num).toStringAsFixed(3),
              ),
            txt(
              'Training impurity importance; biased toward high-cardinality features. Not causal attribution.',
              size: 12,
            ),
          ]),
          box('Limits & difficult cases', [
            for (final line in data!['limitations']) ...[
              txt('• $line'),
              const SizedBox(height: 12),
            ],
            txt(
              'Short legitimate domains can be compromised. Long tracking URLs can be benign. HTTPS indicates transport encryption, not legitimacy.',
            ),
            gap,
            txt(
              'Before deployment: external and temporal validation, calibration, privacy controls, rate limits, model drift monitoring and human review.',
            ),
          ]),
        ]),
      ],
    );
  }

  Widget logView() => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      heading(
        'Development log',
        'An auditable research trail.',
        'Dates and statuses come from the version-controlled project log.',
      ),
      FutureBuilder<String>(
        future: rootBundle.loadString('assets/development-log.json'),
        builder: (context, s) {
          if (!s.hasData) {
            return txt(
              s.hasError ? 'Unable to load development log.' : 'Loading log…',
            );
          }
          return Column(
            children: (jsonDecode(s.data!) as List)
                .map(
                  (r) => Padding(
                    padding: const EdgeInsets.only(bottom: 20),
                    child: box('${r['date']} · ${r['task']}', [
                      txt(r['status'], color: blue, bold: true),
                      txt(r['completed']),
                      txt('Issue: ${r['issues']}'),
                      txt('Next: ${r['next']}'),
                    ]),
                  ),
                )
                .toList(),
          );
        },
      ),
    ],
  );
  Widget docs() => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      heading(
        'Project documentation',
        'Reproduce. Review. Present.',
        'Read the bundled research documents. The scanner never opens submitted URLs.',
      ),
      for (final e in {
        'README': 'README.md',
        'Proposal': 'proposal.md',
        'Report': 'report.md',
        'Presentation outline': 'presentation.md',
        'References & methodology': 'methodology.md',
      }.entries)
        Padding(
          padding: const EdgeInsets.only(bottom: 16),
          child: box(e.key, [
            FutureBuilder<String>(
              future: rootBundle.loadString('assets/${e.value}'),
              builder: (context, s) => ExpansionTile(
                title: Text('Read ${e.key}'),
                children: [
                  SelectableText(
                    s.data ??
                        (s.hasError ? 'Document unavailable.' : 'Loading…'),
                  ),
                ],
              ),
            ),
          ]),
        ),
    ],
  );
}

class HistogramPainter extends CustomPainter {
  final List<num> a, b;
  HistogramPainter(this.a, this.b);
  @override
  void paint(Canvas c, Size s) {
    final maxV = [
      ...a,
      ...b,
    ].fold<double>(1, (v, x) => math.max(v, x.toDouble()));
    final w = s.width / a.length;
    for (var i = 0; i < a.length; i++) {
      c.drawRect(
        Rect.fromLTWH(
          i * w,
          s.height - a[i] / maxV * s.height,
          w * .42,
          a[i] / maxV * s.height,
        ),
        Paint()..color = teal,
      );
      c.drawRect(
        Rect.fromLTWH(
          i * w + w * .45,
          s.height - b[i] / maxV * s.height,
          w * .42,
          b[i] / maxV * s.height,
        ),
        Paint()..color = amber,
      );
    }
  }

  @override
  bool shouldRepaint(covariant HistogramPainter old) => true;
}

class RocPainter extends CustomPainter {
  final Map models;
  RocPainter(this.models);
  @override
  void paint(Canvas c, Size s) {
    final grid = Paint()
      ..color = Colors.grey.withValues(alpha: .3)
      ..strokeWidth = 1;
    for (var i = 0; i <= 4; i++) {
      c.drawLine(
        Offset(i * s.width / 4, 0),
        Offset(i * s.width / 4, s.height),
        grid,
      );
      c.drawLine(
        Offset(0, i * s.height / 4),
        Offset(s.width, i * s.height / 4),
        grid,
      );
    }
    c.drawLine(Offset(0, s.height), Offset(s.width, 0), grid);
    var i = 0;
    for (final e in models.entries) {
      final path = Path();
      bool first = true;
      for (final p in e.value['roc']) {
        final x = (p['x'] as num).toDouble() * s.width,
            y = (1 - (p['y'] as num).toDouble()) * s.height;
        if (first) {
          path.moveTo(x, y);
          first = false;
        } else {
          path.lineTo(x, y);
        }
      }
      c.drawPath(
        path,
        Paint()
          ..color = (i++ == 0 ? teal : blue)
          ..strokeWidth = 3
          ..style = PaintingStyle.stroke,
      );
    }
  }

  @override
  bool shouldRepaint(covariant RocPainter old) => false;
}
