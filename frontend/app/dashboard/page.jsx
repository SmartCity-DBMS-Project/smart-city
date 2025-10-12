import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Clipboard, CheckCircle, Smile, FileText, CreditCard, Bell, Settings, Circle } from "lucide-react";

export default function DashboardPage(){
    const stats = [
        { title: "Active Services", value: "24", change: "+12% from last month", icon: <BarChart3 className="h-6 w-6 text-acc-blue" /> },
        { title: "Pending Requests", value: "12", change: "+4% from last month", icon: <Clipboard className="h-6 w-6 text-acc-blue" /> },
        { title: "Resolved Issues", value: "142", change: "+8% from last month", icon: <CheckCircle className="h-6 w-6 text-acc-blue" /> },
        { title: "User Satisfaction", value: "92%", change: "+3% from last month", icon: <Smile className="h-6 w-6 text-acc-blue" /> },
    ];

    const recentActivities = [
        { action: "New service request submitted", time: "2 minutes ago", user: "John Doe" },
        { action: "Utility bill payment processed", time: "15 minutes ago", user: "Jane Smith" },
        { action: "Complaint resolved", time: "1 hour ago", user: "Robert Johnson" },
        { action: "New user registered", time: "2 hours ago", user: "Emily Davis" },
    ];

    const quickActions = [
        { name: "New Request", icon: <FileText className="h-6 w-6 mb-2 text-acc-blue" /> },
        { name: "Pay Bills", icon: <CreditCard className="h-6 w-6 mb-2 text-acc-blue" /> },
        { name: "Notifications", icon: <Bell className="h-6 w-6 mb-2 text-acc-blue" /> },
        { name: "Settings", icon: <Settings className="h-6 w-6 mb-2 text-acc-blue" /> },
    ];

    const systemStatus = [
        { name: "Services", status: "Operational", color: "bg-green-100 text-green-800" },
        { name: "Payments", status: "Operational", color: "bg-green-100 text-green-800" },
        { name: "Support", status: "Maintenance", color: "bg-yellow-100 text-yellow-800" },
    ];

    return(
        <main className="flex flex-col items-center min-h-screen w-full">
            {/* Header Section - Using homepage pattern with bg-background */}
            <section className="w-full py-12 md:py-16 bg-background">
                <div className="container px-4 md:px-6 mx-auto max-w-6xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-primary mb-2">Dashboard</h1>
                        <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
                    </div>
                </div>
            </section>

            {/* Stats Section - Using homepage pattern with bg-card */}
            <section className="w-full py-12 bg-card">
                <div className="container px-4 md:px-6 mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-acc-blue bg-card">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                                    {stat.icon}
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <p className="text-xs text-muted-foreground">{stat.change}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2 bg-card">
                            <CardHeader>
                                <CardTitle>Recent Activities</CardTitle>
                                <CardDescription>Latest actions in the system</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentActivities.map((activity, index) => (
                                        <div key={index} className="flex items-start pb-4 last:pb-0 border-b last:border-0">
                                            <div className="bg-acc-blue/10 p-2 rounded-full mr-3">
                                                <div className="bg-acc-blue text-white rounded-full w-8 h-8 flex items-center justify-center">{index + 1}</div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">{activity.action}</p>
                                                <p className="text-sm text-muted-foreground">{activity.user} • {activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card className="bg-card">
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                    <CardDescription>Frequently used functions</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-3">
                                        {quickActions.map((action, index) => (
                                            <button 
                                                key={index} 
                                                className="flex flex-col items-center justify-center p-4 rounded-lg border border-border hover:bg-accent transition-colors bg-background"
                                            >
                                                {action.icon}
                                                <span className="text-sm font-medium">{action.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-card">
                                <CardHeader>
                                    <CardTitle>System Status</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {systemStatus.map((status, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <span className="text-sm">{status.name}</span>
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.color}`}>
                                                    <Circle className="-ml-0.5 mr-1.5 h-2 w-2" fill="currentColor" />
                                                    {status.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}