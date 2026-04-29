import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const force = searchParams.get("force") === "true";
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const dbUser = await User.findOne({ email: session.user.email });
    if (!dbUser) return NextResponse.json({ error: "User not found" });

    // Check Cache (24 hour TTL)
    const now = new Date();
    const lastSync = dbUser.lastSyncedAt ? new Date(dbUser.lastSyncedAt) : null;
    const isCacheValid = lastSync && (now.getTime() - lastSync.getTime() < 24 * 60 * 60 * 1000);

    if (isCacheValid && !force) {
      return NextResponse.json({ ...dbUser.externalStats, cached: true, lastSyncedAt: dbUser.lastSyncedAt });
    }

    // Perform Fresh Sync
    const stats = {
      leetcode: { solved: 0 },
      gfg: { solved: 0, score: 0 },
      codechef: { rating: 0, stars: "" }
    };

    // 1. LeetCode (GraphQL - Most Reliable)
    if (dbUser.leetcodeUrl) {
      const username = dbUser.leetcodeUrl.split("/").filter(Boolean).pop();
      if (username) {
        try {
          const res = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: `
                query getUserProfile($username: String!) {
                  matchedUser(username: $username) {
                    submitStatsGlobal {
                      acSubmissionNum {
                        difficulty
                        count
                      }
                    }
                  }
                }
              `,
              variables: { username },
            }),
          });
          const data = await res.json();
          if (data.data?.matchedUser) {
            const allSolved = data.data.matchedUser.submitStatsGlobal.acSubmissionNum.find((i: any) => i.difficulty === "All");
            stats.leetcode.solved = allSolved?.count || 0;
          }
        } catch (e) {
          console.error("LC GraphQL Error", e);
        }
      }
    }

    // 2. GFG Live Sync
    if (dbUser.gfgUrl) {
      try {
        const response = await fetch(dbUser.gfgUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
          },
          cache: 'no-store'
        });
        if (response.ok) {
          const html = await response.text();
          
          // GFG: Precision JSON extraction (handling escaped quotes)
          const solvedMatch = html.match(/total_problems_solved["\\]+:(\d+)/i);
          if (solvedMatch) stats.gfg.solved = parseInt(solvedMatch[1]);

          const scoreMatch = html.match(/score["\\]+:(\d+)/i);
          if (scoreMatch) stats.gfg.score = parseInt(scoreMatch[1]);
        }
      } catch (e) {
        console.error("GFG Scraping Error", e);
      }
    }

    // 3. CodeChef Live Sync
    if (dbUser.codechefUrl) {
      try {
        const response = await fetch(dbUser.codechefUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
          },
          cache: 'no-store'
        });
        if (response.ok) {
          const html = await response.text();
          
          // CodeChef: Precision match (allowing for whitespace/newlines)
          const ratingMatch = html.match(/rating-number[^>]*?>\s*(\d+)/is);
          if (ratingMatch) {
            stats.codechef.rating = parseInt(ratingMatch[1]);
          }

          const starMatch = html.match(/rating-star\">(\d+★)/) || html.match(/>(\d+★)</) || html.match(/(\d+★)/);
          if (starMatch) {
            stats.codechef.stars = starMatch[1];
          }
        }
      } catch (e) {
        console.error("CodeChef Scraping Error", e);
      }
    }

    // Update Database with Snapshot
    const fs = require('fs');
    const logPath = require('path').join(process.cwd(), 'sync-audit.log');
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] Sync for ${session.user.email}: ${JSON.stringify(stats)}\n`);
    
    await User.updateOne(
      { _id: dbUser._id },
      { 
        externalStats: stats,
        lastSyncedAt: now
      }
    );

    return NextResponse.json({ ...stats, cached: false, lastSyncedAt: now });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
