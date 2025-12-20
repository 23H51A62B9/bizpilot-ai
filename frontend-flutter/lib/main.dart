import 'package:flutter/material.dart';
import 'theme/app_theme.dart';
import 'screens/dashboard.dart';

void main() {
  runApp(const BizPilotApp());
}

class BizPilotApp extends StatelessWidget {
  const BizPilotApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'BizPilot AI',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: const Dashboard(),
    );
  }
}
