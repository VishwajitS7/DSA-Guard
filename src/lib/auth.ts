import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      await connectDB();
      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        await User.create({
          name: user.name,
          email: user.email,
          image: user.image,
        });
      }

      return true;
    },
    async session({ session, token }) {
      await connectDB();
      const dbUser = await User.findOne({ email: session.user?.email });
      if (dbUser) {
        (session.user as any).id = dbUser._id.toString();
        (session.user as any).role = dbUser.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
