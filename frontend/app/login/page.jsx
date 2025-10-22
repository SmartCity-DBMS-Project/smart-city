'use client';
import React from "react";
import { useState } from "react";
import LoginForm from "../../components/login_form";

export default function Loginpage(){
    const [values, setValues] = useState({Email: '',Password: ''})
    
    function handleChange(e){
        const {name, value} = e.target
        setValues(prev => ({...prev, [name] : value}))
    }

    function handleSubmit(e) {
    e.preventDefault();
    console.log(values);
    }

    return(
    <main className="flex flex-col items-center min-h-screen w-full">
        {/* Full width section using homepage pattern with bg-background */}
        <section className="w-full py-12 md:py-24 bg-background">
            <div className="container px-4 md:px-6 mx-auto max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-2">Welcome Back</h1>
                    <p className="text-muted-foreground">Sign in to access your Smart City account</p>
                </div>
                <div className="bg-card rounded-2xl shadow-lg p-8 border border-input">
                    <LoginForm />
                </div>
                <div className="mt-6 text-center text-sm text-muted-foreground">
                    <p>Don't have an account? <a href="#" className="text-acc-blue hover:underline">Contact Admin</a></p>
                </div>
            </div>
        </section>
    </main>
    );
}