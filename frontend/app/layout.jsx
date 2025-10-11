import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Smart City Portal",
  description: "Your one-stop digital platform for all city services",
};

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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <main className="flex-1 pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}