
import {NextResponse} from 'next/server';
import bcrypt from 'bcrypt';
import pool from "@/lib/db";



export async function POST(req) {
  try {
    const body = await req.json();
    const { email, username, password, birthday, gender } = body;

    // Check if the user already exists
    // const duplicate = await Pool().then(async pool => {
    //   const result = await pool.request()
    //     .query(`SELECT * FROM users WHERE email = '${email}' OR username = '${username}'`);
    //   return result.recordset.length > 0;
    // });

    // if (duplicate) {
    //   return NextResponse.json({ message: "User already exists" }, { status: 400 });
    // }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const queryText = `SELECT register_user($1, $2, $3, $4, $5) AS message`;
    const values = [username, hashPassword, email, birthday, gender];
    

    const result = await pool.query(queryText, values);
    
    // Extract the message from the function result
    const message = result.rows[0]?.message || 'No message returned';

    // Return the user response
    return NextResponse.json({ message }, { status: message.startsWith('Error') ? 400 : 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({message: `Error: ${error.message}`}, { status: 500 });
  }
}