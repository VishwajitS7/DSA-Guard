import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Special handling for LeetCode via GraphQL (bypasses Cloudflare bot protection)
    if (url.includes("leetcode.com/problems/")) {
      const titleSlug = url.match(/\/problems\/([^\/]+)/)?.[1];
      if (titleSlug) {
        const lcResponse = await fetch("https://leetcode.com/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query questionTitle($titleSlug: String!) {
                question(titleSlug: $titleSlug) {
                  title
                  difficulty
                  topicTags { name }
                }
              }
            `,
            variables: { titleSlug }
          })
        });

        if (lcResponse.ok) {
          const lcData = await lcResponse.json();
          if (lcData?.data?.question) {
            const q = lcData.data.question;
            
            // Map LeetCode tags to our system's topics
            const lcTopics = q.topicTags?.map((t: any) => t.name) || [];
            const topics = ["Array", "String", "DP", "Graph", "Tree", "LinkedList", "Binary Search", "Sliding Window", "Recursion", "Backtracking", "Stack", "Queue", "Heap", "Trie", "Math", "Bit Manipulation"];
            let detectedTopic = "Array"; // fallback
            
            for (const t of topics) {
              if (lcTopics.some((lcT: string) => lcT.toLowerCase().includes(t.toLowerCase()))) {
                detectedTopic = t;
                break;
              }
            }

            return NextResponse.json({
              title: q.title,
              difficulty: q.difficulty, // Usually returns "Easy", "Medium", "Hard"
              topic: detectedTopic
            });
          }
        }
      }
    }

    // Fallback logic for GFG and other sites using basic fetch
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Platform blocked the automated fetch request (403 Forbidden). Please enter details manually." }, { status: 400 });
    }

    const html = await response.text();

    // Extract Title using basic Regex for speed
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    let title = titleMatch ? titleMatch[1] : "";

    // Cleanup Title (Remove common suffixes)
    title = title.split(" | GeeksforGeeks")[0];
    title = title.split(" - GeeksforGeeks")[0];
    title = title.split(" - LeetCode")[0];

    // Extract Difficulty & Tags (Specific to LeetCode/GFG meta-tags or patterns)
    let difficulty = "Medium";
    if (html.toLowerCase().includes("easy")) difficulty = "Easy";
    if (html.toLowerCase().includes("hard")) difficulty = "Hard";

    // Detect Topic from keywords in HTML or URL
    const topics = ["Array", "String", "DP", "Graph", "Tree", "LinkedList"];
    let detectedTopic = "Array";
    for (const t of topics) {
      if (html.toLowerCase().includes(t.toLowerCase()) || url.toLowerCase().includes(t.toLowerCase())) {
        detectedTopic = t;
        break;
      }
    }

    return NextResponse.json({
      title: title.trim(),
      difficulty,
      topic: detectedTopic
    });

  } catch (error: any) {
    console.error("Metadata fetch error:", error);
    return NextResponse.json({ error: "Could not fetch metadata due to a server error." }, { status: 500 });
  }
}
