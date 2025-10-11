import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Lightbulb, Phone, Users, MapPin, Landmark } from "lucide-react";

export default function Home() {
  const features = [
    {
      title: "Directory Services",
      description: "Access comprehensive contact information for city services and officials",
      href: "/contact-directory",
      icon: <Landmark className="h-8 w-8 text-acc-blue" />,
    },
    {
      title: "Public Utilities",
      description: "Find information about utilities and services available in your area",
      href: "/public-utilities",
      icon: <Lightbulb className="h-8 w-8 text-acc-blue" />,
    },
    {
      title: "Departments",
      description: "Explore various city departments and their functions",
      href: "/departments",
      icon: <Building className="h-8 w-8 text-acc-blue" />,
    },
    {
      title: "Helpline",
      description: "Quick access to emergency and non-emergency helpline numbers",
      href: "/helpline",
      icon: <Phone className="h-8 w-8 text-acc-blue" />,
    },
    {
      title: "Public Representatives",
      description: "Connect with your local representatives and officials",
      href: "/public-representatives",
      icon: <Users className="h-8 w-8 text-acc-blue" />,
    },
    {
      title: "STD & PIN Codes",
      description: "Search for area codes and postal codes across the city",
      href: "/std-pin-codes",
      icon: <MapPin className="h-8 w-8 text-acc-blue" />,
    },
  ];

  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      {/* Hero Section - Full width with distinct darker color */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-acc-blue/20">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
                Smart City Portal
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Your one-stop digital platform for all city services, information, and citizen engagement.
              </p>
            </div>
            <div className="space-x-4">
              <Link 
                href="/dashboard" 
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Get Started
              </Link>
              <Link 
                href="#services" 
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Full width with distinct darker color */}
      <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-acc-orange/20">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
                Our Services
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Explore the wide range of services available through our digital platform.
              </p>
            </div>
          </div>
          <div className="mx-auto grid gap-6 py-12 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
            {features.map((feature, index) => (
              <Card key={index} className="flex flex-col items-center text-center p-6 transition-all hover:shadow-lg hover:border-acc-blue/50 w-full max-w-xs bg-card">
                <div className="mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <CardHeader className="p-0 mb-2 flex justify-center">
                  <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex flex-col items-center">
                  <CardDescription className="mb-4 text-center">{feature.description}</CardDescription>
                  <Link 
                    href={feature.href}
                    className="inline-flex items-center text-acc-blue hover:underline justify-center"
                  >
                    Explore
                    <svg
                      className="ml-1 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Full width with distinct darker color */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-acc-green/20">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-3 text-center">
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-acc-green">50+</h3>
              <p className="text-muted-foreground">City Services</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-acc-green">24/7</h3>
              <p className="text-muted-foreground">Access to Information</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-acc-green">100k+</h3>
              <p className="text-muted-foreground">Citizens Served</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}