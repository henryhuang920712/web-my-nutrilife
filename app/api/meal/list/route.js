import pool from "@/lib/db";
import { NextResponse } from 'next/server';
import { getToken } from "next-auth/jwt";

export async function POST(req) {
    try {

        const body = await req.json();
        const {dateStr} = body;
        // Get session (token)
        const token = await getToken({ req });
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        
        // Get the user ID from the token
        const userId = token.u_id;

        // Query to fetch meals for today
        const query = `
            SELECT 
                food.f_id, 
                food.f_name, 
                food.f_category, 
                meal.time, 
                meal.eaten_grams 
            FROM meal 
            JOIN food ON food.f_id = meal.f_id 
            WHERE meal.u_id = $1 AND meal.date = $2;
        `;
        
        // Values to replace placeholders in the query
        const values = [userId, dateStr];
        
        // Fetch data from the database
        const result = await pool.query(query, values);

        // Return the results as JSON
        return NextResponse.json(result.rows);

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}
