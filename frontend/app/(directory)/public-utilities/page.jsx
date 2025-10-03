import Link from "next/link";

export default function Page(){
    return (
        <div>
            Public Buildings
            <Link href={`/public-utilities/banks`}>Banks</Link>
            <Link href={`/public-utilities/collages-universities`}>Collages & Universities</Link>
            <Link href={`/public-utilities/schools`}>Schools</Link>
            <Link href={`/public-utilities/hospitals`}>Hospitals</Link>
            <Link href={`/public-utilities/postal`}>Postal</Link>
        </div>
    );
}