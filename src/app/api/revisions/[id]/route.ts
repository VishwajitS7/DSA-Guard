import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Problem from "@/lib/models/Problem";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const problem = await Problem.findOne({ 
      _id: id, 
      user: (session.user as any).id 
    });

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    // Spaced repetition schedule (days)
    const schedule = [1, 3, 7, 30, 90];
    const currentCount = problem.revisionCount || 0;
    const nextDays = schedule[Math.min(currentCount, schedule.length - 1)];
    
    problem.revisionCount = currentCount + 1;
    problem.lastRevised = new Date();
    problem.nextRevision = new Date(Date.now() + nextDays * 24 * 60 * 60 * 1000);

    await problem.save();

    return NextResponse.json(problem);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to update revision" }, { status: 500 });
  }
}
