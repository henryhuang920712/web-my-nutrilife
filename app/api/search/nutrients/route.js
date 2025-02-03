import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { foodId } = await req.json();
    const queryText = `
            SELECT N.N_name, FCN.N_amount_in_100g_F, N.N_unit
            FROM Food_Contain_Nutrient FCN
            JOIN Nutrient N ON FCN.N_id = N.N_id
            WHERE FCN.F_id = $1
        `;
    const result = await pool.query(queryText, [foodId]);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching nutrients data:", error);
    return NextResponse.json(
      { message: `Error: ${error.message}` },
      { status: 500 }
    );
  }
}
