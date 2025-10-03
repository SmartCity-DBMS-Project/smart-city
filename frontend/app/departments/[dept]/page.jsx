export default function deptPage({params}){
    const departmentName = params.dept;

    return(
        <div>
            This is {departmentName} department page
        </div>
    );
}