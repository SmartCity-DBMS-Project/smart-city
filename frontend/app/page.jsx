"use client";
import Link from "next/link";

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
    icon: <Landmark className="h-8 w-8 text-acc-blue" />,
  },
  {
    title: "Public Utilities",
    description:
      "Find information about utilities and services available in your area",
    href: "/public-utilities",
    icon: <Lightbulb className="h-8 w-8 text-acc-blue" />,
  },
  {
    title: "Departments",
    description: "Explore various city departments and their functions",
    href: "/departments",
    icon: <Building className="h-8 w-8 text-acc-blue" />,
  },
  {
    title: "Helpline",
    description: "Quick access to emergency and non-emergency helpline numbers",
    href: "/helpline",
    icon: <Phone className="h-8 w-8 text-acc-blue" />,
  },
  {
    title: "Public Representatives",
    description: "Connect with your local representatives and officials",
    href: "/public-representatives",
    icon: <Users className="h-8 w-8 text-acc-blue" />,
  },
  {
    title: "STD & PIN Codes",
    description: "Search for area codes and postal codes across the city",
    href: "/std-pin-codes",
    icon: <MapPin className="h-8 w-8 text-acc-blue" />,
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
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
                Smart City Portal
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Your one-stop digital platform for all city services,
                information, and citizen engagement.
              </p>
            </div>
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

      {/* ============================================================ */}
      {/* GREETING HEADER — flat, dark, minimal                        */}
      {/* ============================================================ */}
      <section className="w-full bg-primary">
        <div className="container mx-auto max-w-6xl px-4 md:px-8 py-10 md:py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">

            {/* INITIALS AVATAR */}
            <div className="shrink-0 h-16 w-16 rounded-lg bg-acc-orange flex items-center justify-center text-xl font-bold text-white">
              {initials || <User className="h-7 w-7" />}
            </div>

            {/* GREETING + META */}
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-acc-orange mb-1">
                Smart City Portal
              </p>
              <h1 className="text-2xl md:text-4xl font-bold text-white leading-snug">
                Welcome back,{" "}
                <span className="text-acc-orange">{displayName}</span>
              </h1>

              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-white/60">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  {user.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5" />
                  <span className="text-white/90 font-medium">{user.role}</span>
                </span>
                {lastLogin && (
                  <span className="flex items-center gap-1.5">
                    <Bell className="h-3.5 w-3.5" />
                    Last login: {lastLogin}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* DASHBOARD BODY                                               */}
      {/* ============================================================ */}
      <section className="w-full py-10 bg-muted-background">
        <div className="mx-auto max-w-3xl px-4 md:px-6 space-y-8">

          {/* ── PROFILE DETAILS ── */}
          <div className="bg-white border border-border rounded-lg overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex items-center gap-2">
              <User className="h-4 w-4 text-acc-blue" />
              <span className="text-sm font-semibold text-primary">Profile Details</span>
            </div>
            <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-6 text-sm">
              {user.full_name && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Name</p>
                  <p className="font-semibold text-primary">{user.full_name}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Email</p>
                <p className="font-semibold text-primary truncate">{user.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Role</p>
                <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-acc-yellow/15 text-primary border border-acc-yellow/40">
                  {user.role}
                </span>
              </div>
              {lastLogin && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Last Login</p>
                  <p className="font-semibold text-primary text-xs">{lastLogin}</p>
                </div>
              )}
            </div>
          </div>

          {/* ── QUICK ACTIONS ── */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-5 w-1 rounded-full bg-acc-blue" />
              <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
                Quick Actions
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
              {quickActions.map((action, i) => (
                <Link
                  key={i}
                  href={action.slug}
                  className="group flex items-center gap-4 px-5 py-4 bg-white border border-border rounded-lg hover:border-acc-blue hover:bg-acc-blue/5 transition-colors duration-150"
                >
                  <div className="shrink-0 flex items-center justify-center h-9 w-9 rounded-md bg-muted border border-border group-hover:bg-acc-blue/10 group-hover:border-acc-blue/30 transition-colors duration-150">
                    <action.icon className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-primary">
                    {action.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* DIVIDER                                                       */}
      {/* ============================================================ */}
      <div className="w-full border-t border-border bg-muted-background">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center gap-3">
          <span className="h-4 w-1 rounded-full bg-acc-yellow shrink-0" />
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            City Services Directory
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 3 — CITY DIRECTORIES (same as unauthenticated)       */}
      {/* ============================================================ */}
      <ServicesSection />
    </main>
  );
}




/* ------------------------------------------------------------------ */
/* SHARED: SERVICES / DIRECTORIES SECTION                              */
/* ------------------------------------------------------------------ */
function ServicesSection() {
  return (
    <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-card">
      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
              Our Services
            </h2>
            <p className="mx-auto max-w-[700px] text-acc-blue md:text-xl">
              Explore the wide range of services available through our digital
              platform.
            </p>
          </div>
        </div>
        <div className="mx-auto grid gap-6 py-12 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="flex flex-col items-center text-center p-6 transition-all hover:shadow-lg hover:border-acc-blue/50 w-full max-w-xs bg-white"
            >
              <div className="mb-4 flex justify-center">{feature.icon}</div>
              <CardHeader className="p-0 mb-2 flex justify-center">
                <CardTitle className="text-xl font-bold">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex flex-col items-center">
                <CardDescription className="mb-4 text-center">
                  {feature.description}
                </CardDescription>
                <Link
                  href={feature.href}
                  className="inline-flex items-center text-acc-blue hover:underline justify-center"
                >
                  Explore
                  <svg
                    className="ml-1 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </Link>
              </CardContent>
            </Card>
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
