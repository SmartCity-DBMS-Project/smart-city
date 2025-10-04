import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function DepartmentsPage() {
  const departments = [
    { name: "Health", slug: "health"},
    { name: "Education", slug: "education"},
    { name: "Water", slug: "water"},
    { name: "Municipal", slug: "municipal"},
  ];

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-start px-4 py-16">
      {/* Header */}
      <header className="mb-8 text-left w-10/12">
        <h1 className="text-4xl font-medium text-primary mb-2">Departments</h1>
        <hr className="my-4 h-1 bg-primary"/>
        <p className="italic text-lg text-muted-foreground">
          Welcome to the Departments page of our smart city portal. <br />

Here you can access information and services provided by the four key departments that work together to enhance the quality of life, sustainability, and efficiency of our city. Click on the links below to explore each department's responsibilities, initiatives, and resources.
        </p>
      </header>

      {/* Cards Row */}
      <div className="grid w-10/12 bg-card p-4 grid-cols-4 gap-6">
        {departments.map((dept) => (
          <Link
            key={dept.slug}
            href={`/departments/${dept.slug}`}
            className="flex-1"
          >
            <Card
              className="bg-background text-acc-blue rounded-none aspect-square border-0 shadow-none flex items-center justify-center hover:bg-acc-blue hover:text-background transition-colors duration-200"
            >
              <CardHeader className="p-0 flex items-center justify-center">
                <CardTitle className="text-center text-xl font-medium">
                  {dept.name}
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
