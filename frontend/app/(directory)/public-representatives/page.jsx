import { Users, User, Phone, Mail, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page(){
    const representatives = [
        {
            name: "Mayor John Smith",
            position: "City Mayor",
            district: "At-Large",
            phone: "(123) 456-7100",
            email: "mayor@smartcity.gov",
            office: "City Hall, Room 100"
        },
        {
            name: "Jane Doe",
            position: "City Councilor",
            district: "District 1",
            phone: "(123) 456-7101",
            email: "council1@smartcity.gov",
            office: "City Hall, Room 101"
        },
        {
            name: "Robert Johnson",
            position: "City Councilor",
            district: "District 2",
            phone: "(123) 456-7102",
            email: "council2@smartcity.gov",
            office: "City Hall, Room 102"
        },
        {
            name: "Sarah Williams",
            position: "City Councilor",
            district: "District 3",
            phone: "(123) 456-7103",
            email: "council3@smartcity.gov",
            office: "City Hall, Room 103"
        }
    ];

    return (
        <main className="flex flex-col items-center min-h-screen w-full">
            {/* Header Section - Full width with distinct darker color */}
            <section className="w-full py-12 md:py-16 bg-acc-blue/20">
                <div className="container px-4 md:px-6 mx-auto max-w-6xl">
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl font-bold text-primary mb-4">Public Representatives</h1>
                        <div className="w-24 h-1 bg-acc-blue mx-auto mb-6 rounded-full"></div>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            Connect with your local representatives and officials. 
                            Our elected officials work to represent the interests of all citizens in our community.
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section - Full width with distinct darker color */}
            <section className="w-full py-12 bg-acc-orange/20">
                <div className="container px-4 md:px-6 mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {representatives.map((rep, index) => (
                            <Card key={index} className="hover:shadow-lg transition-all duration-300 border-t-4 border-t-acc-blue bg-card">
                                <CardHeader>
                                    <div className="flex items-center">
                                        <User className="h-8 w-8 text-acc-blue mr-3" />
                                        <CardTitle className="text-xl font-bold">{rep.name}</CardTitle>
                                    </div>
                                    <CardDescription className="text-acc-blue font-medium">{rep.position}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                                            <span className="text-sm">{rep.district}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                                            <span className="text-sm">{rep.phone}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                                            <span className="text-sm">{rep.email}</span>
                                        </div>
                                        <div className="flex items-start">
                                            <MapPin className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                                            <span className="text-sm">{rep.office}</span>
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