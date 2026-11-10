import 'package:flutter/material.dart';

import 'api.dart';
import 'history.dart';

const space = SizedBox(height: 18);
Widget toolCard(String title, List<Widget> children) => Card(
  margin: const EdgeInsets.only(bottom: 20),
  child: Padding(
    padding: const EdgeInsets.all(24),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
        ),
        space,
        ...children,
      ],
    ),
  ),
);

class ScanResult extends StatelessWidget {
  final Map<String, dynamic> result;
  final VoidCallback nextSteps;
  const ScanResult({super.key, required this.result, required this.nextSteps});
  @override
  Widget build(BuildContext context) {
    final findings = (result['findings'] as List?) ?? [];
    return toolCard(result['label']?.toString() ?? 'Stored scan', [
      Text('Trained model verdict · ${result['model'] ?? 'unknown model'}'),
      space,
      Text(
        result['rule_summary'] ??
            'Rule details unavailable for this older scan.',
        style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
      ),
      const Text(
        'These rule observations are separate from the model decision. They do not explain its exact internal reasoning.',
      ),
      space,
      if (result['hostname'] != null)
        SelectableText(
          'Actual hostname: ${result['hostname']}\nRegistrable domain: ${result['registrable_domain']}',
        ),
      space,
      for (final f in findings)
        Padding(
          padding: const EdgeInsets.only(bottom: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                f['kind'].toString(),
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              SelectableText(f['evidence'].toString()),
              Text(f['explanation'].toString()),
            ],
          ),
        ),
      Text(
        result['transport_note'] ??
            'HTTPS does not prove a website is legitimate.',
      ),
      space,
      const Text(
        'No URL was opened or fetched. Neither a model verdict nor the absence of warning signs guarantees safety. Confidence percentages are hidden because this model is not calibrated.',
      ),
      space,
      FilledButton.tonalIcon(
        onPressed: nextSteps,
        icon: const Icon(Icons.support),
        label: const Text('What should I do next?'),
      ),
    ]);
  }
}

class MessageChecker extends StatefulWidget {
  final PhishApi api;
  final VoidCallback nextSteps;
  const MessageChecker({super.key, required this.api, required this.nextSteps});
  @override
  State<MessageChecker> createState() => _MessageCheckerState();
}

class _MessageCheckerState extends State<MessageChecker> {
  final controller = TextEditingController();
  Map<String, dynamic>? result;
  String? error;
  String analyzed = '';
  bool busy = false;
  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  Future<void> analyze() async {
    if (controller.text.trim().isEmpty) {
      setState(() => error = 'Paste a message first.');
      return;
    }
    setState(() {
      busy = true;
      error = null;
      result = null;
      analyzed = controller.text;
    });
    try {
      final r = await widget.api.request(
        '/analyze-message',
        body: {'text': analyzed, 'model': 'random_forest'},
      );
      if (mounted) setState(() => result = r);
    } catch (e) {
      if (mounted) setState(() => error = e.toString());
    } finally {
      if (mounted) setState(() => busy = false);
    }
  }

  List<InlineSpan> highlighted() {
    final spans = <InlineSpan>[];
    final findings =
        ((result?['findings'] as List?) ?? [])
            .where((f) => f['start'] is int && f['end'] is int)
            .toList()
          ..sort((a, b) => (a['start'] as int).compareTo(b['start'] as int));
    int pos = 0;
    for (final f in findings) {
      final a = f['start'] as int, b = f['end'] as int;
      if (a < pos || a < 0 || b > analyzed.length || b <= a) continue;
      spans.add(TextSpan(text: analyzed.substring(pos, a)));
      spans.add(
        TextSpan(
          text: analyzed.substring(a, b),
          style: const TextStyle(
            backgroundColor: Color(0xffffdf91),
            color: Color(0xff322000),
            fontWeight: FontWeight.bold,
          ),
        ),
      );
      pos = b;
    }
    spans.add(TextSpan(text: analyzed.substring(pos)));
    return spans;
  }

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      toolCard('Email & message checker', [
        const Text(
          'Rule-based analysis, not an email model or connected AI. The text goes only to your configured backend for analysis and is not saved by the app. Extracted links are checked but never visited or added to history.',
        ),
        space,
        TextField(
          controller: controller,
          enabled: !busy,
          minLines: 5,
          maxLines: 12,
          maxLength: 20000,
          decoration: const InputDecoration(
            labelText: 'Suspicious email or message',
            hintText: 'Paste the message as plain text…',
          ),
        ),
        space,
        Wrap(
          spacing: 12,
          children: [
            FilledButton(
              onPressed: busy ? null : analyze,
              child: Text(busy ? 'Checking message…' : 'Check message'),
            ),
            TextButton(
              onPressed: busy
                  ? null
                  : () => setState(() {
                      controller.clear();
                      result = null;
                      error = null;
                      analyzed = '';
                    }),
              child: const Text('Clear message'),
            ),
          ],
        ),
        if (busy) ...[space, const LinearProgressIndicator()],
        if (error != null) ...[
          space,
          Semantics(liveRegion: true, child: Text(error!)),
        ],
      ]),
      if (result != null) ...[
        toolCard(result!['summary'], [
          SelectableText.rich(
            TextSpan(
              style: TextStyle(
                color: Theme.of(context).colorScheme.onSurface,
                height: 1.6,
              ),
              children: highlighted(),
            ),
          ),
          space,
          for (final f in result!['findings'])
            Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Text(
                '${f['kind']}: “${f['evidence']}”\n${f['explanation']}',
              ),
            ),
          Text(result!['limitations']),
          space,
          FilledButton.tonal(
            onPressed: widget.nextSteps,
            child: const Text('Recommended next steps'),
          ),
        ]),
        toolCard('Embedded links', [
          Text(
            '${result!['links_found']} unique link(s) found. At most 10 are scanned. ${result!['links_omitted']} omitted.',
          ),
          const Text(
            'Links are plain text, not clickable. A shortened URL is analyzed as written; its destination is not resolved.',
          ),
          for (final link in result!['links']) ...[
            space,
            SelectableText(link['url']),
            if (link['error'] != null)
              Text('Not scanned: ${link['error']}')
            else
              ScanResult(
                result: Map<String, dynamic>.from(link['result']),
                nextSteps: widget.nextSteps,
              ),
          ],
          if ((result!['links'] as List).isEmpty)
            const Text(
              'No supported link-like text found. Hidden links in formatted email may not survive plain-text paste.',
            ),
        ]),
      ],
    ],
  );
}

