import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Phone, Mail, MapPin, Clock, Heart, BookOpen, Droplets, Building, Car, TreePine, Shield, Plug } from "lucide-react";
import Link from "next/link";

export default function DeptPage({params}){
    const departmentName = params.dept;
    
    // Map department names to icons
    const departmentIcons = {
        health: <Heart className="h-12 w-12 text-acc-blue" />,
        education: <BookOpen className="h-12 w-12 text-acc-green" />,
        water: <Droplets className="h-12 w-12 text-acc-blue" />,
        municipal: <Building className="h-12 w-12 text-acc-orange" />,
        transportation: <Car className="h-12 w-12 text-acc-yellow" />,
        environment: <TreePine className="h-12 w-12 text-acc-green" />,
        safety: <Shield className="h-12 w-12 text-acc-orange" />,
        utilities: <Plug className="h-12 w-12 text-acc-blue" />
    };
    
    // In a real app, this data would come from a database or API
    const departmentData = {
        health: {
            title: "Health Department",
            description: "Protecting and promoting the health and well-being of all residents",
            icon: departmentIcons.health,
            services: [
                "Public Health Clinics",
                "Immunization Programs",
                "Disease Prevention",
                "Health Inspections",
                "Emergency Medical Services"
            ],
            contact: {
                phone: "(123) 456-7891",
                email: "health@smartcity.gov",
                address: "101 Wellness Boulevard"
            }
        },
        education: {
            title: "Education Department",
            description: "Supporting learning and educational opportunities for all ages",
            icon: departmentIcons.education,
            services: [
                "Public Schools",
                "Adult Education",
                "Library Services",
                "Youth Programs",
                "Educational Grants"
            ],
            contact: {
                phone: "(123) 456-7892",
                email: "education@smartcity.gov",
                address: "202 Learning Lane"
            }
        },
        water: {
            title: "Water Department",
            description: "Providing clean, safe water and managing water resources",
            icon: departmentIcons.water,
            services: [
                "Water Supply",
                "Water Quality Testing",
                "Sewer Services",
                "Water Conservation",
                "Infrastructure Maintenance"
            ],
            contact: {
                phone: "(123) 456-7893",
                email: "water@smartcity.gov",
                address: "303 Aquatic Avenue"
            }
        },
        municipal: {
            title: "Municipal Department",
            description: "Managing city operations and providing civic services",
            icon: departmentIcons.municipal,
            services: [
                "Building Permits",
                "City Planning",
                "Waste Management",
                "Street Maintenance",
                "Civic Engagement"
            ],
            contact: {
                phone: "(123) 456-7894",
                email: "municipal@smartcity.gov",
                address: "404 City Hall Plaza"
            }
        },
        transportation: {
            title: "Transportation Department",
            description: "Managing public transit and transportation infrastructure",
            icon: departmentIcons.transportation,
            services: [
                "Public Transit",
                "Road Maintenance",
                "Traffic Management",
                "Bike Lanes",
                "Parking Services"
            ],
            contact: {
                phone: "(123) 456-7895",
                email: "transportation@smartcity.gov",
                address: "505 Transit Terrace"
            }
        },
        environment: {
            title: "Environment Department",
            description: "Protecting our natural resources and promoting sustainability",
            icon: departmentIcons.environment,
            services: [
                "Parks & Recreation",
                "Waste Reduction",
                "Air Quality Monitoring",
                "Sustainability Programs",
                "Environmental Education"
            ],
            contact: {
                phone: "(123) 456-7896",
                email: "environment@smartcity.gov",
                address: "606 Greenway Gardens"
            }
        },
        safety: {
            title: "Public Safety Department",
            description: "Ensuring the safety and security of all residents",
            icon: departmentIcons.safety,
            services: [
                "Police Services",
                "Fire Department",
                "Emergency Management",
                "Disaster Preparedness",
                "Community Safety Programs"
            ],
            contact: {
                phone: "(123) 456-7897",
                email: "safety@smartcity.gov",
                address: "707 Security Street"
            }
        },
        utilities: {
            title: "Utilities Department",
            description: "Providing essential utility services to residents",
            icon: departmentIcons.utilities,
            services: [
                "Electricity",
                "Natural Gas",
                "Telecommunications",
                "Infrastructure",
                "Utility Billing"
            ],
            contact: {
                phone: "(123) 456-7898",
                email: "utilities@smartcity.gov",
                address: "808 Power Plaza"
            }
        }
    };

    const dept = departmentData[departmentName] || {
        title: `${departmentName.charAt(0).toUpperCase() + departmentName.slice(1)} Department`,
        description: `Information about the ${departmentName} department`,
        icon: <Building className="h-12 w-12 text-acc-blue" />,
        services: [
            "Service 1",
            "Service 2",
            "Service 3",
            "Service 4",
            "Service 5"
        ],
        contact: {
            phone: "(123) 456-7890",
            email: `${departmentName}@smartcity.gov`,
            address: "City Hall"
        }
    };

    return(
        <main className="flex flex-col items-center min-h-screen w-full">
            {/* Header Section - Full width with distinct darker color */}
            <section className="w-full py-12 md:py-16 bg-background">
                <div className="container px-4 md:px-6 mx-auto max-w-6xl">
                    <div className="mb-8 text-center">
                        <div className="flex justify-center mb-4">
                            {dept.icon}
                        </div>
                        <h1 className="text-4xl font-bold text-primary mb-4">{dept.title}</h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{dept.description}</p>
                    </div>
                </div>
            </section>

            {/* Content Section - Full width with distinct darker color */}
            <section className="w-full py-12 bg-muted-background">
                <div className="container px-4 md:px-6 mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Services */}
                        <div className="lg:col-span-2">
                            <Card className="mb-8 bg-card">
                                <CardHeader>
                                    <CardTitle className="text-2xl">Our Services</CardTitle>
                                    <CardDescription>Explore the services we provide to our community</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {dept.services.map((service, index) => (
                                            <div key={index} className="flex items-start p-4 rounded-lg border border-border hover:bg-accent transition-colors bg-background">
                                                <div className="bg-acc-blue/10 p-2 rounded-full mr-3">
                                                    <Check className="h-5 w-5 text-acc-blue" />
                                                </div>
                                                <span className="font-medium">{service}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-card">
                                <CardHeader>
                                    <CardTitle className="text-2xl">Department Information</CardTitle>
                                    <CardDescription>Learn more about our mission and leadership</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose max-w-none">
                                        <p>
                                            The {dept.title} is committed to serving the residents of our city with excellence. 
                                            Our department works tirelessly to improve the quality of life for all community members 
                                            through innovative programs and dedicated public service.
                                        </p>
                                        <p className="mt-4">
                                            Under the leadership of our department head, we strive to implement best practices 
                                            and leverage technology to deliver efficient and effective services to our residents.
                                        </p>
                                        <h3 className="text-lg font-semibold mt-6 mb-3">Our Mission</h3>
                                        <p>
                                            To enhance the well-being of our community by providing exceptional services, 
                                            fostering sustainable development, and ensuring the safety and prosperity of all residents.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Contact Sidebar */}
                        <div>
                            <Card className="sticky top-24 bg-card">
                                <CardHeader>
                                    <CardTitle className="text-2xl">Contact Us</CardTitle>
                                    <CardDescription>Get in touch with our department</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="font-semibold text-lg mb-3 flex items-center">
                                                <Clock className="h-5 w-5 mr-2 text-acc-blue" />
                                                Department Hours
                                            </h3>
                                            <ul className="space-y-2 text-muted-foreground">
                                                <li className="flex justify-between">
                                                    <span>Monday - Friday</span>
                                                    <span>8:00 AM - 5:00 PM</span>
                                                </li>
                                                <li className="flex justify-between">
                                                    <span>Saturday</span>
                                                    <span>9:00 AM - 1:00 PM</span>
                                                </li>
                                                <li className="flex justify-between">
                                                    <span>Sunday</span>
                                                    <span>Closed</span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-lg mb-3">Contact Information</h3>
                                            <div className="space-y-4">
                                                <div className="flex items-start">
                                                    <Phone className="h-5 w-5 text-acc-blue mr-3 mt-0.5" />
                                                    <div>
                                                        <div className="font-medium">Phone</div>
                                                        <div className="text-muted-foreground">{dept.contact.phone}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-start">
                                                    <Mail className="h-5 w-5 text-acc-blue mr-3 mt-0.5" />
                                                    <div>
                                                        <div className="font-medium">Email</div>
                                                        <div className="text-muted-foreground">{dept.contact.email}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-start">
                                                    <MapPin className="h-5 w-5 text-acc-blue mr-3 mt-0.5" />
                                                    <div>
                                                        <div className="font-medium">Address</div>
                                                        <div className="text-muted-foreground">{dept.contact.address}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4">
    <Link 
      href="/dashboard/requests" 
      className="flex justify-center w-full bg-acc-blue text-white py-3 rounded-lg font-medium hover:bg-acc-blue/90 transition-colors"
    >
        Request Service
    </Link>
</div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}