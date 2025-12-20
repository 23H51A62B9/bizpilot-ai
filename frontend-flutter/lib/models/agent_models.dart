class AgentStatus {
  final String name;
  final String description;
  final bool isActive;
  final String lastRun;
  final int tasksCompleted;
  final String icon;
  
  AgentStatus({
    required this.name,
    required this.description,
    required this.isActive,
    required this.lastRun,
    required this.tasksCompleted,
    required this.icon,
  });
}

class InsightCard {
  final String title;
  final String value;
  final String change;
  final bool isPositive;
  final String icon;
  
  InsightCard({
    required this.title,
    required this.value,
    required this.change,
    required this.isPositive,
    required this.icon,
  });
}

class AgentTask {
  final String agentName;
  final String action;
  final String timestamp;
  final String status; // success, warning, error
  final String? details;
  
  AgentTask({
    required this.agentName,
    required this.action,
    required this.timestamp,
    required this.status,
    this.details,
  });
}

class LeadScore {
  final String leadName;
  final String company;
  final int score;
  final String reason;
  final String priority; // high, medium, low
  
  LeadScore({
    required this.leadName,
    required this.company,
    required this.score,
    required this.reason,
    required this.priority,
  });
}

class InventoryAlert {
  final String productName;
  final int currentStock;
  final int minimumRequired;
  final String severity; // critical, warning, normal
  final int daysUntilStockout;
  
  InventoryAlert({
    required this.productName,
    required this.currentStock,
    required this.minimumRequired,
    required this.severity,
    required this.daysUntilStockout,
  });
}
