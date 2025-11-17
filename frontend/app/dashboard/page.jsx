"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  CreditCard, 
  Clipboard, 
  User, 
  Bell, 
  Settings,
  TrendingUp,
  Building,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Flag,
  Zap,
  DollarSign,
  Eye,
  Target
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line, AreaChart, Area } from "recharts";
import { TaskManager } from "@/components/TaskManager";
import { ProjectTimeline } from "@/components/ProjectTimeline";

export default function DashboardPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalBills: 0,
    pendingBills: 0,
    paidBills: 0,
    totalRequests: 0,
    pendingRequests: 0,
    resolvedRequests: 0,
    activeUsers: 0,
    systemHealth: 0
  });

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    
    // Mock data for demonstration
    if (user) {
      setStats({
        totalBills: user.role === "ADMIN" ? 124 : 5,
        pendingBills: user.role === "ADMIN" ? 23 : 2,
        paidBills: user.role === "ADMIN" ? 101 : 3,
        totalRequests: user.role === "ADMIN" ? 67 : 3,
        pendingRequests: user.role === "ADMIN" ? 12 : 1,
        resolvedRequests: user.role === "ADMIN" ? 55 : 2,
        activeUsers: user.role === "ADMIN" ? 1240 : 0,
        systemHealth: 98
      });
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-acc-blue"></div>
      </div>
    );
  }

  if (!user) return null;

  const displayName = user.full_name || user.email;

  // Quick actions based on user role
  const quickActions = [
    { name: "New Request", icon: FileText, slug: "/dashboard/requests", role: "CITIZEN", color: "bg-blue-500" },
    { name: "Manage Requests", icon: FileText, slug: "/dashboard/requests", role: "ADMIN", color: "bg-blue-500" },
    { name: "Pay Bills", icon: CreditCard, slug: "/dashboard/bills", role: "CITIZEN", color: "bg-green-500" },
    { name: "Manage Bills", icon: CreditCard, slug: "/dashboard/bills", role: "ADMIN", color: "bg-green-500" },
    { name: "Buildings", icon: Building, slug: "/dashboard/manage-buildings", role: "ADMIN", color: "bg-purple-500" },
    { name: "Citizens", icon: Users, slug: "/dashboard/manage-citizens", role: "ADMIN", color: "bg-orange-500" },
    { name: "Notifications", icon: Bell, slug: "/dashboard/notifications", role: "ALL", color: "bg-yellow-500" },
    { name: "Settings", icon: Settings, slug: "/dashboard/settings", role: "ALL", color: "bg-gray-500" },
  ];

  // Mock data for charts
  const billData = [
    { name: 'Jan', bills: 12 },
    { name: 'Feb', bills: 19 },
    { name: 'Mar', bills: 8 },
    { name: 'Apr', bills: 15 },
    { name: 'May', bills: 11 },
    { name: 'Jun', bills: 6 },
  ];

  const requestStatusData = [
    { name: 'Pending', value: stats.pendingRequests, color: '#ff6b35' },
    { name: 'Resolved', value: stats.resolvedRequests, color: '#34a853' },
    { name: 'In Progress', value: 5, color: '#1a73e8' },
  ];

  // System health data
  const systemHealthData = [
    { name: 'Mon', health: 95 },
    { name: 'Tue', health: 97 },
    { name: 'Wed', health: 98 },
    { name: 'Thu', health: 96 },
    { name: 'Fri', health: 98 },
    { name: 'Sat', health: 99 },
    { name: 'Sun', health: 98 },
  ];

  // User activity data
  const userActivityData = [
    { name: 'Mon', users: 120 },
    { name: 'Tue', users: 150 },
    { name: 'Wed', users: 180 },
    { name: 'Thu', users: 140 },
    { name: 'Fri', users: 200 },
    { name: 'Sat', users: 250 },
    { name: 'Sun', users: 300 },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {displayName} 👋</h1>
        <p className="text-muted-foreground mt-2">Here's what's happening with your city services today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Bills" 
          value={stats.totalBills} 
          icon={<CreditCard className="h-5 w-5" />} 
          trend="+12%" 
          color="bg-blue-500"
        />
        <StatCard 
          title="Pending Bills" 
          value={stats.pendingBills} 
          icon={<Clock className="h-5 w-5" />} 
          trend="-3%" 
          color="bg-orange-500"
        />
        <StatCard 
          title="Total Requests" 
          value={stats.totalRequests} 
          icon={<FileText className="h-5 w-5" />} 
          trend="+8%" 
          color="bg-green-500"
        />
        <StatCard 
          title="Resolved Requests" 
          value={stats.resolvedRequests} 
          icon={<CheckCircle className="h-5 w-5" />} 
          trend="+15%" 
          color="bg-purple-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Bills Chart */}
        <Card className="bg-card border border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-acc-blue" />
              Monthly Bills Overview
            </CardTitle>
            <CardDescription>Track your billing trends over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={billData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }} 
                  />
                  <Bar dataKey="bills" fill="hsl(var(--acc-blue))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="bg-card border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-acc-yellow" />
              System Health
            </CardTitle>
            <CardDescription>Current system performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl font-bold">{stats.systemHealth}%</div>
              <div className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Operational
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={systemHealthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }} 
                  />
                  <Area type="monotone" dataKey="health" stroke="hsl(var(--acc-green))" fill="hsl(var(--acc-green))" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Requests Status Chart */}
        <Card className="bg-card border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-acc-green" />
              Request Status Distribution
            </CardTitle>
            <CardDescription>Current status of all service requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <RechartsPieChart.Pie
                    data={requestStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {requestStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </RechartsPieChart.Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }} 
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* User Activity */}
        <Card className="bg-card border border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-acc-blue" />
              User Activity
            </CardTitle>
            <CardDescription>Active users over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }} 
                  />
                  <Line type="monotone" dataKey="users" stroke="hsl(var(--acc-blue))" strokeWidth={2} dot={{ stroke: 'hsl(var(--acc-blue))', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Manager and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Manager */}
        <div className="lg:col-span-2">
          <TaskManager />
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-acc-purple" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest notifications and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ActivityItem 
                  icon={<CreditCard className="h-4 w-4 text-green-500" />} 
                  title="Electricity bill generated" 
                  description="₹2,450 for April consumption" 
                  time="2 hours ago" 
                />
                <ActivityItem 
                  icon={<FileText className="h-4 w-4 text-blue-500" />} 
                  title="Service request submitted" 
                  description="Garbage collection request for Sector 5" 
                  time="5 hours ago" 
                />
                <ActivityItem 
                  icon={<CheckCircle className="h-4 w-4 text-purple-500" />} 
                  title="Request resolved" 
                  description="Water leakage issue fixed" 
                  time="1 day ago" 
                />
                <ActivityItem 
                  icon={<AlertCircle className="h-4 w-4 text-orange-500" />} 
                  title="Payment due reminder" 
                  description="Water bill due in 3 days" 
                  time="1 day ago" 
                />
                <ActivityItem 
                  icon={<Flag className="h-4 w-4 text-acc-blue" />} 
                  title="New task assigned" 
                  description="Review Q4 budget allocation" 
                  time="2 days ago" 
                />
                <ActivityItem 
                  icon={<Target className="h-4 w-4 text-acc-green" />} 
                  title="Project milestone reached" 
                  description="50% of infrastructure upgrade completed" 
                  time="3 days ago" 
                />
                <ActivityItem 
                  icon={<Eye className="h-4 w-4 text-acc-purple" />} 
                  title="New citizen registered" 
                  description="Welcome to Smart City services" 
                  time="4 days ago" 
                />
                <ActivityItem 
                  icon={<DollarSign className="h-4 w-4 text-acc-yellow" />} 
                  title="Budget approved" 
                  description="₹15M allocated for public transportation" 
                  time="5 days ago" 
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Project Timeline */}
          <ProjectTimeline />
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon, trend, color }) {
  return (
    <Card className="bg-card border border-border hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold text-foreground mt-1">{value}</h3>
          </div>
          <div className={`p-3 rounded-full ${color} text-white`}>
            {icon}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3 flex items-center">
          <TrendingUp className="h-3 w-3 mr-1" />
          {trend} from last month
        </p>
      </CardContent>
    </Card>
  );
}

// Activity Item Component
function ActivityItem({ icon, title, description, time }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground truncate">{description}</p>
        <p className="text-xs text-muted-foreground mt-1">{time}</p>
      </div>
    </div>
  );
}