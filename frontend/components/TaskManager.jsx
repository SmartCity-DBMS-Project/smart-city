"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle, 
  Circle, 
  Plus, 
  Calendar, 
  User, 
  Flag,
  Filter,
  Search
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export function TaskManager() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Review water department budget",
      description: "Analyze the proposed budget for the next fiscal year and provide feedback",
      status: "completed",
      priority: "high",
      assignee: "Amanda Rodriguez",
      dueDate: "2025-11-20",
      department: "Municipal"
    },
    {
      id: 2,
      title: "Update citizen portal UI",
      description: "Redesign the user interface for better accessibility and mobile experience",
      status: "in-progress",
      priority: "medium",
      assignee: "James Peterson",
      dueDate: "2025-11-25",
      department: "IT"
    },
    {
      id: 3,
      title: "Prepare quarterly report",
      description: "Compile data and create presentation for city council meeting",
      status: "pending",
      priority: "high",
      assignee: "Lisa Thompson",
      dueDate: "2025-11-30",
      department: "Environment"
    },
    {
      id: 4,
      title: "Coordinate street lighting maintenance",
      description: "Schedule repairs for faulty street lights in downtown area",
      status: "pending",
      priority: "medium",
      assignee: "Robert Williams",
      dueDate: "2025-11-22",
      department: "Public Works"
    },
    {
      id: 5,
      title: "Process building permit applications",
      description: "Review and approve pending permit requests for new constructions",
      status: "in-progress",
      priority: "low",
      assignee: "David Miller",
      dueDate: "2025-12-05",
      department: "Municipal"
    }
  ]);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    assignee: "",
    dueDate: "",
    department: ""
  });

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter tasks based on status, priority, and search term
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const addTask = () => {
    if (newTask.title.trim() === "") return;
    
    const task = {
      id: tasks.length + 1,
      ...newTask,
      status: "pending"
    };
    
    setTasks([...tasks, task]);
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      assignee: "",
      dueDate: "",
      department: ""
    });
  };

  const toggleTaskStatus = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        return {
          ...task,
          status: task.status === "completed" ? "pending" : "completed"
        };
      }
      return task;
    }));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    return status === "completed" ? 
      <CheckCircle className="h-5 w-5 text-green-500" /> : 
      <Circle className="h-5 w-5 text-muted-foreground" />;
  };

  return (
    <Card className="bg-card border border-border">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5 text-acc-blue" />
              Task Management
            </CardTitle>
            <CardDescription>Track and manage your department tasks</CardDescription>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-48"
              />
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Add Task Form */}
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-3">Add New Task</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            />
            <Input
              placeholder="Assignee"
              value={newTask.assignee}
              onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
            />
            <Textarea
              placeholder="Description"
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              className="md:col-span-2"
            />
            <Input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
            />
            <Select value={newTask.priority} onValueChange={(value) => setNewTask({...newTask, priority: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Department"
              value={newTask.department}
              onChange={(e) => setNewTask({...newTask, department: e.target.value})}
            />
            <Button onClick={addTask} className="md:col-span-2">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>
        
        {/* Task List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Flag className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No tasks found matching your criteria</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div 
                key={task.id} 
                className="flex items-start gap-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <button 
                  onClick={() => toggleTaskStatus(task.id)}
                  className="mt-1"
                >
                  {getStatusIcon(task.status)}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h4 className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {task.title}
                    </h4>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-1">
                    {task.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{task.assignee}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="px-2 py-1 rounded bg-muted text-muted-foreground">
                        {task.department}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}