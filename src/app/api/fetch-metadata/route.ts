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

    // Attempt to fetch the page content
    // Note: This is a basic implementation. Professional scrapers use Puppeteer for JS-heavy sites like LeetCode.
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch the URL");
    }

    const html = await response.text();

    // Extract Title using basic Regex for speed
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    let title = titleMatch ? titleMatch[1] : "";

    // Cleanup Title (Remove common suffixes)
    title = title.split(" - LeetCode")[0];
    title = title.split(" | GeeksforGeeks")[0];
    title = title.split(" - GeeksforGeeks")[0];

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
    return NextResponse.json({ error: "Could not fetch metadata" }, { status: 500 });
  }
}
