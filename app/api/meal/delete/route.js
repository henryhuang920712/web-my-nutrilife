import pool from "@/lib/db";
import { NextResponse } from 'next/server';
import { getToken } from "next-auth/jwt";

export async function DELETE(req) {
    try {
        const body = await req.json();
        const { foodId, dateStr, timeStr } = body;
        // get session
        const token = await getToken({ req });
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        // get user id
        const userId = token.u_id;

        // delete meal record
        const query = `
            DELETE FROM meal
            WHERE u_id = $1 AND f_id = $2 AND date = $3 AND time = $4
            RETURNING *
        `;
        const values = [userId, foodId, dateStr, timeStr];
        
        console.log("values", values);
        
        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return NextResponse.json({ message: "No record found to delete" }, { status: 404 });
        }

        return NextResponse.json({ message: "Record deleted successfully", deletedData: result.rows[0] });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}
