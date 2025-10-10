'use client';
import React from "react";
import LoginForm from "../../components/login_form";

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-2">Smart City Portal</h1>
                    <p className="text-muted-foreground">Access your city services and data</p>
                </div>

                {/* Login Form */}
                <LoginForm />

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <a 
                            href="#" 
                            className="text-acc-blue hover:text-acc-blue/80 transition-colors font-medium"
                        >
                            Contact Administrator
                        </a>
                    </p>
                </div>
            </div>
        </main>
    );
}