"use client";
import React from 'react';


export default function Field({id, name, placeholder,value, type="text", onChange}){
    return(<div>
        <label htmlFor={id} className='text-blue-600'><p>{name} : </p></label>
        <input
        id={id}
        name={name}
        placeholder={placeholder}
        type={type}
        onChange={onChange} 
        value={value}
        className='border border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 p-1'
        />
    </div>);
}