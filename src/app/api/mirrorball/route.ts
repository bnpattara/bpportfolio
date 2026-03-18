import { NextResponse } from "next/server";
import songsData from "@/data/mirrorball-songs.json";
import indexData from "@/data/mirrorball-index.json";

const SONGS = songsData as Array<{
  album: string;
  title: string;
  scene: string;
  human_truth: string;
  psych_concept?: string;
  spotify_url?: string;
  youtube_url?: string;
}>;
const SONG_INDEX = indexData as string[];

export async function POST(req: Request) {
  try {
    const { feeling } = await req.json();
    if (!feeling || typeof feeling !== "string" || feeling.trim().length < 3) {
      return NextResponse.json(
        { error: "Tell me a little more — even just a few words." },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Mirrorball API not configured. Set ANTHROPIC_API_KEY." },
        { status: 503 }
      );
    }

    const systemPrompt = [
      "You are the matching engine for MIRRORBALL, a book about Taylor Swift.",
      "Every song in the database is paired with a human truth and a cinematic scene.",
      "",
      "Database format per line: INDEX|TITLE|ALBUM|HUMAN_TRUTH|SCENE",
      "",
      "Read the user input. Find the ONE song whose human truth and scene",
      "resonate most deeply with what they expressed.",
      "Prioritize emotional resonance over keyword matching.",
      "",
      "Respond ONLY with valid JSON, no preamble, no markdown fences:",
      '{"index": <number>, "why": "<1-2 sentences in a sharp editorial voice explaining why this is their song. No hedging. Write as if it is obvious.>"}',
      "",
      "Song database:",
      SONG_INDEX.join("\n"),
    ].join("\n");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20251001",
        max_tokens: 300,
        system: systemPrompt,
        messages: [{ role: "user", content: "My feeling: " + feeling.trim() }],
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const msg =
        (errData as { error?: { message?: string } })?.error?.message ||
        `API ${response.status}`;
      return NextResponse.json({ error: msg }, { status: 502 });
    }

    const data = (await response.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };
    const textBlock = data.content?.find((b) => b.type === "text");
    const text = textBlock?.text ?? "";

    let parsed: { index?: number; why?: string };
    try {
      parsed = JSON.parse(text.trim());
    } catch {
      const match = text.match(/\{[\s\S]*?\}/);
      parsed = match ? JSON.parse(match[0]) : { index: -1 };
    }

    const idx = parseInt(String(parsed.index), 10);
    if (isNaN(idx) || idx < 0 || !SONGS[idx]) {
      return NextResponse.json(
        { error: "Could not find a matching song. Try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      song: SONGS[idx],
      why: parsed.why || "",
    });
  } catch (err) {
    console.error("Mirrorball API error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }
}
