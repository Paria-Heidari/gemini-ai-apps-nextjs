import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const GOOGLE_GENAI_API_KEY = process.env.GEMINI_API_KEY as string;
// or "gemini-1.5-pro"
const MODEL = "gemini-2.0-flash";

export async function POST(req: Request): Promise<Response> {
  try {
    const data = await req.json();
    const prompt = data.prompt;
    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const generativeAI = new GoogleGenAI({ apiKey: GOOGLE_GENAI_API_KEY });
    const result = await generativeAI.models.generateContent({
      model: MODEL,
      contents: prompt,
    });
    const summary = result.text;

    return NextResponse.json({ summary });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json(
      { error: err?.message ?? "Server Error" },
      { status: 500 }
    );
  }
}
