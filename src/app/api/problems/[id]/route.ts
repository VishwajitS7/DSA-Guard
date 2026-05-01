import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Problem from "@/lib/models/Problem";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    await connectDB();

    // Find the problem and ensure it belongs to the user
    const existingProblem = await Problem.findOne({
      _id: id,
      user: (session.user as any).id,
    });

    if (!existingProblem) {
      return NextResponse.json({ error: "Problem not found or unauthorized" }, { status: 404 });
    }

    // Update the problem
    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      { ...data },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedProblem);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update problem" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const existingProblem = await Problem.findOneAndDelete({
      _id: id,
      user: (session.user as any).id,
    });

    if (!existingProblem) {
      return NextResponse.json({ error: "Problem not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete problem" },
      { status: 500 }
    );
  }
}
