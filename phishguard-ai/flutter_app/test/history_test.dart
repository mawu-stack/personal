import 'package:flutter_test/flutter_test.dart';
import 'package:phishguard_ai/history.dart';

void main() {
  test('History persists, reopens, deletes and clears only URL records', () {
    String? persisted;
    final h = ScanHistory(read: () => persisted, write: (s) => persisted = s);
    h.save('https://example.com', {
      'label': 'Predicted Legitimate',
      'findings': [],
    });
    final reopened = ScanHistory(
      read: () => persisted,
      write: (s) => persisted = s,
    );
    expect(reopened.entries.single['url'], 'https://example.com');
    expect(reopened.entries.single.containsKey('text'), false);
    reopened.remove(reopened.entries.single['id']);
    expect(reopened.entries, isEmpty);
    reopened.save('https://example.org', {'label': 'Potential Phishing'});
    reopened.clear();
    expect(persisted, '[]');
  });
  test('Storage errors are visible and do not claim a successful save', () {
    final h = ScanHistory(
      read: () => null,
      write: (_) => throw StateError('quota'),
    );
    h.save('https://example.com', {'label': 'test'});
    expect(h.error, isNotNull);
    expect(h.entries, isEmpty);
    final malformed = ScanHistory(read: () => '<script>', write: (_) {});
    expect(malformed.error, isNotNull);
    expect(malformed.entries, isEmpty);
  });
}
