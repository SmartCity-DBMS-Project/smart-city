'use client';
import React from "react";
import LoginForm from "../../components/login_form";

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center min-h-screen w-full bg-muted-background">
      <section className="w-full flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary mb-4">
              <span className="text-white text-lg font-bold">SC</span>
            </div>
            <h1 className="text-2xl font-bold text-primary">Welcome Back</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in to access your Smart City account
            </p>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-xl border border-border p-8">
            <LoginForm />
          </div>

          {/* Footer note */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a href="#" className="text-acc-blue hover:underline font-medium">
              Contact Admin
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}