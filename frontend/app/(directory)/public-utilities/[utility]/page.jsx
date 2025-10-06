import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function BuildingsByTypePage({ params }) {
  const typeName = decodeURIComponent(params.utility);
  const buildings = await prisma.building.findMany({
  where: {
    building_type: {
      type_name: typeName,
    },
  },
select: {
  b_name: true,
  address: {
    select: {
      street: true,
      city: true,
      pincode: true,
      zone: true,
    }
  }
}
});

  return (
      <div>
    <h1>Buildings of type: {typeName}</h1>
    {buildings.length === 0 ? (
      <p>No buildings found.</p>
    ) : (
      <ul>
        {buildings.map((bld, i) => (
          <li key={i}>
            <strong>{bld.b_name}</strong>
            <div>
              {bld.address?.street}, {bld.address?.zone}, {bld.address?.city}, {bld.address?.pincode}
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
);
}