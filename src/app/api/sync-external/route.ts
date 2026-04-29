import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const dbUser = await User.findOne({ email: session.user.email });

    if (!dbUser) return NextResponse.json({ error: "User not found" });

    const stats = {
      leetcode: { solved: 0, rating: 0 },
      gfg: { solved: 0, score: 0 },
      codechef: { rating: 0, stars: "" }
    };

    // 1. LeetCode Sync
    if (dbUser.leetcodeUrl) {
      const username = dbUser.leetcodeUrl.split("/").filter(Boolean).pop();
      if (username) {
        try {
          const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
          const data = await res.json();
          if (data.status === "success") {
            stats.leetcode.solved = data.totalSolved;
          }
        } catch (e) {
          console.error("LC Sync Error", e);
        }
      }
    }

    // 2. GFG Live Sync
    if (dbUser.gfgUrl) {
      try {
        const response = await fetch(dbUser.gfgUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
          },
          cache: 'no-store'
        });
        const html = await response.text();
        
        // GFG: Improved detection for "Problems Solved"
        const solvedMatch = html.match(/Problems Solved:?<\/span>\s*<span.*?>(\d+)</i) || 
                            html.match(/scoreCard_card_value__.*?>(\d+)</i) ||
                            html.match(/>(\d+)\s*Problems Solved</i);
        if (solvedMatch) {
          stats.gfg.solved = parseInt(solvedMatch[1]);
        }
        
        // GFG: Improved detection for "Coding Score"
        const scoreMatch = html.match(/Coding Score:?<\/span>\s*<span.*?>(\d+)</i) ||
                           html.match(/scoreCard_card_value__.*?>(\d+)</gi)?.[1]?.match(/>(\d+)</)?.[1];
        if (scoreMatch) {
          stats.gfg.score = parseInt(scoreMatch as any);
        }
      } catch (e) {
        console.error("GFG Sync Error", e);
      }
    }

    // 3. CodeChef Live Sync
    if (dbUser.codechefUrl) {
      try {
        const response = await fetch(dbUser.codechefUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
          },
          cache: 'no-store'
        });
        const html = await response.text();
        
        // CodeChef: Direct class match or relative label match
        const ratingMatch = html.match(/<div class="rating-number">(\d+)/i) || 
                            html.match(/(\d+)\s*<\/div>\s*<div class="rating-label"/i) ||
                            html.match(/rating-number.*?(\d+)</is);
        if (ratingMatch) {
          stats.codechef.rating = parseInt(ratingMatch[1]);
        }

        // CodeChef: Star level match
        const starMatch = html.match(/(\d+★)/) || html.match(/rating-star">(\d+★)/) || html.match(/>(\d+)\s*★/);
        if (starMatch) {
          stats.codechef.stars = starMatch[1].includes('★') ? starMatch[1] : starMatch[1] + '★';
        }
      } catch (e) {
        console.error("CodeChef Sync Error", e);
      }
    }

    return NextResponse.json(stats);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
