"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Building,
  Lightbulb,
  Phone,
  Users,
  MapPin,
  Landmark,
  FileText,
  CreditCard,
  Clipboard,
  User,
  Mail,
  Shield,
  Bell,
  Settings,
  AlertCircle,
  Receipt,
  Calendar,
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import SkeletonLoader from "@/components/SkeletonLoader";

/* ------------------------------------------------------------------ */
/* SHARED DATA                                                          */
/* ------------------------------------------------------------------ */
const features = [
  {
    title: "Directory Services",
    description:
      "Access comprehensive contact information for city services and officials",
    href: "/contact-directory",
    icon: <Landmark className="h-10 w-10 text-acc-blue" />,
  },
  {
    title: "Public Utilities",
    description:
      "Find information about utilities and services available in your area",
    href: "/public-utilities",
    icon: <Lightbulb className="h-10 w-10 text-acc-blue" />,
  },
  {
    title: "Departments",
    description: "Explore various city departments and their functions",
    href: "/departments",
    icon: <Building className="h-10 w-10 text-acc-blue" />,
  },
  {
    title: "Helpline",
    description: "Quick access to emergency and non-emergency helpline numbers",
    href: "/helpline",
    icon: <Phone className="h-10 w-10 text-acc-blue" />,
  },
  {
    title: "Public Representatives",
    description: "Connect with your local representatives and officials",
    href: "/public-representatives",
    icon: <Users className="h-10 w-10 text-acc-blue" />,
  },
  {
    title: "STD & PIN Codes",
    description: "Search for area codes and postal codes across the city",
    href: "/std-pin-codes",
    icon: <MapPin className="h-10 w-10 text-acc-blue" />,
  },
];

/* ------------------------------------------------------------------ */
/* MAIN PAGE                                                            */
/* ------------------------------------------------------------------ */
export default function Home() {
  const { user, loading } = useUser();

  if (loading) return <LoadingState />;

  return user ? <AuthenticatedView user={user} /> : <UnauthenticatedView />;
}

