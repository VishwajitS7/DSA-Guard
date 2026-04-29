import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { leetcodeUrl, gfgUrl, codechefUrl } = await req.json();

    await connectDB();
    await User.findOneAndUpdate(
      { email: session.user?.email },
      { 
        leetcodeUrl, 
        gfgUrl, 
        codechefUrl 
      }
    );

    return NextResponse.json({ message: "Profiles updated" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
