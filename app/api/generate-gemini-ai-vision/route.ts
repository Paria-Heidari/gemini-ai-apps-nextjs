import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import fs from "node:fs";

const GOOGLE_GENAI_API_KEY = process.env.GEMINI_API_KEY as string;
const MODEL = "gemini-2.5-flash";

function fileToGenerate(path: string, mimeType: string) {
  const base64ImageFile = fs.readFileSync(path).toString("base64");

  const initContents = [
    {
      role: "user",
      parts: [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64ImageFile,
          },
        },
      ],
    },
  ];

  return initContents;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const filePath = body?.filePath;
    const mimeType = body?.mimeType;
    const contents = fileToGenerate(filePath, mimeType);
    const genAI = new GoogleGenAI({ apiKey: GOOGLE_GENAI_API_KEY });

    const result = await genAI.models.generateContent({
      model: MODEL,
      contents: contents,
    });

    const summary = result.text;

    return NextResponse.json({ summary });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Gemeni error", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
