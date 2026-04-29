import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import Problem from "@/lib/models/Problem";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const totalUsers = await User.countDocuments();
    const totalProblems = await Problem.countDocuments();
    
    const users = await User.find({}).select("name email role externalStats lastSyncedAt").lean();

    // Get problem counts for each user
    const usersWithCounts = await Promise.all(users.map(async (u: any) => {
      // Using toString() to ensure ID match regardless of type
      const problemCount = await Problem.countDocuments({ user: u._id.toString() });
      return {
        ...u,
        problemCount: problemCount || 0
      };
    }));

    return NextResponse.json({
      totalUsers,
      totalProblems,
      users: usersWithCounts
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const users = await User.find({}).select("email");

    // This would ideally be a background queue, but for now we'll trigger them
    // We'll just clear their lastSyncedAt to force a refresh on their next dashboard visit
    // Or we could call the sync logic here. Let's just clear the cache for everyone.
    await User.updateMany({}, { $set: { lastSyncedAt: new Date(0) } });

    return NextResponse.json({ message: "Global cache cleared. All users will re-sync on next load." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    if (userId === (session.user as any).id) {
      return NextResponse.json({ error: "Self-preservation active: You cannot delete your own account." }, { status: 400 });
    }

    await connectDB();

    // Cascading Delete: Remove all problems first
    await Problem.deleteMany({ user: userId });
    
    // Delete the user
    await User.findByIdAndDelete(userId);

    return NextResponse.json({ message: "User and all associated data purged successfully." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
