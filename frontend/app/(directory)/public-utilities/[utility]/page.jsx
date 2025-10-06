'use client';

import { useEffect, use } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function UtilityPage({ params }) {
  const unwrappedParams = use(params);   // unwrap the promise
  const utility = unwrappedParams.utility;

  useEffect(() => {
    async function getData() {
      try {
        const res = await fetch('/api/posts');
        const data = await res.json();
        console.log("Fetched data:", data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    getData();
  }, []); //Runs once on mount

  const fakedata = [
    {
    id: 1,
    type_name: 'Hospital',
    street: 'Ring Road',
    zone: 'East Zone',
    flat_no: 'IDA Scheme No. 94',
    city: 'Indore',
    pincode: '452010'
  },
  {
    id: 2,
    type_name: 'Hospital',
    street: 'Race Course Road',
    zone: 'Central-West Zone',
    flat_no: 'Plot No. 8, PU-04',
    city: 'Indore',
    pincode: '452001'
  },
  {
    id: 3,
    type_name: 'Hospital',
    street: 'Manik Bagh Road',
    zone: 'South Zone',
    flat_no: '14, Near Choithram Mandi',
    city: 'Indore',
    pincode: '452014'
  }
  ];

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-start px-4 py-16">
      {/* Header */}
      <header className="mb-8 text-left w-10/12">
        <h1 className="text-4xl font-medium text-primary mb-2 capitalize">
          {utility}
        </h1>
        <hr className="my-4 h-1 bg-primary" />
        <p className="italic text-lg text-muted-foreground">
          Welcome to the {utility} page of our smart city portal. <br />
        </p>
      </header>

      {/* Cards */}
      <div className="grid w-10/12 mx-auto bg-card p-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {fakedata.map((utils) => (
          <div key={utils.id} className="group">
            <Card className="bg-background text-foreground rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col justify-between">
              <CardHeader className="p-4">
                <CardTitle className="text-2xl font-semibold text-acc-blue group-hover:text-blue-600 transition-colors">
                  {utils.type_name}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-1 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium text-foreground">Street: </span>
                  {utils.street}
                </div>
                <div>
                  <span className="font-medium text-foreground">City: </span>
                  {utils.city}
                </div>
                <div>
                  <span className="font-medium text-foreground">Zone: </span>
                  {utils.zone}
                </div>
                <div>
                  <span className="font-medium text-foreground">Flat No: </span>
                  {utils.flat_no}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </main>
  );
}
