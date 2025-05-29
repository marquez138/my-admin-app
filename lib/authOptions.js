// /lib/authOptions.js
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "./dbConnect";
import User from "../models/User"; // Admin User model for this app
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        // Use 'email' for login to align with the User model, or 'username'
        email: { label: "Email", type: "email", placeholder: "admin@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Please enter an email and password.");
        }
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found with this email.");
        }

        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordMatch) {
          throw new Error("Incorrect password.");
        }

        if (!user.isAdmin) { // Ensure the user is an admin
            throw new Error("Access denied. Not an administrator.");
        }

        // Return user object without the password
        return { id: user._id.toString(), email: user.email, name: user.username, isAdmin: user.isAdmin };
      },
    }),
  ],
  session: {
    strategy: "jwt", // Using JWT for session strategy
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add isAdmin to the JWT token
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      // Add isAdmin to the session object
      if (session.user) {
        session.user.id = token.id;
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login", // Custom login page
    // error: '/auth/error', // (optional) custom error page
  },
  secret: process.env.NEXTAUTH_SECRET,
};