/* ------------------------------------------------------------------ */
/* UNAUTHENTICATED VIEW                                                 */
/* ------------------------------------------------------------------ */
function UnauthenticatedView() {
  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      {/* Login CTA */}
      <section className="w-full py-8 bg-acc-blue/10 border-b border-acc-blue/20">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-base md:text-lg font-medium text-primary">
            Sign in to access your personalised city dashboard and services.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-acc-blue px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-acc-blue/90 transition-colors shrink-0"
          >
            Login to access your city data
          </Link>
        </div>
      </section>

      {/* Hero */}
      <section className="w-full py-16 md:py-28 bg-background">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="flex flex-col items-center space-y-5 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-acc-blue/10 border border-acc-blue/20 text-acc-blue text-xs font-semibold uppercase tracking-widest">
              Smart City Portal
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-primary max-w-2xl">
              Your City, Digitally Connected
            </h1>
            <p className="mx-auto max-w-[600px] text-muted-foreground text-lg">
              One platform for all city services, information, and citizen engagement.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 mt-2 rounded-lg bg-acc-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-acc-blue/90 transition-colors"
            >
              Get Started →
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <ServicesSection />
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* AUTHENTICATED VIEW                                                   */
/* ------------------------------------------------------------------ */
function AdminStatsBar() {
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/stats", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => setStats(null))
      .finally(() => setStatsLoading(false));
  }, []);

  const items = [
    { label: "Total Citizens",    value: stats?.totalCitizens,   icon: Users,       color: "text-acc-blue",   border: "border-t-acc-blue" },
    { label: "Total Bills",       value: stats?.totalBills,      icon: Receipt,     color: "text-acc-green",  border: "border-t-acc-green" },
    { label: "Pending Requests",  value: stats?.pendingRequests, icon: AlertCircle, color: "text-acc-yellow", border: "border-t-acc-yellow" },
    { label: "Overdue Bills",     value: stats?.overdueBills,    icon: Calendar,    color: "text-red-500",    border: "border-t-red-500" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {items.map(({ label, value, icon: Icon, color, border }) => (
        <Card key={label} className={`border-t-4 ${border} bg-white`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {label}
            </CardTitle>
            <Icon className={`h-5 w-5 ${color}`} />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="h-7 w-12 bg-gray-200 rounded animate-pulse" />
            ) : (
              <div className="text-2xl font-bold text-primary">{value ?? "—"}</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AuthenticatedView({ user }) {
  const displayName = user.full_name || user.email;
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const lastLogin = user.last_login
    ? new Date(user.last_login).toLocaleString()
    : null;

  const isAdmin = user.role === "ADMIN";

  const quickActions = isAdmin
    ? [
        { name: "Manage Requests", icon: FileText, slug: "/dashboard/requests" },
        { name: "Manage Bills", icon: CreditCard, slug: "/dashboard/bills" },
        { name: "Manage Buildings", icon: Clipboard, slug: "/dashboard/manage-buildings" },
        { name: "Manage Citizens", icon: User, slug: "/dashboard/manage-citizens" },
        { name: "Notifications", icon: Bell, slug: "/dashboard/notifications" },
        { name: "Settings", icon: Settings, slug: "/dashboard/settings" },
      ]
    : [
        { name: "New Request", icon: FileText, slug: "/dashboard/requests" },
        { name: "Pay Bills", icon: CreditCard, slug: "/dashboard/bills" },
        { name: "Notifications", icon: Bell, slug: "/dashboard/notifications" },
        { name: "Settings", icon: Settings, slug: "/dashboard/settings" },
      ];

  return (
    <main className="flex flex-col items-center min-h-screen w-full">

      {/* ── GREETING HEADER ── */}
      <section className="w-full bg-primary border-b border-white/10">
        <div className="container mx-auto max-w-6xl px-4 md:px-6 py-10 md:py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">

            {/* Avatar */}
            <div className="shrink-0 h-16 w-16 rounded-xl bg-acc-orange flex items-center justify-center text-xl font-bold text-white">
              {initials || <User className="h-7 w-7" />}
            </div>

            {/* Greeting */}
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-acc-orange mb-1">Smart City Portal</p>
              <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                Welcome back, <span className="text-acc-orange">{displayName}</span>
              </h1>
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-white/50">
                <span className="flex items-center gap-2"><Mail className="h-4 w-4" />{user.email}</span>
                <span className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="text-white/80 font-medium">{user.role}</span>
                </span>
                {lastLogin && (
                  <span className="flex items-center gap-2"><Bell className="h-4 w-4" />Last login: {lastLogin}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DASHBOARD BODY ── */}
      <section className="w-full py-10 bg-muted-background">
        <div className="mx-auto max-w-4xl px-4 md:px-6 space-y-8">

          {/* ── PROFILE CARD ── */}
          <div className="bg-white border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex items-center gap-2">
              <User className="h-4 w-4 text-acc-blue" />
              <span className="text-sm font-semibold text-primary">Profile Details</span>
            </div>
            <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-6">
              {user.full_name && (
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-0.5">Name</p>
                  <p className="text-sm font-semibold text-primary">{user.full_name}</p>
                </div>
              )}
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-0.5">Email</p>
                <p className="text-sm font-semibold text-primary truncate">{user.email}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-0.5">Role</p>
                <span className="inline-block px-2 py-0.5 rounded-md text-xs font-semibold bg-acc-yellow/15 text-primary border border-acc-yellow/40">
                  {user.role}
                </span>
              </div>
              {lastLogin && (
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-0.5">Last Login</p>
                  <p className="text-xs font-medium text-primary">{lastLogin}</p>
                </div>
              )}
            </div>
          </div>

          {/* ── ADMIN STATS BAR ── */}
          {isAdmin && <AdminStatsBar />}

          {/* ── QUICK ACTIONS ── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="h-6 w-0.5 rounded-full bg-acc-blue" />
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, i) => (
                <Link
                  key={i}
                  href={action.slug}
                  className="group flex items-center gap-3 px-4 py-3.5 bg-white border border-border rounded-xl hover:border-acc-blue/50 hover:bg-acc-blue/5 transition-colors duration-150"
                >
                  <div className="shrink-0 flex items-center justify-center h-8 w-8 rounded-lg bg-muted border border-border group-hover:bg-acc-blue/10 group-hover:border-acc-blue/20 transition-colors duration-150">
                    <action.icon className="h-4 w-4 text-primary/70" />
                  </div>
                  <span className="text-sm font-medium text-primary">{action.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="w-full border-t border-border bg-background">
        <div className="container mx-auto max-w-6xl px-4 md:px-6 py-6 flex items-center gap-3">
          <span className="h-4 w-1 rounded-full bg-acc-yellow shrink-0" />
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            City Services Directory
          </span>
        </div>
      </div>

      {/* ── SECTION 3 — CITY DIRECTORIES ── */}
      <ServicesSection />
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* SHARED: SERVICES / DIRECTORIES SECTION                              */
/* ------------------------------------------------------------------ */
function ServicesSection() {
  return (
    <section id="services" className="w-full py-16 md:py-24 bg-muted-background border-t border-border">
      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary">City Services Directory</h2>
          <p className="mt-3 text-muted-foreground text-base max-w-xl mx-auto leading-relaxed">
            Explore the wide range of services available through our digital platform.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.href}
              className="group flex items-start gap-5 p-7 bg-white border border-border rounded-xl hover:border-acc-blue/40 hover:bg-acc-blue/5 transition-all duration-200"
            >
              <div className="shrink-0 flex items-center justify-center h-12 w-12 rounded-xl bg-muted border border-border group-hover:bg-acc-blue/10 group-hover:border-acc-blue/20 transition-colors duration-200">
                {feature.icon}
              </div>
              <div>
                <p className="text-base font-bold text-primary">{feature.title}</p>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{feature.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* LOADING STATE                                                        */
/* ------------------------------------------------------------------ */
function LoadingState() {
  return (
    <main className="flex flex-col items-center min-h-screen w-full bg-gray-50">
      <section className="max-w-6xl w-full px-6 py-20">
        <SkeletonLoader />
      </section>
      <LoadingSpinner message="Loading your city portal..." />
    </main>
  );
}
