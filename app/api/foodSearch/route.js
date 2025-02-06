import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { foodName } = await req.json();
    const queryText = `
            SELECT F_id, F_name
            FROM Food
            WHERE F_name ILIKE $1
        `;
    const result = await pool.query(queryText, [`%${foodName}%`]);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching food data:", error);
    return NextResponse.json(
      { message: `Error: ${error.message}` },
      { status: 500 }
    );
  }
}
