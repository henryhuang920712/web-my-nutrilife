import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import pool from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, username, password, birthday, gender } = body;

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const queryText = `CALL register_user($1, $2, $3, $4, $5)`;
    const values = [username, hashPassword, email, birthday, gender];

    const result = await pool.query(queryText, values);

    // Check if the procedure was called successfully
    const message =
      result.command === "CALL"
        ? "User registered successfully"
        : "No message returned";

    // Return the user response
    return NextResponse.json(
      { message },
      { status: message.startsWith("Error") ? 400 : 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: `Error: ${error.message}` },
      { status: 500 }
    );
  }
}
