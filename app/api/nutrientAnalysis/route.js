import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function POST(req) {
  try {
    // 獲取 token
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = token.u_id;

    // 解析請求數據
    const { startDate, endDate, nutrientName } = await req.json();
    if (!startDate || !endDate || !nutrientName) {
      return NextResponse.json(
        { message: "Missing required parameters" },
        { status: 400 }
      );
    }

    // console.log("Received request with:", {
    //   userId,
    //   startDate,
    //   endDate,
    //   nutrientName,
    // });

    // 查詢 Nutrient 表中的 N_id
    const nutrientQuery = "SELECT N_id FROM Nutrient WHERE N_name = $1";
    const nutrientResult = await pool.query(nutrientQuery, [nutrientName]);

    if (nutrientResult.rowCount === 0) {
      return NextResponse.json(
        { message: "Nutrient not found" },
        { status: 404 }
      );
    }
    const nutrientId = nutrientResult.rows[0].n_id;

    // 查詢 Daily_N_Consumed 表
    const query = `
      SELECT *
      FROM Daily_N_Consumed 
      WHERE U_id = $1 AND N_id = $2 AND date BETWEEN $3 AND $4
      ORDER BY date;
    `;
    const values = [userId, nutrientId, startDate, endDate];
    const result = await pool.query(query, values);

    // if (result.rowCount === 0) {
    //   return NextResponse.json(
    //     { message: "No records found" },
    //     { status: 404 }
    //   );
    // }

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: `Error: ${error.message}` },
      { status: 500 }
    );
  }
}
