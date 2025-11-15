"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Clipboard, CheckCircle, Smile, FileText, CreditCard, Bell, Settings, Circle, User, Mail, Shield } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DashboardPage(){
    const { user, loading } = useUser();
    const router = useRouter();
    const [passwordData, setPasswordData] = useState({
        newPassword: "",
        confirmNewPassword: ""
    });
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    useEffect(() => {
      if (!loading && !user) router.push("/login");
    }, [user, loading]);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordError("");
        setPasswordSuccess("");
        
        // Validate passwords
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            setPasswordError("New passwords do not match");
            return;
        }
        
        if (passwordData.newPassword.length < 6) {
            setPasswordError("Password must be at least 6 characters long");
            return;
        }
        
        setIsChangingPassword(true);
        
        try {
            const response = await fetch(`http://localhost:8000/change-password/${user.email}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    password: passwordData.newPassword
                })
            });
            
            if (response.ok) {
                setPasswordSuccess("Password changed successfully!");
                setPasswordData({
                    newPassword: "",
                    confirmNewPassword: ""
                });
                // Hide the form after successful change
                setTimeout(() => {
                    setShowPasswordForm(false);
                    setPasswordSuccess("");
                }, 2000);
            } else {
                const errorData = await response.json();
                setPasswordError(errorData.error || "Failed to change password");
            }
        } catch (error) {
            setPasswordError("An error occurred while changing password");
            console.error("Error changing password:", error);
        } finally {
            setIsChangingPassword(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!user) return null; // while redirecting

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
        { name: "New Request", icon: <FileText className="h-6 w-6 mb-2 text-acc-blue" />, slug: "/dashboard/requests", role: "CITIZEN" },
        { name: "Pay Bills", icon: <CreditCard className="h-6 w-6 mb-2 text-acc-blue" />, slug: "/dashboard/bills", role: "CITIZEN" },
        { name: "Notifications", icon: <Bell className="h-6 w-6 mb-2 text-acc-blue" />, slug: "#", role: "ALL" },
        { name: "Settings", icon: <Settings className="h-6 w-6 mb-2 text-acc-blue" />, slug: "/dashboard/settings", role: "ALL" },
        { name: "Manage Building", icon: <Bell className="h-6 w-6 mb-2 text-acc-blue" />, slug: "/dashboard/manage-buildings", role: "ADMIN" },
        { name: "Manage Citizens", icon: <Settings className="h-6 w-6 mb-2 text-acc-blue" />, slug: "/dashboard/manage-citizens", role: "ADMIN" },
        { name: "Manage Requests", icon: <FileText className="h-6 w-6 mb-2 text-acc-blue" />, slug: "/dashboard/requests", role: "ADMIN" },
    ];

    const systemStatus = [
        { name: "Services", status: "Operational", color: "bg-green-100 text-green-800" },
        { name: "Payments", status: "Operational", color: "bg-green-100 text-green-800" },
        { name: "Support", status: "Maintenance", color: "bg-yellow-100 text-yellow-800" },
    ];

    const displayName = user.full_name || user.email || "User";
    const lastLogin = user.last_login ? new Date(user.last_login).toLocaleString() : null;
    const actionDisplayRole = user.role;

    return(
        <main className="flex flex-col items-center min-h-screen w-full">
            {/* Header / Hero */}
      <section className="w-full py-10 md:py-14 bg-background">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="flex flex-col gap-6 md:gap-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              {/* Left: Big Welcome + details below */}
              <div className="min-w-0">
                <h1 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
                  Welcome, <span className="">{displayName}!</span>
                </h1>

                {/* Details directly below the welcome message */}
                <div className="mt-3 space-y-1">
                  <p className="text-sm md:text-base text-muted-foreground">
                    <span className="inline-flex items-center mr-2">
                      <Mail className="h-5 w-5 mr-1" />
                      <span className="text-lg">{user.email || "no-email@domain"}</span>
                    </span>
                  </p>

                  <p className="text-xs md:text-sm text-muted-foreground">
                    <span className="inline-flex items-center mr-2">
                      <Shield className="h-5 w-5 mr-1" />
                      <span className="text-lg">{user.role || "Member"}</span>
                    </span>

                    {lastLogin ? (
                      <span className="ml-3 text-xs text-muted-foreground/90">
                        Last signed in: <time dateTime={user.last_login}>{lastLogin}</time>
                      </span>
                    ) : null}
                  </p>
                </div>
              </div>

              {/* Right: compact avatar + small actions (no card) */}
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-acc-blue/10 flex items-center justify-center shrink-0">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={`${displayName} avatar`}
                      className="h-12 w-12 md:h-14 md:w-14 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-acc-blue" />
                  )}
                </div>
              </div>
            </div>
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
                                            (action.role === actionDisplayRole || action.role === "ALL") && (                                                            <Link
                                                                href={action.slug}
                                                                key={index}
                                                                className="flex flex-col items-center justify-center p-4 rounded-lg border border-border hover:bg-accent transition-colors bg-background"
                                                            >
                                                                {action.icon}
                                                                <span className="text-sm font-medium">{action.name}</span>
                                                            </Link>
                                                            )
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