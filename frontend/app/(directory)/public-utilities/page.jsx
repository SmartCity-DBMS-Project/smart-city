"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import * as Card from "@/components/ui/card";
import { Building, GraduationCap, School, Hospital, Mailbox, Book, Lightbulb, Train, Shield, Loader2 } from "lucide-react";

export default function Page(){
    const [utilities, setUtilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUtilities();
    }, []);

    const fetchUtilities = async () => {
        try {
            setLoading(true);
            // Simulating API call with mock data since there's no actual API endpoint for this
            // In a real implementation, this would fetch from an actual backend endpoint
            const mockUtilities = [
                {name: "Banks", link: "bank", icon: "Building", description: "Financial services and institutions"},
                {name: "Colleges & Universities", link: "college", icon: "GraduationCap", description: "Higher education institutions"},
                {name: "Schools", link: "school", icon: "School", description: "Primary and secondary education"},
                {name: "Hospitals", link: "hospital", icon: "Hospital", description: "Healthcare facilities and services"},
                {name: "Postal Services", link: "postal_office", icon: "Mailbox", description: "Mail and postal services"},
                {name: "Libraries", link: "library", icon: "Book", description: "Public libraries and resources"},
                {name: "Police Stations", link: "police_station", icon: "Shield", description: "Law enforcement services"},
                {name: "Utilities", link: "utilities", icon: "Lightbulb", description: "Electricity, water, and gas services"},
                {name: "Transportation", link: "transportation", icon: "Train", description: "Public transit and transportation"}
            ];
            
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            setUtilities(mockUtilities);
        } catch (err) {
            setError("Failed to load utilities. Please try again later.");
            console.error("Error fetching utilities:", err);
        } finally {
            setLoading(false);
        }
    };

    const getIconComponent = (iconName) => {
        switch (iconName) {
            case "Building": return <Building className="h-8 w-8 text-acc-blue" />;
            case "GraduationCap": return <GraduationCap className="h-8 w-8 text-acc-blue" />;
            case "School": return <School className="h-8 w-8 text-acc-blue" />;
            case "Hospital": return <Hospital className="h-8 w-8 text-acc-blue" />;
            case "Mailbox": return <Mailbox className="h-8 w-8 text-acc-blue" />;
            case "Book": return <Book className="h-8 w-8 text-acc-blue" />;
            case "Shield": return <Shield className="h-8 w-8 text-acc-blue" />;
            case "Lightbulb": return <Lightbulb className="h-8 w-8 text-acc-blue" />;
            case "Train": return <Train className="h-8 w-8 text-acc-blue" />;
            default: return <Building className="h-8 w-8 text-acc-blue" />;
        }
    };

    if (loading) {
        return (
            <main className="flex flex-col items-center min-h-screen w-full">
                <section className="w-full py-12 md:py-16 bg-background">
                    <div className="container px-4 md:px-6 mx-auto max-w-6xl">
                        <div className="mb-12 text-center">
                            <h1 className="text-4xl font-bold text-primary mb-4">Public Utilities</h1>
                            <div className="w-24 h-1 bg-acc-blue mx-auto mb-6 rounded-full"></div>
                            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                                Access essential services and facilities available throughout our city.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="w-full py-12 bg-card flex-1 flex items-center justify-center">
                    <div className="container px-4 md:px-6 mx-auto max-w-6xl">
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="h-12 w-12 animate-spin text-acc-blue mb-4" />
                            <p className="text-muted-foreground">Loading public utilities...</p>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex flex-col items-center min-h-screen w-full">
                <section className="w-full py-12 md:py-16 bg-background">
                    <div className="container px-4 md:px-6 mx-auto max-w-6xl">
                        <div className="mb-12 text-center">
                            <h1 className="text-4xl font-bold text-primary mb-4">Public Utilities</h1>
                            <div className="w-24 h-1 bg-acc-blue mx-auto mb-6 rounded-full"></div>
                            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                                Access essential services and facilities available throughout our city.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="w-full py-12 bg-card flex-1 flex items-center justify-center">
                    <div className="container px-4 md:px-6 mx-auto max-w-6xl">
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="text-red-500 mb-4">Error: {error}</div>
                            <button 
                                onClick={fetchUtilities}
                                className="px-4 py-2 bg-acc-blue text-white rounded-md hover:bg-acc-blue/90 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="flex flex-col items-center min-h-screen w-full">
            {/* Header Section - Using homepage pattern with bg-background */}
            <section className="w-full py-12 md:py-16 bg-background">
                <div className="container px-4 md:px-6 mx-auto max-w-6xl">
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl font-bold text-primary mb-4">Public Utilities</h1>
                        <div className="w-24 h-1 bg-acc-blue mx-auto mb-6 rounded-full"></div>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                          Access essential services and facilities available throughout our city. 
                          These public utilities are designed to support the daily needs of our residents.
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section - Using homepage pattern with bg-card */}
            <section className="w-full py-12 bg-card">
                <div className="container px-4 md:px-6 mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                      {utilities.map((util, index) => (
                        <Link
                          key={util.link}
                          href={`/public-utilities/${util.link}`}
                          className="block"
                        >
                          <Card.Card className="h-full hover:shadow-lg transition-all duration-300 border-t-4 border-t-acc-blue bg-card hover:border-t-acc-blue/80">
                            <Card.CardHeader className="p-6">
                              <div className="mb-4 flex justify-center">
                                {getIconComponent(util.icon)}
                              </div>
                              <Card.CardTitle className="text-xl font-bold mb-2 text-center">{util.name}</Card.CardTitle>
                            </Card.CardHeader>
                            <Card.CardContent className="px-6 pb-6">
                              <p className="text-muted-foreground text-sm mb-4 text-center">{util.description}</p>
                              <div className="inline-flex items-center text-acc-blue hover:underline justify-center w-full">
                                Explore
                                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                              </div>
                            </Card.CardContent>
                          </Card.Card>
                        </Link>
                      ))}
                    </div>
                </div>
            </section>
        </main>
    );
}