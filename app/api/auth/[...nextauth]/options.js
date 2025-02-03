import GoogleProvider from "next-auth/providers/google";
// import FacebookProvider from "next-auth/providers/facebook";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import pool from "@/lib/db";

export const options = {
  providers: [
    // GoogleProvider({
    //     profile(profile) {
    //         let userRole = "google_user";
    //         return {
    //             ...profile,
    //             id: profile.sub,
    //             role: userRole
    //         }
    //     },
    //     clientId: process.env.GOOGLE_CLIENT_ID,
    //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),
    // GithubProvider({
    //     profile(profile) {
    //         let userRole = "github_user";
    //         return {
    //             ...profile,
    //             role: userRole
    //         }
    //     },
    //     clientId: process.env.GITHUB_CLIENT_ID,
    //     clientSecret: process.env.GITHUB_CLIENT_SECRET,
    // }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "your-username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "your-password",
        },
      },
      async authorize(credentials) {
        try {
          // Query the database to find the user by username or email
          const query = `
                    SELECT * FROM users 
                    WHERE u_name = $1 OR email = $2
                    `;
          const values = [credentials.username, credentials.email];
          const result = await pool.query(query, values);

          const foundUser = result.rows[0];

          console.log(result.rows[0]);

          if (!foundUser) {
            throw new Error("User not found");
          }

          // Compare hashed password
          const match = await bcrypt.compare(
            credentials.password,
            foundUser.password
          );

          if (!match) {
            throw new Error("Wrong password");
          }

          // Remove password before returning user data
          delete foundUser.password;
          return foundUser;
        } catch (error) {
          console.error(error);
          throw new Error("Error: " + error.message);
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (user?.error) {
        throw new Error(user.error);
      }
      if (account.provider === "credentials") {
        return true;
      }
      // if (account.provider === "github") {
      //     return true;
      // }
      // if (account.provider === "google") {
      //     return true;
      // }
      return false;
    },
    async redirect({ url, baseUrl }) {
      return url;
    },
    async jwt({ token, user }) {
      if (user) {
        token.u_id = user.u_id;
        token.u_name = user.u_name;
        token.email = user.email;
        token.birth_date = user.birth_date;
        token.created_date = user.created_date;
        token.t_id = user.t_id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.u_id = token.u_id;
        session.user.u_name = token.u_name;
        session.user.birth_date = token.birth_date;
        session.user.created_date = token.created_date;
        session.user.t_id = token.t_id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
};
