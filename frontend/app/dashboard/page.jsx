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
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordData, setPasswordData] = useState({
        newPassword: "",
        confirmNewPassword: ""
    });
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");
    const [isChangingPassword, setIsChangingPassword] = useState(false);

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
        { name: "New Request", icon: <FileText className="h-6 w-6 mb-2 text-acc-blue" />, slug: "#" },
        { name: "Pay Bills", icon: <CreditCard className="h-6 w-6 mb-2 text-acc-blue" />, slug: "/dashboard/bills" },
        { name: "Notifications", icon: <Bell className="h-6 w-6 mb-2 text-acc-blue" />, slug: "#" },
        { name: "Settings", icon: <Settings className="h-6 w-6 mb-2 text-acc-blue" />, slug: "/dashboard/settings" },
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
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-primary mb-2">Dashboard</h1>
                                <p className="text-muted-foreground">Welcome back, {user.full_name || user.email}!</p>
                            </div>
                            <div className="flex items-center space-x-4 bg-card border rounded-lg p-4">
                                <div className="bg-acc-blue/10 p-3 rounded-full">
                                    <User className="h-6 w-6 text-acc-blue" />
                                </div>
                                <div>
                                    <p className="font-medium">{user.full_name || user.email}</p>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Mail className="h-4 w-4 mr-1" />
                                        <span>{user.email}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Shield className="h-4 w-4 mr-1" />
                                        <span>{user.role}</span>
                                    </div>
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
                                            <Link
                                                href={action.slug}
                                                key={index} 
                                                className="flex flex-col items-center justify-center p-4 rounded-lg border border-border hover:bg-accent transition-colors bg-background"
                                            >
                                                {action.icon}
                                                <span className="text-sm font-medium">{action.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-card">
                                <CardHeader>
                                    <CardTitle>Change Password</CardTitle>
                                    <CardDescription>Update your account security</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {!showPasswordForm ? (
                                        <Button onClick={() => setShowPasswordForm(true)} className="w-full">
                                            Change Password
                                        </Button>
                                    ) : (
                                        <form onSubmit={handlePasswordChange} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="newPassword">New Password</Label>
                                                <Input
                                                    id="newPassword"
                                                    type="password"
                                                    value={passwordData.newPassword}
                                                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                                    required
                                                    minLength={6}
                                                />
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                                                <Input
                                                    id="confirmNewPassword"
                                                    type="password"
                                                    value={passwordData.confirmNewPassword}
                                                    onChange={(e) => setPasswordData({...passwordData, confirmNewPassword: e.target.value})}
                                                    required
                                                    minLength={6}
                                                />
                                            </div>
                                            
                                            {passwordError && (
                                                <div className="text-red-500 text-sm">{passwordError}</div>
                                            )}
                                            
                                            {passwordSuccess && (
                                                <div className="text-green-500 text-sm">{passwordSuccess}</div>
                                            )}
                                            
                                            <div className="flex space-x-2">
                                                <Button 
                                                    type="submit" 
                                                    disabled={isChangingPassword}
                                                    className="flex-1"
                                                >
                                                    {isChangingPassword ? "Changing..." : "Change Password"}
                                                </Button>
                                                <Button 
                                                    type="button" 
                                                    variant="outline" 
                                                    onClick={() => {
                                                        setShowPasswordForm(false);
                                                        setPasswordError("");
                                                        setPasswordSuccess("");
                                                        setPasswordData({ newPassword: "", confirmNewPassword: "" });
                                                    }}
                                                    className="flex-1"
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </form>
                                    )}
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