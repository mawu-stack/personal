import 'dart:convert';

import 'package:flutter/foundation.dart';

import 'history_storage.dart' as storage;

class ScanHistory extends ChangeNotifier {
  final String? Function() read;
  final void Function(String) write;
  List<Map<String, dynamic>> entries = [];
  String? error;
  ScanHistory({String? Function()? read, void Function(String)? write})
    : read = read ?? storage.readHistory,
      write = write ?? storage.writeHistory {
    try {
      final raw = this.read();
      if (raw != null) {
        if (raw.length > 2000000) {
          throw const FormatException('History too large');
        }
        final decoded = jsonDecode(raw) as List;
        entries = decoded
            .whereType<Map>()
            .where(
              (e) =>
                  e['id'] is String &&
                  e['url'] is String &&
                  e['date'] is String &&
                  e['result'] is Map,
            )
            .take(100)
            .map((e) => Map<String, dynamic>.from(e))
            .toList();
      }
    } catch (_) {
      error = 'Saved history could not be read. Clear history to reset it.';
    }
  }
  void save(String url, Map<String, dynamic> result) {
    final now = DateTime.now();
    _commit(
      [
        {
          'id': now.microsecondsSinceEpoch.toString(),
          'url': url,
          'date': now.toIso8601String(),
          'result': result,
        },
        ...entries,
      ].take(100).toList(),
    );
  }

  void remove(String id) =>
      _commit(entries.where((e) => e['id'] != id).toList());
  void clear() => _commit([]);
  void _commit(List<Map<String, dynamic>> next) {
    try {
      write(jsonEncode(next));
      entries = next;
      error = null;
    } catch (_) {
      error =
          'Browser storage is unavailable or full. This change was not saved.';
    }
    notifyListeners();
  }
}
