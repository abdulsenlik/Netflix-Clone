import NextAuth, { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { compare } from "bcrypt";

import prismadb from "@/lib/prismadb";

console.log("Loaded [...nextauth] route");
console.log("Env:", {
  GITHUB_ID: process.env.GITHUB_ID,
  DATABASE_URL: process.env.DATABASE_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
});


export const authOptions: AuthOptions = {

  
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password required");
          }
      
          const user = await prismadb.user.findUnique({
            where: { email: credentials.email },
          });
      
          if (!user || !user.hashedPassword) {
            throw new Error("Email does not exist");
          }
      
          const isCorrectPassword = await compare(credentials.password, user.hashedPassword);
      
          if (!isCorrectPassword) {
            throw new Error("Incorrect password");
          }
      
          return user;
        } catch (error) {
          console.error("Authorize error:", error);
          throw new Error("Login failed");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth",
  },
  debug: process.env.NODE_ENV === "development",
  adapter: PrismaAdapter(prismadb),
  session: { strategy: "jwt" },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);