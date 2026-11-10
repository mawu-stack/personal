import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:phishguard_ai/api.dart';
import 'package:phishguard_ai/tool_views.dart';

void main() {
  testWidgets(
    'Message rules highlight literal text and show link failure honestly',
    (tester) async {
      final api = PhishApi(
        client: MockClient((r) async {
          expect(r.url.path, '/analyze-message');
          expect(
            jsonDecode(r.body)['text'],
            'urgent <script>alert(1)</script> https://example.com',
          );
          return http.Response(
            jsonEncode({
              'summary': 'Review warning signs',
              'findings': [
                {
                  'start': 0,
                  'end': 6,
                  'kind': 'Urgency',
                  'evidence': 'urgent',
                  'explanation': 'Check independently.',
                },
              ],
              'limitations': 'Rules can miss phishing.',
              'links_found': 1,
              'links_omitted': 0,
              'links': [
                {'url': 'https://example.com', 'error': 'Model unavailable'},
              ],
            }),
            200,
          );
        }),
      );
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: SingleChildScrollView(
              child: MessageChecker(api: api, nextSteps: () {}),
            ),
          ),
        ),
      );
      await tester.enterText(
        find.byType(TextField),
        'urgent <script>alert(1)</script> https://example.com',
      );
      await tester.tap(find.text('Check message'));
      await tester.pumpAndSettle();
      expect(find.text('Review warning signs'), findsOneWidget);
      expect(find.text('Not scanned: Model unavailable'), findsOneWidget);
      final rich = tester.widget<SelectableText>(
        find.byType(SelectableText).first,
      );
      expect(
        rich.textSpan!.toPlainText(),
        contains('<script>alert(1)</script>'),
      );
      expect(
        rich.textSpan!.children!
            .firstWhere((s) => s.toPlainText() == 'urgent')
            .style!
            .backgroundColor,
        isNotNull,
      );
      await tester.ensureVisible(find.text('Clear message'));
      await tester.tap(find.text('Clear message'));
      await tester.pumpAndSettle();
      expect(find.text('Review warning signs'), findsNothing);
    },
  );
}
