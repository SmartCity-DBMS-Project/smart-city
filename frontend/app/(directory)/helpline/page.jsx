import { Phone, PhoneCall, Shield, Heart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page(){
    const helplines = [
        {
            title: "Emergency Services",
            number: "911",
            description: "Police, Fire, and Medical Emergencies",
            icon: <PhoneCall className="h-6 w-6 text-red-500" />,
            color: "bg-red-50 border-red-200"
        },
        {
            title: "Non-Emergency Police",
            number: "(123) 456-7891",
            description: "For non-emergency police assistance",
            icon: <Shield className="h-6 w-6 text-blue-500" />,
            color: "bg-blue-50 border-blue-200"
        },
        {
            title: "Fire Department",
            number: "(123) 456-7892",
            description: "Fire emergencies and rescue services",
            icon: <Phone className="h-6 w-6 text-orange-500" />,
            color: "bg-orange-50 border-orange-200"
        },
        {
            title: "Medical Helpline",
            number: "(123) 456-7893",
            description: "Medical advice and health information",
            icon: <Heart className="h-6 w-6 text-green-500" />,
            color: "bg-green-50 border-green-200"
        }
    ];

    return (
        <main className="flex flex-col items-center min-h-screen w-full">
            {/* Header Section - Using homepage pattern with bg-background */}
            <section className="w-full py-12 md:py-16 bg-background">
                <div className="container px-4 md:px-6 mx-auto max-w-6xl">
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl font-bold text-primary mb-4">Helpline Services</h1>
                        <div className="w-24 h-1 bg-acc-blue mx-auto mb-6 rounded-full"></div>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            Quick access to emergency and non-emergency helpline numbers. 
                            Our helpline services are available 24/7 to assist you with any urgent needs.
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section - Using homepage pattern with bg-card */}
            <section className="w-full py-12 bg-card">
                <div className="container px-4 md:px-6 mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {helplines.map((helpline, index) => (
                            <Card key={index} className={`${helpline.color} hover:shadow-lg transition-all duration-300 border-t-4 border-t-acc-blue`}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-xl font-bold">{helpline.title}</CardTitle>
                                        {helpline.icon}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-primary mb-2">{helpline.number}</div>
                                    <CardDescription>{helpline.description}</CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}