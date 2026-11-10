import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:phishguard_ai/api.dart';
import 'package:phishguard_ai/main.dart';

void main() {
  final metrics = File('../backend/models/metrics.json').readAsStringSync();
  PhishApi api({bool fail = false}) => PhishApi(
    client: MockClient((r) async {
      if (r.url.path == '/metrics') return http.Response(metrics, 200);
      if (fail) throw http.ClientException('offline');
      final body = jsonDecode(r.body);
      expect(body['url'], 'https://example.com/account');
      expect(body['model'], 'random_forest');
      // Explicit test double: no synthetic prediction is included in production.
      return http.Response(
        jsonEncode({
          'label': 'Predicted Legitimate',
          'class': 0,
          'model': body['model'],
          'phishing_probability': .2,
          'observations': ['Test observation'],
          'features': {'length': 27},
          'explanation_note': 'Test-only response',
          'warning': 'Not a guarantee.',
        }),
        200,
      );
    }),
  );
  testWidgets('Scanner submits input, shows response, validates empty input', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(1440, 1000);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    await tester.pumpWidget(PhishGuard(api: api()));
    await tester.pumpAndSettle();
    expect(find.text('Analyze a URL'), findsOneWidget);
    await tester.tap(find.text('URL Scanner'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Analyze URL'));
    await tester.pumpAndSettle();
    expect(find.text('Enter a URL first.'), findsOneWidget);
    await tester.enterText(
      find.byType(TextField),
      'https://example.com/account',
    );
    await tester.tap(find.text('Analyze URL'));
    await tester.pumpAndSettle();
    expect(find.text('Predicted Legitimate'), findsOneWidget);
    expect(find.text('20.0% phishing probability'), findsNothing);
    expect(tester.takeException(), isNull);
  });
  testWidgets('Backend failure is visible and no verdict is substituted', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(1440, 1000);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    await tester.pumpWidget(PhishGuard(api: api(fail: true)));
    await tester.pumpAndSettle();
    await tester.tap(find.text('URL Scanner'));
    await tester.pumpAndSettle();
    await tester.enterText(
      find.byType(TextField),
      'https://example.com/account',
    );
    await tester.tap(find.text('Analyze URL'));
    await tester.pumpAndSettle();
    expect(find.textContaining('No prediction was generated'), findsOneWidget);
    expect(find.text('Predicted Legitimate'), findsNothing);
  });
  testWidgets('Every section lays out at mobile width and theme switches', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(390, 844);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    await tester.pumpWidget(PhishGuard(api: api()));
    await tester.pumpAndSettle();
    for (final name in [
      'URL Scanner',
      'Dataset Explorer',
      'Model Comparison',
      'Security Insights',
      'Message Checker',
      'Scan History',
      'Next Steps',
    ]) {
      await tester.tap(find.byTooltip('Open navigation menu'));
      await tester.pumpAndSettle();
      await tester.ensureVisible(find.text(name));
      await tester.tap(find.text(name));
      await tester.pumpAndSettle();
      expect(tester.takeException(), isNull, reason: name);
    }
    await tester.tap(find.byTooltip('Toggle light/dark theme'));
    await tester.pumpAndSettle();
    expect(tester.takeException(), isNull);
  });
  test('HTTP errors are surfaced', () async {
    final client = PhishApi(
      client: MockClient(
        (r) async =>
            http.Response('{"detail":"Model initialization failed"}', 503),
      ),
    );
    await expectLater(client.metrics(), throwsException);
  });
}
