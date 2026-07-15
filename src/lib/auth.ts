import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // This function decides whether the submitted credentials are valid.
      // For this assessment: dummy check against a hardcoded user.
      authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        const isValid =
          email === "demo@tentwenty.com" && password === "demo1234";

        if (!isValid) {
          return null; // returning null tells next-auth: reject this login
        }

        // Returning an object here becomes the "user" object next-auth uses
        return {
          id: "1",
          email,
          name: "Demo User",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt", // token stored in an httpOnly cookie, not localStorage
  },
  pages: {
    signIn: "/login", // use our custom login page instead of the default one
  },
  callbacks: {
    // Runs whenever a session is checked (e.g. on page load).
    // We copy the user id from the token into the session object
    // so components can read `session.user.id`.
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
});