import pool from "@/lib/db";
import { NextResponse } from 'next/server';

// select all food items since the database is small
export async function POST(req) {
    try {
        // const body = await req.json();
        // const { foodName } = body;
        const queryText = "SELECT * FROM Food";
        // const values = [`${foodName}%`];
        const result = await pool.query(queryText);

        // if (result.rows.length === 0) {
        //     return NextResponse.json({ message: "No results found" }, { status: 404 });
        // }
        // no need to handle this case since the frontend will display "No results found" if the array is empty
        return NextResponse.json(result.rows);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}
