import pool from "@/lib/db";
import { NextResponse } from 'next/server';
import { getToken } from "next-auth/jwt";

export async function POST(req) {
    try {
        const body = await req.json();
        // dates should be in 'YYYY-MM-DD' format
        const { startDate, endDate } = body;
        // Get session (token)
        const token = await getToken({ req });
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Get the user ID from the token
        const userId = token.u_id;
        const typeId = token.t_id;
        // Values to replace placeholders in the query
        const values = [userId, startDate, endDate, typeId];
        // Query to fetch meals for today
        const query = `
            SELECT 
                nutrient.n_id,
                nutrient.n_name,
                nutrient.n_unit,
                daily_n_consumed.n_consumed_amount,
                dri.sugg_n_amount
            FROM nutrient
            JOIN daily_n_consumed ON nutrient.n_id = daily_n_consumed.n_id
            JOIN dri ON nutrient.n_id = dri.n_id
            WHERE daily_n_consumed.u_id = $1 
            AND daily_n_consumed.date BETWEEN $2 AND $3
            AND dri.t_id = $4;
        `;

        // Fetch data from the database
        const result = await pool.query(query, values);

        // Return the results as JSON
        return NextResponse.json(result.rows);

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}
