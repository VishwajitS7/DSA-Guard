import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import LandingPage from "@/components/landing/LandingPage";
import DashboardContent from "@/components/dashboard/DashboardContent";
import connectDB from "@/lib/db";
import Problem from "@/lib/models/Problem";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <LandingPage />;
  }

  await connectDB();
  const userId = (session.user as any).id;

  // Fetch real data
  const totalSolved = await Problem.countDocuments({ user: userId });
  const recentProblems = await Problem.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(5);

  const today = new Date();
  const revisionDue = await Problem.countDocuments({
    user: userId,
    nextRevision: { $lte: today }
  });

  const patterns = await Problem.distinct("patterns", { user: userId });
  const patternsMastered = patterns.length;

  // Calculate success rate (dummy logic for now: based on problems with no mistakes logged)
  const perfectProblems = await Problem.countDocuments({ user: userId, mistakes: { $size: 0 } });
  const successRate = totalSolved > 0 ? Math.round((perfectProblems / totalSolved) * 100) : 0;

  const stats = {
    totalSolved,
    revisionDue,
    patternsMastered,
    successRate
  };

  return <DashboardContent session={session} stats={stats} recentProblems={JSON.parse(JSON.stringify(recentProblems))} />;
}
