"use client";
import React, { useState } from "react";  // Added useState import
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import z from "zod";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";  // Added Loader2 icon

export default function LoginForm() {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);  // Added loading state

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);  // Set loading state to true when starting request
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' },
        body: JSON.stringify(values),
        credentials: "include",
      });

      const data = await response.json();
      console.log('Response: ', data);

      if (response.ok) {
        const res = await fetch("http://localhost:8000/auth/me", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data); // contains { email, role }
        }
        router.push("/dashboard");
      } else {
        alert("Login failed: " + data.message);
      }
    } catch(error) {
      console.log("Error: ", error);
      console.log(JSON.stringify(values));
      alert("An error occured");
    } finally {
      setIsLoading(false);  // Reset loading state when request completes
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2 text-center mb-6">
            <h2 className="text-2xl font-bold text-primary">Sign In</h2>
            <p className="text-muted-foreground">Enter your credentials to access your account</p>
          </div>
          
          {/* Username */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Email Address</FormLabel>
                <FormControl>
                  <Input 
                    className="bg-background border border-input rounded-lg py-5 px-4 focus:ring-2 focus:ring-ring focus:border-acc-blue" 
                    placeholder="Enter your email" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-foreground">Password</FormLabel>
                  <a href="#" className="text-sm text-acc-blue hover:underline">Forgot password?</a>
                </div>
                <FormControl>
                  <Input 
                    className="bg-background border border-input rounded-lg py-5 px-4 focus:ring-2 focus:ring-ring focus:border-acc-blue" 
                    type="password" 
                    placeholder="Enter your password" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        
          {/* Remember me 
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="remember" 
              className="h-4 w-4 rounded border-border text-acc-blue focus:ring-acc-blue"
            />
            <label htmlFor="remember" className="text-sm text-foreground">Remember me</label>
          </div>
          */}

          {/* Submit */}
          <Button 
            type="submit" 
            className="w-full bg-acc-blue hover:bg-acc-blue/90 text-white py-5 rounded-lg font-medium transition-colors"
            disabled={isLoading}  // Disable button when loading
          >
            {isLoading ? (  // Show loading spinner when loading
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
          
        </form>
      </Form>
    </div>
  );
}