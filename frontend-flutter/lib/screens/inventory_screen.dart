import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../services/api_service.dart';

class InventoryScreen extends StatefulWidget {
  const InventoryScreen({super.key});

  @override
  State<InventoryScreen> createState() => _InventoryScreenState();
}

class _InventoryScreenState extends State<InventoryScreen> {
  final ApiService _apiService = ApiService();
  bool _isChecking = false;
  
  final List<Map<String, dynamic>> _mockInventory = [
    {
      'product': 'Premium Widget A',
      'current': 15,
      'minimum': 50,
      'severity': 'critical',
      'daysLeft': 3,
      'trend': 'down',
    },
    {
      'product': 'Standard Widget B',
      'current': 45,
      'minimum': 30,
      'severity': 'normal',
      'daysLeft': 12,
      'trend': 'stable',
    },
    {
      'product': 'Deluxe Widget C',
      'current': 25,
      'minimum': 40,
      'severity': 'warning',
      'daysLeft': 7,
      'trend': 'down',
    },
  ];

  Future<void> _checkInventory() async {
    setState(() => _isChecking = true);
    try {
      await _apiService.checkInventory('Check all inventory levels');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Inventory check complete'),
            backgroundColor: AppTheme.successGreen,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: $e'),
            backgroundColor: AppTheme.errorRed,
          ),
        );
      }
    } finally {
      setState(() => _isChecking = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final criticalItems = _mockInventory.where((i) => i['severity'] == 'critical').length;
    final warningItems = _mockInventory.where((i) => i['severity'] == 'warning').length;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Inventory Sentinel'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _isChecking ? null : _checkInventory,
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status Banner
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFFEF4444), Color(0xFFF59E0B)],
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.warning_amber, color: Colors.white, size: 32),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Attention Required',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '$criticalItems critical alerts • $warningItems warnings',
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.9),
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Quick Stats
            Row(
              children: [
                Expanded(
                  child: _buildStatCard(
                    'Critical',
                    criticalItems.toString(),
                    Icons.error_outline,
                    AppTheme.errorRed,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildStatCard(
                    'Warning',
                    warningItems.toString(),
                    Icons.warning_amber_outlined,
                    AppTheme.warningOrange,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildStatCard(
                    'Normal',
                    (_mockInventory.length - criticalItems - warningItems).toString(),
                    Icons.check_circle_outline,
                    AppTheme.successGreen,
                  ),
                ),
              ],
            ),

            const SizedBox(height: 32),

            // Action Button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: _isChecking ? null : _checkInventory,
                icon: _isChecking
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                        ),
                      )
                    : const Icon(Icons.inventory_2),
                label: Text(_isChecking ? 'Checking...' : 'Run Full Inventory Check'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.warningOrange,
                  padding: const EdgeInsets.all(16),
                ),
              ),
            ),

            const SizedBox(height: 32),

            Text(
              'Inventory Status',
              style: Theme.of(context).textTheme.headlineSmall,
            ),

            const SizedBox(height: 16),

            ..._mockInventory.map((item) => _buildInventoryCard(item)).toList(),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.darkCard,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              color: color,
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: const TextStyle(
              color: AppTheme.darkTextSecondary,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInventoryCard(Map<String, dynamic> item) {
    Color severityColor;
    IconData severityIcon;
    String severityText;

    switch (item['severity']) {
      case 'critical':
        severityColor = AppTheme.errorRed;
        severityIcon = Icons.error;
        severityText = 'CRITICAL';
        break;
      case 'warning':
        severityColor = AppTheme.warningOrange;
        severityIcon = Icons.warning;
        severityText = 'WARNING';
        break;
      default:
        severityColor = AppTheme.successGreen;
        severityIcon = Icons.check_circle;
        severityText = 'NORMAL';
    }

    final stockPercentage = (item['current'] / item['minimum'] * 100).clamp(0, 100);

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.darkCard,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: severityColor.withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  item['product'],
                  style: const TextStyle(
                    color: AppTheme.darkText,
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: severityColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: severityColor.withOpacity(0.5)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(severityIcon, size: 14, color: severityColor),
                    const SizedBox(width: 4),
                    Text(
                      severityText,
                      style: TextStyle(
                        color: severityColor,
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),

          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Current Stock',
                      style: TextStyle(
                        color: AppTheme.darkTextSecondary,
                        fontSize: 12,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${item['current']} units',
                      style: TextStyle(
                        color: severityColor,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                width: 1,
                height: 40,
                color: AppTheme.darkBorder,
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Minimum Required',
                      style: TextStyle(
                        color: AppTheme.darkTextSecondary,
                        fontSize: 12,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${item['minimum']} units',
                      style: const TextStyle(
                        color: AppTheme.darkText,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),

          // Progress Bar
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: stockPercentage / 100,
              backgroundColor: AppTheme.darkBg,
              valueColor: AlwaysStoppedAnimation<Color>(severityColor),
              minHeight: 8,
            ),
          ),

          const SizedBox(height: 12),

          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(
                    item['trend'] == 'down' ? Icons.trending_down : Icons.trending_flat,
                    size: 16,
                    color: AppTheme.darkTextSecondary,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    '${item['daysLeft']} days until stockout',
                    style: const TextStyle(
                      color: AppTheme.darkTextSecondary,
                      fontSize: 13,
                    ),
                  ),
                ],
              ),
              if (item['severity'] == 'critical')
                TextButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.shopping_cart, size: 16),
                  label: const Text('Reorder Now'),
                  style: TextButton.styleFrom(
                    foregroundColor: severityColor,
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }
}
