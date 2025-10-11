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

    {/*<form onSubmit={handleSubmit}>
        <Field id="email" name="Email" placeholder="Email" value={values.Email} onChange={handleChange}/>
        <br></br>
        <Field id="password" name="Password" placeholder="Password" value={values.Password} onChange={handleChange}/>
        <br></br>
        <button onClick={handleSubmit} className="text-white bg-purple-400 p-1 border border-cyan-200 rounded-lg 
        focus:outline-none focus:ring-2 focus:ring-blue-400 " >
            Submit
        </button>
    </form>*/}

    return(
    <main className="flex flex-col items-center min-h-screen w-full">
        {/* Full width section with distinct darker color */}
        <section className="w-full py-12 md:py-24 bg-acc-blue/20">
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