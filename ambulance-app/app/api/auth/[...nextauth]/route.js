import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/prisma/action";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      const email = user.email;
      const existingUser = await prisma.user.findUnique({ where: { email } });
      const existingHospital = await prisma.hospital.findUnique({ where: { email } });

      if (!existingUser && !existingHospital) {
        console.log("Access denied: email not registered");
        return false;
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        const email = user.email;
        const dbUser = await prisma.user.findUnique({ where: { email } });
        const dbHospital = await prisma.hospital.findUnique({ where: { email } });

        if (dbUser) token.role = "user";
        else if (dbHospital) token.role = "hospital";
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
  },
});

export { handler as GET, handler as POST };
