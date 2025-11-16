"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileText,
  CreditCard,
  Clipboard,
  User,
  Mail,
  Shield,
  Bell,
  Settings,
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";
import SkeletonLoader from "@/components/SkeletonLoader";

export default function DashboardPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading]);

  if (loading) return <LoadingState />;
  if (!user) return null;

  const displayName = user.full_name || user.email;
  const lastLogin = user.last_login
    ? new Date(user.last_login).toLocaleString()
    : null;

  const quickActions = [
    { name: "New Request", icon: FileText, slug: "/dashboard/requests", role: "CITIZEN" },
    { name: "Manage Requests", icon: FileText, slug: "/dashboard/requests", role: "ADMIN" },

    { name: "Pay Bills", icon: CreditCard, slug: "/dashboard/bills", role: "CITIZEN" },
    { name: "Manage Bills", icon: CreditCard, slug: "/dashboard/bills", role: "ADMIN" },

    { name: "Manage Buildings", icon: Clipboard, slug: "/dashboard/manage-buildings", role: "ADMIN" },
    { name: "Manage Citizens", icon: User, slug: "/dashboard/manage-citizens", role: "ADMIN" },
  ];

  return (
    <main className="flex flex-col items-center min-h-screen w-full">

      {/* ============================================================ */}
      {/* SECTION 1 — WELCOME                                          */}
      {/* ============================================================ */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">

          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">

            {/* LEFT — USER DETAILS */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
                Welcome, <span>{displayName}!</span>
              </h1>

              <div className="mt-3 space-y-1">
                <p className="text-sm md:text-base text-muted-foreground flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  {user.email}
                </p>

                <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {user.role}
                </p>

                {lastLogin && (
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Last login: {lastLogin}
                  </p>
                )}
              </div>
            </div>

            {/* RIGHT — AVATAR */}
            <div className="flex flex-col items-center gap-3">
              <div className="h-20 w-20 rounded-full bg-acc-blue/10 flex items-center justify-center">
                <User className="h-8 w-8 text-acc-blue" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2 — YOUR INFO + NOTIFICATIONS + SETTINGS (SAME ROW)   */}
      {/* ============================================================ */}
      <section className="w-full py-12 bg-card">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">

          {/* SINGLE CARD with two sides: LEFT info / RIGHT tiles */}
          <Card className="bg-background w-full">
            <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>Basic information of your profile</CardDescription>
              </CardHeader>
            <CardContent className="p-6">

              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">

                {/* LEFT — YOUR INFO */}
                <div className="space-y-2 text-sm text-muted-foreground">
                  {/* <h2 className="text-xl font-semibold text-primary mb-2">Your Info</h2> */}

                  <ProfileItem label="Name" value={user.full_name} />
                  <ProfileItem label="Email" value={user.email} />
                  <ProfileItem label="Role" value={user.role} />

                  <p className="font-medium text-lg"><span className="font-medium text-primary text-lg">Name:</span> {user.full_name}</p>
                  <p className="font-medium text-lg"><span className="font-medium text-primary text-lg">Email:</span> {user.email}</p>
                  <p className="font-medium text-lg"><span className="font-medium text-primary text-lg">Role:</span> {user.role}</p>

                  {lastLogin && (
                    <p>
                      <span className="font-medium text-primary">Last login:</span> {lastLogin}
                    </p>
                  )}
                </div>

                {/* RIGHT — NOTIFICATIONS + SETTINGS TILES */}
                <div className="flex flex-row gap-6">

                  <Link
                    href="/dashboard/notifications"
                    className="flex flex-col items-center justify-center gap-2
                               p-4 rounded-lg bg-card border shadow-sm
                               hover:bg-blue-600 hover:border-blue-600
                               transition duration-200 group w-40"
                  >
                    <Bell className="h-6 w-6 text-acc-blue group-hover:text-white transition" />
                    <span className="text-sm font-medium group-hover:text-white">
                      Notifications
                    </span>
                  </Link>

                  <Link
                    href="/dashboard/settings"
                    className="flex flex-col items-center justify-center gap-2
                               p-4 rounded-lg bg-card border shadow-sm
                               hover:bg-blue-600 hover:border-blue-600
                               transition duration-200 group w-40"
                  >
                    <Settings className="h-6 w-6 text-acc-blue group-hover:text-white transition" />
                    <span className="text-sm font-medium group-hover:text-white">
                      Settings
                    </span>
                  </Link>

                </div>
              </div>

            </CardContent>
          </Card>

          {/* ============================================================ */}
          {/* QUICK ACTIONS — BELOW THE ENTIRE BLOCK                       */}
          {/* ============================================================ */}
          <div className="mt-10">
            <Card className="bg-background">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Select an action to continue</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="p-8 rounded-lg bg-card border">
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-10">

                    {quickActions.map((action, i) =>
                      (action.role === user.role || action.role === "ALL") && (
                        <Link
                          key={i}
                          href={action.slug}
                          className="flex flex-col items-center justify-center gap-2
                                    p-4 rounded-lg bg-background border shadow-sm
                                    hover:bg-blue-600 hover:border-blue-600
                                    transition duration-200 group aspect-[6/3]"
                        >
                          <action.icon className="h-7 w-7 text-acc-blue group-hover:text-white transition" />
                          <span className="text-md font-medium group-hover:text-white">
                            {action.name}
                          </span>
                        </Link>
                      )
                    )}

                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </section>
    </main>
  );
}

/* ------------------------------------ */
/* LOADING STATE                        */
/* ------------------------------------ */
function LoadingState() {
  return (
    <main className="flex flex-col items-center min-h-screen w-full bg-gray-50">
      <section className="max-w-6xl w-full px-6 py-20">
        <SkeletonLoader />
      </section>
      <LoadingSpinner message="Loading your dashboard..." />
    </main>
  );
}

function ProfileItem({ label, value }) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <p className="text-lg font-medium">{value || "Not provided"}</p>
    </div>
  );
}