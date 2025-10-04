export default function Page(){
    return (
        <main className="container mx-auto flex min-h-screen flex-col items-center justify-start px-4 py-16">
            <header className="mb-8 text-left w-10/12">
                <h1 className="text-4xl font-medium text-primary mb-2">Public Representatives</h1>
                <hr className="my-4 h-1 bg-primary"/>
                <p className="italic text-lg text-muted-foreground">
                  Welcome to the Public Representatives page of our smart city portal. <br />
                </p>
            </header>
        </main>
    );
}