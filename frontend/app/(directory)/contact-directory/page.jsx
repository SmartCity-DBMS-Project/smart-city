import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Page(){
    const contacts = [
        {
            department: "Municipal Corporation",
            phone: "(123) 456-7890",
            email: "info@municipal.gov",
            address: "City Hall, Main Street",
        },
        {
            department: "Police Department",
            phone: "(123) 456-7891",
            email: "police@municipal.gov",
            address: "123 Law Street",
        },
        {
            department: "Fire Department",
            phone: "(123) 456-7892",
            email: "fire@municipal.gov",
            address: "456 Emergency Avenue",
        },
        {
            department: "Public Works",
            phone: "(123) 456-7893",
            email: "publicworks@municipal.gov",
            address: "789 Infrastructure Road",
        },
        {
            department: "Health Department",
            phone: "(123) 456-7894",
            email: "health@municipal.gov",
            address: "101 Wellness Boulevard",
        },
        {
            department: "Utilities",
            phone: "(123) 456-7895",
            email: "utilities@municipal.gov",
            address: "202 Service Lane",
        },
    ];

    return (
        <main className="flex flex-col items-center min-h-screen w-full">
            {/* Header Section - Full width with distinct darker color */}
            <section className="w-full py-12 md:py-16 bg-acc-blue/20">
                <div className="container px-4 md:px-6 mx-auto max-w-6xl">
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl font-bold text-primary mb-4">Contact Directory</h1>
                        <div className="w-24 h-1 bg-acc-blue mx-auto mb-6 rounded-full"></div>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            Find contact information for all city departments and services. We're here to help you with any questions or concerns.
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section - Full width with distinct darker color */}
            <section className="w-full py-12 bg-acc-orange/20">
                <div className="container px-4 md:px-6 mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {contacts.map((contact, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-acc-blue bg-card">
                                <CardHeader>
                                    <CardTitle className="text-xl text-primary">{contact.department}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <Phone className="h-5 w-5 text-acc-blue mr-2" />
                                            <span>{contact.phone}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Mail className="h-5 w-5 text-acc-blue mr-2" />
                                            <span>{contact.email}</span>
                                        </div>
                                        <div className="flex items-start">
                                            <MapPin className="h-5 w-5 text-acc-blue mr-2 mt-0.5" />
                                            <span>{contact.address}</span>
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