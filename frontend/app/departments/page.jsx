import Link from "next/link";

export default function DepartmentsPage() {
  return (
    <div>
      <h1>Departments Page</h1>
      <p>Welcome to the Departments page!</p>
      <div className="flex flex-col justify-centre">
        <Link href={`departments/health`}>health</Link>
        <Link href={`departments/education`}>education</Link>
        <Link href={`departments/water`}>water</Link>
        <Link href={`departments/municipal`}>municipal</Link>
      </div>
    </div>
  );
}