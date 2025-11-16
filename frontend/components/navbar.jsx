"use client";

import * as React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useUser } from "@/context/UserContext";



export default function Navbar() {
  const { user, setUser } = useUser();

  const handleLogout = async () => {
    await fetch("http://localhost:8000/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null); // clear user state
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-primary text-primary-foreground p-4 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl flex items-center">
          {/* <span className="bg-acc-blue text-white rounded-lg px-2 py-1 mr-2">SC</span> */}
          Smart City
        </Link>

        <NavigationMenu viewport={false}>
          <NavigationMenuList className="flex items-center space-x-4">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link 
                  href="/" 
                  className="px-3 py-2 font-medium rounded-md transition-colors"
                >
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link 
                  href="/dashboard" 
                  className="px-3 py-2 font-medium rounded-md transition-colors"
                >
                  Dashboard
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link 
                  href="/departments" 
                  className="px-3 py-2 font-medium rounded-md transition-colors"
                >
                  Departments
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger className="px-3 py-2 rounded-md transition-colors">
                Directory
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-2 p-4 w-[250px] mt-2">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link 
                        href="/contact-directory" 
                        className="block p-3 rounded-md transition-colors"
                      >
                        <div className="font-medium">Contact Directory</div>
                        <div className="text-sm text-muted-foreground">City services & contacts</div>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link 
                        href="/public-representatives" 
                        className="block p-3 rounded-md transition-colors"
                      >
                        <div className="font-medium">Public Representatives</div>
                        <div className="text-sm text-muted-foreground">Local officials & leaders</div>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link 
                        href="/helpline" 
                        className="block p-3 rounded-md transition-colors"
                      >
                        <div className="font-medium">Helpline</div>
                        <div className="text-sm text-muted-foreground">Emergency & support numbers</div>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link 
                        href="/std-pin-codes" 
                        className="block p-3 rounded-md transition-colors"
                      >
                        <div className="font-medium">STD & PIN Codes</div>
                        <div className="text-sm text-muted-foreground">Area & postal codes</div>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link 
                        href="/public-utilities" 
                        className="block p-3 rounded-md transition-colors"
                      >
                        <div className="font-medium">Public Utilities</div>
                        <div className="text-sm text-muted-foreground">Services & utilities</div>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 font-medium text-white rounded-md"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="px-4 py-2 font-medium text-white rounded-md"
                  >
                    Login
                  </Link>
                )}
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}
