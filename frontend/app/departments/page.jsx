import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, GraduationCap, Droplets, Building2, Shield } from "lucide-react";

export default function DepartmentsPage() {
  const departments = [
    { name: "Health Department", slug: "health", icon: Heart},
    { name: "Education Department", slug: "education", icon: GraduationCap},
    { name: "Water Department", slug: "water", icon: Droplets},
    { name: "Municipal Department", slug: "municipal", icon: Building2},
    { name: "Police Department", slug: "police", icon: Shield},
  ];

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-start px-4 py-16">
      {/* Header */}
      <header className="mb-8 text-left w-10/12">
        <h1 className="text-4xl font-bold text-primary mb-4">City Service Departments</h1>
        <hr className="my-4 h-1 bg-primary"/>
        <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
          Discover our comprehensive range of municipal services designed to serve our community. 
          Our five specialized departments work collaboratively to deliver essential services, maintain public infrastructure, and ensure the well-being of all residents.
        </p>
        <p className="text-base text-muted-foreground italic">
          Each department is committed to excellence, innovation, and citizen satisfaction.
        </p>
      </header>

      {/* Cards Row */}
<div className="grid w-10/12 bg-card p-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
  {departments.map((dept) => {
    const IconComponent = dept.icon;
    return (
      <div key={dept.slug} className="aspect-square">
        <Link href={`/departments/${dept.slug}`} className="block w-full h-full">
          <Card
            className="w-full h-full bg-background text-acc-blue rounded-none border-0 shadow-none flex flex-col items-center justify-center hover:bg-acc-blue hover:text-background transition-colors duration-200 group"
          >
            <CardHeader className="p-0 flex flex-col items-center justify-center space-y-4">
              <IconComponent 
                size={48} 
                className="text-acc-blue group-hover:text-white transition-colors duration-200"
              />
              <CardTitle className="text-center text-xl font-medium">
                {dept.name}
              </CardTitle>
            </CardHeader>
          </Card>
        </Link>
      </div>
    );
  })}
      </div>
    </main>
  );
}
