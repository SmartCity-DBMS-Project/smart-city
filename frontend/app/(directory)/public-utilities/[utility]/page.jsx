'use client';
import { useParams } from "next/navigation";
import { useEffect,useState } from "react";


export default function utilityPage({params}){
    const [buildings, setBuildings] = useState([]);
    const {utility} = useParams();
    
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`http://localhost:8000/api/buildings/types/${utility}`);
                if(response.ok){
                    const data = await response.json();
                    console.log(buildings);
                    setBuildings(data);
                } else {
                    console.error('Error fetching data: Response not OK');
                }
                
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        if(utility){
            fetchData();
        }
    }, [utility]);


    // This is sample data structure - in reality this would be fetched from backend
    // Each building object contains building name and address
    

    return (
        <main className="flex flex-col items-center min-h-screen w-full">
            {/* Header Section - Using homepage pattern with bg-background */}
            <section className="w-full py-12 md:py-16 bg-background">
                <div className="container px-4 md:px-6 mx-auto max-w-6xl">
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl font-bold text-primary mb-4">
                            {utility ? utility.charAt(0).toUpperCase() + utility.slice(1) : 'Utility'}
                        </h1>
                        <div className="w-24 h-1 bg-acc-blue mx-auto mb-6 rounded-full"></div>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            Detailed information about {utility} services in our city.
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section - Using homepage pattern with bg-card */}
            <section className="w-full py-12 bg-card">
                <div className="container px-4 md:px-6 mx-auto max-w-6xl">
                    <div className="bg-card rounded-2xl p-8 w-full max-w-6xl border border-input shadow-sm mx-auto mb-8">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-primary mb-4">Service Information</h2>
                            <p className="text-muted-foreground mb-6">
                                This page contains detailed information about {utility} services. 
                                Please check back later for more specific details about this service.
                            </p>
                            <a 
                                href="#" 
                                className="inline-flex items-center px-6 py-3 bg-acc-blue text-white rounded-lg hover:bg-acc-blue/90 transition-colors"
                            >
                                Contact Service Department
                            </a>
                        </div>
                    </div>

                    {/* Buildings Card Structure */}
                    <div className="mt-12">
                        <h3 className="text-2xl font-bold text-primary mb-6 text-center">Associated Buildings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {buildings.map((building) => (
                                <div key={building.building_id} className="bg-card rounded-xl border border-input shadow-sm p-6 hover:shadow-md transition-shadow">
                                    <div className="flex flex-col h-full">
                                        <h4 className="text-xl font-bold text-primary mb-2">{building.building_name || 'Unnamed Building'}</h4>
                                        {building && building.length > 0 && (
                                            <p className="text-muted-foreground flex-grow">
                                                {building.street}, {building.zone}
                                                {building.pincode && ` - ${building.pincode}`}
                                            </p>
                                        )}
                                        <div className="mt-4">
                                            <button className="text-acc-blue hover:underline text-sm font-medium">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}