import { Search, MapPin, Hash } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page(){
    const codes = [
        {
            area: "Downtown",
            pinCode: "10001",
            stdCode: "212",
            description: "Central business district and financial area"
        },
        {
            area: "Uptown",
            pinCode: "10002",
            stdCode: "213",
            description: "Residential and commercial neighborhood"
        },
        {
            area: "Midtown",
            pinCode: "10003",
            stdCode: "214",
            description: "Mixed-use area with parks and shopping"
        },
        {
            area: "Westside",
            pinCode: "10004",
            stdCode: "215",
            description: "Residential suburbs and recreational areas"
        }
    ];

    return (
        <main className="flex flex-col items-center min-h-screen w-full">
            {/* Header Section - Using homepage pattern with bg-background */}
            <section className="w-full py-12 md:py-16 bg-background">
                <div className="container px-4 md:px-6 mx-auto max-w-6xl">
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl font-bold text-primary mb-4">STD & PIN Codes</h1>
                        <div className="w-24 h-1 bg-acc-blue mx-auto mb-6 rounded-full"></div>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            Search for area codes (STD) and postal codes (PIN) across the city. 
                            Use these codes for postal services, telecommunications, and geographic identification.
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section - Using homepage pattern with bg-card */}
            <section className="w-full py-12 bg-card">
                <div className="container px-4 md:px-6 mx-auto max-w-6xl">
                    <div className="w-full max-w-6xl mb-8">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search by area name, PIN code, or STD code..."
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-acc-blue focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        {codes.map((code, index) => (
                            <Card key={index} className="hover:shadow-lg transition-all duration-300 border-t-4 border-t-acc-blue bg-card">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold flex items-center">
                                        <MapPin className="h-5 w-5 mr-2 text-acc-blue" />
                                        {code.area}
                                    </CardTitle>
                                    <CardDescription>{code.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-background p-3 rounded-lg">
                                            <div className="flex items-center text-sm text-muted-foreground mb-1">
                                                <Hash className="h-4 w-4 mr-1" />
                                                PIN Code
                                            </div>
                                            <div className="font-bold text-lg">{code.pinCode}</div>
                                        </div>
                                        <div className="bg-background p-3 rounded-lg">
                                            <div className="flex items-center text-sm text-muted-foreground mb-1">
                                                <Hash className="h-4 w-4 mr-1" />
                                                STD Code
                                            </div>
                                            <div className="font-bold text-lg">{code.stdCode}</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}