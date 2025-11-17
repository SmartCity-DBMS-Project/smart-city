"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Circle, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Target,
  Calendar,
  User
} from "lucide-react";

export function ProjectTimeline() {
  // Mock project timeline data
  const timelineItems = [
    {
      id: 1,
      title: "Q1 Infrastructure Upgrade",
      description: "Complete upgrade of city water treatment facilities",
      status: "completed",
      progress: 100,
      startDate: "2025-01-15",
      endDate: "2025-03-31",
      assignedTo: "Public Works Department",
      priority: "high"
    },
    {
      id: 2,
      title: "Smart Traffic System",
      description: "Install AI-powered traffic management system",
      status: "in-progress",
      progress: 65,
      startDate: "2025-02-01",
      endDate: "2025-06-30",
      assignedTo: "Transportation Department",
      priority: "high"
    },
    {
      id: 3,
      title: "Solar Panel Initiative",
      description: "Install solar panels on all municipal buildings",
      status: "in-progress",
      progress: 30,
      startDate: "2025-04-01",
      endDate: "2025-12-15",
      assignedTo: "Environment Department",
      priority: "medium"
    },
    {
      id: 4,
      title: "Digital Citizen Portal",
      description: "Launch upgraded citizen services portal",
      status: "pending",
      progress: 0,
      startDate: "2025-07-01",
      endDate: "2025-09-30",
      assignedTo: "IT Department",
      priority: "high"
    },
    {
      id: 5,
      title: "Park Renovation Project",
      description: "Renovate and expand Central Park facilities",
      status: "pending",
      progress: 0,
      startDate: "2025-10-01",
      endDate: "2026-03-31",
      assignedTo: "Environment Department",
      priority: "medium"
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "pending":
        return <Circle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      case "pending":
        return "Pending";
      default:
        return "Unknown";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="bg-card border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-acc-purple" />
          Project Timeline
        </CardTitle>
        <CardDescription>Track the progress of key city initiatives</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {timelineItems.map((item) => (
            <div key={item.id} className="relative pl-8 pb-6 border-l-2 border-border last:pb-0">
              <div className="absolute left-[-9px] top-0">
                {getStatusIcon(item.status)}
              </div>
              <div>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="font-medium text-foreground">{item.title}</h3>
                  <Badge className={getPriorityColor(item.priority)}>
                    {item.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>{getStatusText(item.status)}</span>
                    <span>{item.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-acc-blue h-2 rounded-full" 
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{item.assignedTo}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}