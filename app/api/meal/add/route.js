import pool from "@/lib/db";
import { NextResponse } from 'next/server';
import { getToken } from "next-auth/jwt"
// select all food items since the database is small
export async function POST(req) {
    try {
        const body = await req.json();
        const { foodId, dateStr, timeStr, grams } = body;
        // get session
        const token = await getToken({ req })
        if (!token) res.status(401).json({ message: "Unauthorized" });
        // get user id
        const userId = token.u_id;
        
        // insert meal record
        const query = `
            INSERT INTO meal (u_id, f_id, date, time, eaten_grams)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (u_id, f_id, date, time) 
            DO UPDATE SET eaten_grams = EXCLUDED.eaten_grams
            RETURNING *, (xmax <> 0) AS updated;
        `;
        const values = [userId, foodId, dateStr, timeStr, grams];

        const result = await pool.query(query, values);

        if (result.rows.length > 0) {
            const meal = result.rows[0];
            if (meal.updated) {
                return NextResponse.json({ message: "Updated existing meal", meal });
            } else {
                return NextResponse.json({ message: "Inserted new meal", meal });
            }
        } else {
            return NextResponse.json({ message: "No changes made" }, { status: 400 });
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}
