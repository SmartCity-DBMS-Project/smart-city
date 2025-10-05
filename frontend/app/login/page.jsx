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
    <main className="flex flex-col items-center min-h-screen justify-start p-24">
        <div className="px-12 pb-14 bg-card rounded-2xl w-1/4 max-w-lg shadow-lg">
            <LoginForm />
        </div>
    </main>
    );
}