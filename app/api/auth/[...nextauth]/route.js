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

    if (dbUser) {
      token.role = "user";
      token.name = dbUser.fullName;
      token.id = dbUser.id;
      token.email = dbUser.email;
    } else if (dbHospital) {
      token.role = "hospital";
      token.name = dbHospital.name; 
      token.id = dbHospital.id;
      token.email = dbHospital.email;
    }
  }
  return token;
}
,

    async session({ session, token }) {
      // Attach everything from token → session (adds email, name, id)
      if (token && session.user) {
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
<<<<<<< HEAD:ambulance-app/app/api/auth/[...nextauth]/route.js
      
=======
>>>>>>> 76f95e8f5654f56376a6c3a2118e73786c169f2d:app/api/auth/[...nextauth]/route.js
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
  },
});

export { handler as GET, handler as POST };
