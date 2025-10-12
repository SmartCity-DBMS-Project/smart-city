import Link from "next/link";
import * as Card from "@/components/ui/card";
import { Building, GraduationCap, School, Hospital, Mailbox, Book, Lightbulb, Train } from "lucide-react";

export default function Page(){
    const utilities = [
        {name: "Banks", link: "banks", icon: <Building className="h-8 w-8 text-acc-blue" />, description: "Financial services and institutions"},
        {name: "Colleges & Universities", link: "colleges-universities", icon: <GraduationCap className="h-8 w-8 text-acc-blue" />, description: "Higher education institutions"},
        {name: "Schools", link: "schools", icon: <School className="h-8 w-8 text-acc-blue" />, description: "Primary and secondary education"},
        {name: "Hospitals", link: "hospitals", icon: <Hospital className="h-8 w-8 text-acc-blue" />, description: "Healthcare facilities and services"},
        {name: "Postal", link: "postal", icon: <Mailbox className="h-8 w-8 text-acc-blue" />, description: "Mail and postal services"},
        {name: "Libraries", link: "libraries", icon: <Book className="h-8 w-8 text-acc-blue" />, description: "Public libraries and resources"},
        {name: "Utilities", link: "utilities", icon: <Lightbulb className="h-8 w-8 text-acc-blue" />, description: "Electricity, water, and gas services"},
        {name: "Transportation", link: "transportation", icon: <Train className="h-8 w-8 text-acc-blue" />, description: "Public transit and transportation"}
    ]
    
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                      {utilities.map((util, index) => (
                        <Link
                          key={util.link}
                          href={`/public-utilities/${util.link}`}
                          className="block"
                        >
                          <Card.Card className="h-full hover:shadow-lg transition-all duration-300 border-t-4 border-t-acc-blue bg-card">
                            <Card.CardHeader className="p-6">
                              <div className="mb-4 flex justify-center">
                                {util.icon}
                              </div>
                              <Card.CardTitle className="text-xl font-bold mb-2">{util.name}</Card.CardTitle>
                            </Card.CardHeader>
                            <Card.CardContent className="px-6 pb-6">
                              <p className="text-muted-foreground text-sm mb-4">{util.description}</p>
                              <div className="inline-flex items-center text-acc-blue hover:underline">
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