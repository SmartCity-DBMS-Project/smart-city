import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";


export default function Page(){
    const utilities = [
        {name: "Banks", link: "banks"},
        {name: "Collages & Universities", link: "collages-universities"},
        {name: "Schools", link: "schools"},
        {name: "Hospitals", link: "hospitals"},
        {name: "Postal", link: "postal"}
    ]
    return (
        <main className="container mx-auto flex min-h-screen flex-col items-center justify-start px-4 py-16">
            <header className="mb-8 text-left w-10/12">
                <h1 className="text-4xl font-medium text-primary mb-2">Public Utilities</h1>
                <hr className="my-4 h-1 bg-primary"/>
                <p className="italic text-lg text-muted-foreground">
                  Welcome to the Public Utilities page of our smart city portal. <br />
                </p>
            </header>
            {/* Cards Row */}
            <div className="grid w-10/12 bg-card p-4 grid-cols-5 gap-6">
              {utilities.map((utils) => (
                <Link
                  key={utils.link}
                  href={`/public-utilities/${utils.link}`}
                  className="flex-1"
                >
                  <Card
                    className="bg-background text-acc-blue rounded-none aspect-square border-0 shadow-none flex items-center justify-center hover:bg-acc-blue hover:text-background transition-colors duration-200"
                  >
                    <CardHeader className="p-0 flex items-center justify-center">
                      <CardTitle className="text-center text-xl font-medium">
                        {utils.name}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
        </main>
    );
}