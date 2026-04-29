import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" });

  await connectDB();
  const dbUser = await User.findOne({ email: session.user?.email }).lean();
  
  return NextResponse.json({
    email: dbUser?.email,
    leetcodeUrl: dbUser?.leetcodeUrl,
    gfgUrl: dbUser?.gfgUrl,
    codechefUrl: dbUser?.codechefUrl,
  });
}
