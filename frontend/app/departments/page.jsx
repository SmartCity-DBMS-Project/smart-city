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
      <section className="w-full py-12 md:py-16 bg-background border-b border-border">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-primary mb-3">City Departments</h1>
            <div className="w-12 h-0.5 bg-acc-blue mx-auto mb-4 rounded-full" />
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explore the departments that work together to enhance the quality of life, sustainability, and efficiency of our city.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full py-12 bg-muted-background">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {departments.map((dept) => (
              <Link key={dept.slug} href={`/departments/${dept.slug}`} className="group block">
                <div className="h-full bg-white border border-border rounded-xl p-5 hover:border-acc-blue/40 hover:bg-acc-blue/5 transition-colors">
                  <div className="mb-3 flex justify-center">{dept.icon}</div>
                  <h3 className="text-sm font-bold text-primary text-center mb-1">{dept.name}</h3>
                  <p className="text-xs text-muted-foreground text-center leading-relaxed mb-4">{dept.description}</p>
                  <div className="flex justify-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-acc-blue/10 text-acc-blue border border-acc-blue/20">
                      Explore
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}