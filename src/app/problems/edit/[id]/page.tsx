import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Problem from "@/lib/models/Problem";
import ProblemForm from "@/components/problems/ProblemForm";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditProblemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  await connectDB();
  
  const problem = await Problem.findOne({
    _id: id,
    user: (session.user as any).id,
  }).lean();

  if (!problem) {
    return notFound();
  }

  // Convert MongoDB ObjectId to string for client component
  const problemData = {
    ...problem,
    _id: problem._id.toString(),
    user: problem.user.toString(),
    createdAt: problem.createdAt?.toISOString(),
    updatedAt: problem.updatedAt?.toISOString(),
    nextRevision: problem.nextRevision?.toISOString(),
    lastRevised: problem.lastRevised?.toISOString(),
  };

  return <ProblemForm initialData={problemData} problemId={id} />;
}
