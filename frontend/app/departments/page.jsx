import Link from "next/link";
import * as Card from "@/components/ui/card";
import { Heart, BookOpen, Droplets, Building, Car, TreePine, Shield, Plug } from "lucide-react";

export default function DepartmentsPage() {
  const departments = [
    { 
      name: "Health", 
      slug: "health",
      description: "Public health services, hospitals, and wellness programs",
      icon: <Heart className="h-8 w-8 text-acc-blue" />,
      color: "bg-acc-blue"
    },
    { 
      name: "Education", 
      slug: "education",
      description: "Schools, libraries, and educational initiatives",
      icon: <BookOpen className="h-8 w-8 text-acc-green" />,
      color: "bg-acc-green"
    },
    { 
      name: "Water", 
      slug: "water",
      description: "Water supply, treatment, and conservation services",
      icon: <Droplets className="h-8 w-8 text-acc-blue" />,
      color: "bg-acc-blue"
    },
    { 
      name: "Municipal", 
      slug: "municipal",
      description: "City governance, permits, and civic services",
      icon: <Building className="h-8 w-8 text-acc-orange" />,
      color: "bg-acc-orange"
    },
    { 
      name: "Transportation", 
      slug: "transportation",
      description: "Public transit, roads, and traffic management",
      icon: <Car className="h-8 w-8 text-acc-yellow" />,
      color: "bg-acc-yellow"
    },
    { 
      name: "Environment", 
      slug: "environment",
      description: "Parks, waste management, and sustainability",
      icon: <TreePine className="h-8 w-8 text-acc-green" />,
      color: "bg-acc-green"
    },
    { 
      name: "Public Safety", 
      slug: "safety",
      description: "Police, fire, and emergency services",
      icon: <Shield className="h-8 w-8 text-acc-orange" />,
      color: "bg-acc-orange"
    },
    { 
      name: "Utilities", 
      slug: "utilities",
      description: "Electricity, gas, and telecommunications",
      icon: <Plug className="h-8 w-8 text-acc-blue" />,
      color: "bg-acc-blue"
    },
  ];

  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      {/* Header Section - Using homepage pattern with bg-background */}
      <section className="w-full py-12 md:py-16 bg-background">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">City Departments</h1>
            <div className="w-24 h-1 bg-acc-blue mx-auto mb-6 rounded-full"></div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Explore the various departments that work together to enhance the quality of life, sustainability, and efficiency of our city. Each department offers specialized services and resources to meet the needs of our community.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section - Using homepage pattern with bg-card */}
      <section className="w-full py-12 bg-card">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept) => (
              <Link
                key={dept.slug}
                href={`/departments/${dept.slug}`}
                className="block"
              >
                <Card.Card className="h-full hover:shadow-lg transition-all duration-300 border-t-4 border-t-acc-blue bg-card">
                  <Card.CardHeader className="p-6">
                    <div className="mb-4 flex justify-center">
                      {dept.icon}
                    </div>
                    <Card.CardTitle className="text-xl font-bold mb-2">{dept.name}</Card.CardTitle>
                    <p className="text-muted-foreground text-sm">{dept.description}</p>
                  </Card.CardHeader>
                  <Card.CardContent className="px-6 pb-6">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${dept.color} text-white`}>
                      Explore
                      <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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