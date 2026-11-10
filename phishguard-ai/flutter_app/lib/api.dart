import 'dart:async';
import 'dart:convert';

import 'package:http/http.dart' as http;

class PhishApi {
  final http.Client client;
  final String base;
  PhishApi({
    http.Client? client,
    this.base = const String.fromEnvironment(
      'API_URL',
      defaultValue: 'http://127.0.0.1:8000',
    ),
  }) : client = client ?? http.Client();
  Future<Map<String, dynamic>> request(
    String path, {
    Map<String, dynamic>? body,
  }) async {
    try {
      final response =
          await (body == null
                  ? client.get(Uri.parse('$base$path'))
                  : client.post(
                      Uri.parse('$base$path'),
                      headers: {'Content-Type': 'application/json'},
                      body: jsonEncode(body),
                    ))
              .timeout(const Duration(seconds: 10));
      final decoded = jsonDecode(response.body) as Map<String, dynamic>;
      if (response.statusCode != 200) {
        final detail = decoded['detail'];
        throw Exception(
          detail is List
              ? (path == '/analyze-message'
                    ? 'Paste a message of 1–20,000 characters.'
                    : 'Invalid URL or model. Use a valid HTTP(S) address, up to 2048 characters.')
              : detail ?? 'API error ${response.statusCode}',
        );
      }
      return decoded;
    } on FormatException {
      throw Exception(
        'The backend returned an unreadable response. Check the API address and retry.',
      );
    } on TimeoutException {
      throw Exception('The backend timed out. No prediction was generated.');
    } on http.ClientException {
      throw Exception(
        'Cannot reach the backend. Start FastAPI and retry. No prediction was generated.',
      );
    }
  }

  Future<Map<String, dynamic>> metrics() => request('/metrics');
  Future<Map<String, dynamic>> predict(String url, String model) =>
      request('/predict', body: {'url': url, 'model': model});
}
