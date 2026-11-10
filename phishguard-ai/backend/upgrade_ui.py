from pathlib import Path
root=Path(__file__).resolve().parents[1]
p=root/'flutter_app/lib/main.dart'
s=p.read_text(encoding='utf-8')
s=s.replace("import 'api.dart';","import 'api.dart';\nimport 'history.dart';\nimport 'tool_views.dart';")
s=s.replace('int page = 0;', 'int page = 1;\n  final history = ScanHistory();')
s=s.replace("    'Documentation',","    'Documentation',\n    'Message Checker',\n    'Scan History',\n    'Next Steps',")
s=s.replace('    Icons.description_outlined,','    Icons.description_outlined,\n    Icons.mail_outline,\n    Icons.history,\n    Icons.support,')
s=s.replace('    input.dispose();','    input.dispose();\n    history.dispose();')
s=s.replace('if (mounted) setState(() => result = r);','if (mounted) {\n        history.save(input.text.trim(), r);\n        setState(() => result = r);\n      }')
s=s.replace('else if (page == 5)',"else if (page == 7)\n                          MessageChecker(api: widget.api, nextSteps: () => setState(() => page = 9))\n                        else if (page == 8)\n                          HistoryView(history: history, revisit: (e) => setState(() { input.text=e['url']; result=Map<String,dynamic>.from(e['result']); page=1; scanError=null; }))\n                        else if (page == 9)\n                          const NextSteps()\n                        else if (page == 5)")
start=s.index("        box(result!['label'], [")
end=s.index('\n      ],\n    ],\n  );',start)
s=s[:start]+"        ScanResult(result: result!, nextSteps: () => setState(() => page = 9)),\n        if(history.error!=null) notice(history.error!),"+s[end:]
p.write_text(s,encoding='utf-8')
p=root/'flutter_app/lib/tool_views.dart'
s=p.read_text(encoding='utf-8').replace('Text(error!, role: TextRole.alert)','Semantics(liveRegion: true, child: Text(error!))')
p.write_text(s,encoding='utf-8')
p=root/'flutter_app/pubspec.yaml'
s=p.read_text().replace('  http: ^1.6.0','  http: ^1.6.0\n  web: ^1.1.1')
p.write_text(s)
