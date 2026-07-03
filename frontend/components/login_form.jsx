"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginForm() {
  const { setUser } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({ defaultValues: { email: "", password: "" } });

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        const meRes = await fetch("http://localhost:8000/api/auth/me", { credentials: "include" });
        if (meRes.ok) setUser(await meRes.json());
        toast.success("Welcome back!");
        router.push("/");
      } else {
        toast.error(data.message || "Login failed. Please check your credentials.");
      }
    } catch {
      toast.error("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "bg-background border border-input rounded-lg h-10 px-3 focus:ring-2 focus:ring-ring focus:border-acc-blue text-sm";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground">Email Address</FormLabel>
              <FormControl>
                <Input
                    className="bg-background border border-input rounded-lg py-5 px-4 focus:ring-2 focus:ring-ring focus:border-acc-blue" 
                    placeholder="Try 'admin@example.com' or 'citizen@example.com'" 
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between mb-1">
                <FormLabel className="text-sm font-medium text-foreground">Password</FormLabel>
                <a href="#" className="text-xs text-muted-foreground hover:text-acc-blue transition-colors">
                  Forgot password?
                </a>
              </div>
              <FormControl>
                <Input
                  className={inputClass}
                  type="password"
                    placeholder="Try 'smartcity'" 
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full h-10 bg-acc-blue hover:bg-acc-blue/90 text-white font-semibold rounded-lg transition-colors mt-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</>
          ) : "Sign In"}
        </Button>
      </form>
    </Form>
  );
}