export default function utilityPage({params}){
    const utility = params.utility;

    return (
        <div>
            This page contains information of all {utility}
        </div>
    );
}