import 'package:web/web.dart' as web;

const key = 'phishguard.url-history.v1';
String? readHistory() => web.window.localStorage.getItem(key);
void writeHistory(String value) => web.window.localStorage.setItem(key, value);