class HistoryView extends StatelessWidget {
  final ScanHistory history;
  final void Function(Map<String, dynamic>) revisit;
  const HistoryView({super.key, required this.history, required this.revisit});
  @override
  Widget build(BuildContext context) => AnimatedBuilder(
    animation: history,
    builder: (context, _) => Column(
      children: [
        toolCard('Your scan history', [
          const Text(
            'URL checks are stored on this device in this browser profile (up to 100). URLs can contain private tokens. Anyone using this profile may see them. Email/message content and extracted-link checks are not saved. Changing browser or site origin creates a separate history.',
          ),
          space,
          if (history.error != null) Text(history.error!),
          TextButton.icon(
            onPressed: history.entries.isEmpty && history.error == null
                ? null
                : () async {
                    final approved = await showDialog<bool>(
                      context: context,
                      builder: (c) => AlertDialog(
                        title: const Text('Clear URL history?'),
                        content: const Text(
                          'Remove all URL scan entries saved by this app on this browser.',
                        ),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(c, false),
                            child: const Text('Cancel'),
                          ),
                          FilledButton(
                            onPressed: () => Navigator.pop(c, true),
                            child: const Text('Clear history'),
                          ),
                        ],
                      ),
                    );
                    if (approved == true) history.clear();
                  },
            icon: const Icon(Icons.delete_sweep),
            label: const Text('Clear history'),
          ),
          if (history.entries.isEmpty)
            const Text(
              'No saved URL checks yet. Run a URL scan to create an entry.',
            ),
        ]),
        for (final e in history.entries)
          toolCard((e['result'] as Map)['label']?.toString() ?? 'Stored scan', [
            SelectableText(e['url']),
            Text(e['date']),
            space,
            Wrap(
              spacing: 12,
              children: [
                FilledButton.tonal(
                  onPressed: () => revisit(e),
                  child: const Text('Revisit result'),
                ),
                TextButton.icon(
                  onPressed: () => history.remove(e['id']),
                  icon: const Icon(Icons.delete_outline),
                  label: const Text('Delete entry'),
                ),
              ],
            ),
          ]),
      ],
    ),
  );
}

class NextSteps extends StatelessWidget {
  const NextSteps({super.key});
  @override
  Widget build(BuildContext context) => Column(
    children: [
      toolCard('Received a suspicious message', const [
        Text(
          'Avoid the message’s links, attachments and reply address. Contact the organization through its known app, saved bookmark or independently verified phone number. Report the message through your email provider or workplace IT team.',
        ),
      ]),
      toolCard('Clicked a link', const [
        Text(
          'Close the page and do not enter information or install software. A click alone does not prove compromise. If a download occurred, do not open it; update security software and run a scan. On a work or school device, notify IT promptly.',
        ),
      ]),
      toolCard('Entered a password or verification code', const [
        Text(
          'Use the genuine service through a known address to change the password. Change reused passwords elsewhere. Review active sessions and sign out unfamiliar ones. Enable multi-factor authentication and follow the service’s account-recovery process.',
        ),
      ]),
      toolCard('Shared payment or identity information', const [
        Text(
          'Contact your bank or payment provider promptly through a trusted channel. Explain the suspected fraud and ask about available protections or reversal options. In the US, IdentityTheft.gov offers recovery steps for identity theft; ReportFraud.ftc.gov accepts fraud reports.',
        ),
      ]),
      toolCard('Trusted guidance', const [
        SelectableText(
          'https://consumer.ftc.gov/articles/how-recognize-avoid-phishing-scams\nhttps://consumer.ftc.gov/articles/what-do-if-you-were-scammed',
        ),
        Text(
          'Guidance checked 15 October 2026. These are reference addresses, not scan verdicts.',
        ),
      ]),
    ],
  );
}
