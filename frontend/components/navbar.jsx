'use client';

import Link from "next/link";

export default function Navbar(){
  return (
    <>
    <div className="bg-primary text-background text-xl sticky inset-0">
      <header className="flex flex-row justify-around">
        <div>
        <ul>
          <li className="px-8 py-4 italic"> {/* Can change font to make it better */}
            Smart City
          </li>
        </ul>
        </div>
        <div>
        <ul className="flex justify-start">
          <li className="text-background hover:text-acc-orange px-8 py-4">
            <Link href={`/`}>Home</Link>
          </li>
          <li className="text-background hover:text-acc-orange px-8 py-4">
            <Link href={`/dashboard`}>Dashboard</Link>
          </li>
          <li className="text-background hover:text-acc-orange px-8 py-4">
            <Link href={`departments`}>Departments</Link>
          </li>
          <li className="text-background hover:text-acc-orange px-8 py-4">
            <Link href={`/`}>Directory</Link> {/* A dropdown containg link to all other directories should be placed instead of this */}
          </li>
        </ul>
        </div>
      </header>
      <hr />
      {/*
      <div>
          <Link href={`/`}> Home </Link>
          <Link href={`/dashboard`}> Dashboard </Link>
          <Link href={`/departments`}> Departments </Link>
        <div>
          Directory:-
          <Link href={`/contact-directory`}> Contact Directory </Link>
          <Link href={`/public-representatives`}> Public Representatives </Link>
          <Link href={`/helpline`}> Helpline </Link>
          <Link href={`/std-pin-codes`}> std&pin codes </Link>
          <Link href={`/public-utilities`}> Public Utilities </Link>
        </div>
        </div>
      */}
    </div>
    </>
  );
}