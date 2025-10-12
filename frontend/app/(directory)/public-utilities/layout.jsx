export default function layout({children}){
    return (
        <div className="bg-background min-h-screen">
            {/* Create a table which displays locations */}
            {children}
        </div>
    );
}