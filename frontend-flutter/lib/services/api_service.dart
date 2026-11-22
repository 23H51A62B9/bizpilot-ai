import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  // Change this to your actual Firebase project URL when deploying
  // For local emulator:
  static const String baseUrl = 'http://localhost:5002/bizpilot-ai-480607/us-central1';
  
  // For production (when you deploy):
  // static const String baseUrl = 'https://us-central1-bizpilot-ai-480607.cloudfunctions.net';

  // Helper method to make API calls with proper error handling
  Future<Map<String, dynamic>> _callAgent(String agentName, String input) async {
    try {
      final url = Uri.parse('$baseUrl/$agentName');
      
      print('🔵 Calling: $url');
      print('📤 Request body: ${jsonEncode({'data': {'input': input}})}');
      
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'data': {
            'input': input,
          }
        }),
      ).timeout(
        const Duration(seconds: 60),
        onTimeout: () {
          throw Exception('Request timeout - agent took too long to respond');
        },
      );

      print('📥 Response status: ${response.statusCode}');
      print('📥 Response body: ${response.body}');

      if (response.statusCode == 200) {
        final result = jsonDecode(response.body);
        return {
          'success': true,
          'data': result['result'] ?? result,
        };
      } else {
        throw Exception('Agent returned error: ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      print('❌ Error calling $agentName: $e');
      return {
        'success': false,
        'error': e.toString(),
      };
    }
  }

  // Sales Agent
  Future<Map<String, dynamic>> analyzeSales(String input) async {
    return await _callAgent('salesAgent', input);
  }

  // Marketing Agent
  Future<Map<String, dynamic>> generateMarketing(String productName) async {
    return await _callAgent('marketingAgent', productName);
  }

  // Inventory Agent
  Future<Map<String, dynamic>> checkInventory(String input) async {
    return await _callAgent('inventoryAgent', input);
  }

  // Finance Agent
  Future<Map<String, dynamic>> analyzeFinance(String input) async {
    return await _callAgent('financeAgent', input);
  }

  // Auditor Agent
  Future<Map<String, dynamic>> runAudit(String input) async {
    return await _callAgent('auditorAgent', input);
  }
}