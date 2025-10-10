import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, GraduationCap, School, Hospital, Mail, Shield } from "lucide-react";


export default function Page(){
    const utilities = [
        {name: "Banks", link: "banks", icon: Building2},
        {name: "Collages & Universities", link: "collages-universities", icon: GraduationCap},
        {name: "Schools", link: "schools", icon: School},
        {name: "Hospitals", link: "hospitals", icon: Hospital},
        {name: "Postal Offices", link: "postal", icon: Mail},
        {name: "Police Stations", link: "police-stations", icon: Shield},
    ]
    return (
        <main className="container mx-auto flex min-h-screen flex-col items-center justify-start px-4 py-16">
            <header className="mb-12 text-left w-10/12">
                <h1 className="text-4xl font-bold text-primary mb-4">Public Buildings Directory</h1>
                <hr className="my-4 h-1 bg-primary"/>
                <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                  Discover our comprehensive directory of essential public buildings and facilities throughout the city. 
                  From educational institutions to healthcare centers, financial services to emergency services - 
                  find everything you need to access vital public services in one convenient location.
                </p>
                <p className="text-base text-muted-foreground italic">
                  Our public buildings serve as the backbone of our community, providing essential services 
                  and resources that enhance the quality of life for all residents.
                </p>
            </header>
            {/* Cards Row */}
            <div className="grid w-10/12 bg-card p-4 grid-cols-3 gap-6">
              {utilities.map((utils) => {
                const IconComponent = utils.icon;
                return (
                  <Link
                    key={utils.link}
                    href={`/public-buildings/${utils.link}`}
                    className="flex-1"
                  >
                    <Card
                      className="bg-background text-acc-blue rounded-none aspect-video border-0 shadow-none flex flex-col items-center justify-center hover:bg-acc-blue hover:text-background transition-colors duration-200 group"
                    >
                      <CardHeader className="p-0 flex flex-col items-center justify-center space-y-4">
                        <IconComponent 
                          size={48} 
                          className="text-acc-blue group-hover:text-white transition-colors duration-200"
                        />
                        <CardTitle className="text-center text-xl font-medium">
                          {utils.name}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  </Link>
                );
              })}
            </div>
        </main>
    );
}