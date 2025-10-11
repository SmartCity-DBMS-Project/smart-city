export default function utilityPage({params}){
    const utility = params.utility;

    return (
        <main className="flex flex-col items-center min-h-screen w-full">
            {/* Header Section - Full width with distinct darker color */}
            <section className="w-full py-12 md:py-16 bg-acc-blue/20">
                <div className="container px-4 md:px-6 mx-auto max-w-6xl">
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl font-bold text-primary mb-4">
                            {utility.charAt(0).toUpperCase() + utility.slice(1)}
                        </h1>
                        <div className="w-24 h-1 bg-acc-blue mx-auto mb-6 rounded-full"></div>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            Detailed information about {utility} services in our city.
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section - Full width with distinct darker color */}
            <section className="w-full py-12 bg-acc-orange/20">
                <div className="container px-4 md:px-6 mx-auto max-w-6xl">
                    <div className="bg-card rounded-2xl p-8 w-full max-w-6xl border border-input shadow-sm mx-auto">
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
                </div>
            </section>
        </main>
    );
}