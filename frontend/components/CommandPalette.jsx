"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Home, 
  FileText, 
  CreditCard, 
  Building, 
  Users, 
  Bell, 
  Settings,
  User,
  BookOpen,
  Droplets,
  Car,
  TreePine,
  Shield,
  Plug,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Heart
} from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Toggle command palette with Ctrl+K or Cmd+K
  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Navigation items
  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Departments", href: "/departments", icon: Building },
    { name: "Bills", href: "/dashboard/bills", icon: CreditCard },
    { name: "Service Requests", href: "/dashboard/requests", icon: FileText },
    { name: "Buildings", href: "/dashboard/manage-buildings", icon: Building },
    { name: "Citizens", href: "/dashboard/manage-citizens", icon: Users },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  // Department items
  const departmentItems = [
    { name: "Health", href: "/departments/health", icon: Heart },
    { name: "Education", href: "/departments/education", icon: BookOpen },
    { name: "Water", href: "/departments/water", icon: Droplets },
    { name: "Municipal", href: "/departments/municipal", icon: Building },
    { name: "Transportation", href: "/departments/transportation", icon: Car },
    { name: "Environment", href: "/departments/environment", icon: TreePine },
    { name: "Public Safety", href: "/departments/safety", icon: Shield },
    { name: "Utilities", href: "/departments/utilities", icon: Plug },
  ];

  // Directory items
  const directoryItems = [
    { name: "Contact Directory", href: "/contact-directory", icon: Phone },
    { name: "Public Representatives", href: "/public-representatives", icon: Users },
    { name: "Helpline", href: "/helpline", icon: Phone },
    { name: "STD & PIN Codes", href: "/std-pin-codes", icon: MapPin },
    { name: "Public Utilities", href: "/public-utilities", icon: Plug },
  ];

  // Quick actions
  const quickActions = [
    { name: "Pay Bills", href: "/dashboard/bills", icon: CreditCard },
    { name: "New Service Request", href: "/dashboard/requests", icon: FileText },
    { name: "View Notifications", href: "/dashboard/notifications", icon: Bell },
    { name: "Update Profile", href: "/dashboard/settings", icon: User },
  ];

  // Handle navigation
  const handleNavigation = (href) => {
    router.push(href);
    setOpen(false);
  };

  return (
    <>
      <div 
        className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" />
        <span>Search...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandGroup heading="Navigation">
            {navigationItems.map((item) => (
              <CommandItem
                key={item.name}
                onSelect={() => handleNavigation(item.href)}
                className="cursor-pointer"
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          
          <CommandSeparator />
          
          <CommandGroup heading="Departments">
            {departmentItems.map((item) => (
              <CommandItem
                key={item.name}
                onSelect={() => handleNavigation(item.href)}
                className="cursor-pointer"
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          
          <CommandSeparator />
          
          <CommandGroup heading="Directory">
            {directoryItems.map((item) => (
              <CommandItem
                key={item.name}
                onSelect={() => handleNavigation(item.href)}
                className="cursor-pointer"
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          
          <CommandSeparator />
          
          <CommandGroup heading="Quick Actions">
            {quickActions.map((item) => (
              <CommandItem
                key={item.name}
                onSelect={() => handleNavigation(item.href)}
                className="cursor-pointer"
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}