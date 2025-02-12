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
                n.n_id,
                n.n_name,
                n.n_unit,
                ROUND(COALESCE(SUM(dnc.n_consumed_amount), 0), 2) AS n_consumed_amount,
                COALESCE(SUM(d.sugg_n_amount), 0) AS n_sugg_amount
            FROM nutrient n
            LEFT JOIN daily_n_consumed dnc 
                ON n.n_id = dnc.n_id 
                AND dnc.u_id = $1
                AND dnc.date BETWEEN $2 AND $3
            LEFT JOIN dri d 
                ON n.n_id = d.n_id 
                AND d.t_id = $4
            GROUP BY n.n_id, n.n_name, n.n_unit
            ORDER BY n.n_id;
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
