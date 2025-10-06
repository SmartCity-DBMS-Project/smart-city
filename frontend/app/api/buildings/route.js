import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await createConnection();
    const [rows] = await db.query("SELECT * FROM buildings"); // adjust table name
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching buildings:", error);
    return NextResponse.json(
      { error: "Failed to fetch buildings", details: error.message },
      { status: 500 }
    );
  }
}
