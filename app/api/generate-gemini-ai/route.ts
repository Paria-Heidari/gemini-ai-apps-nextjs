import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const GOOGLE_GENAI_API_KEY = process.env.GEMINI_API_KEY as string;
// or "gemini-1.5-pro"
const MODEL = "gemini-2.0-flash";

export async function POST (req: Request): Promise<Response> {

  try{
    const data = await req.json();
    const prompt = data.prompt;
    if(!prompt){
      return NextResponse.json({error: "Missing prompt"}, {status:400});
    }

    const generativeAI = new GoogleGenerativeAI(GOOGLE_GENAI_API_KEY);
    const model = generativeAI.getGenerativeModel({model: MODEL});
    const result = await model.generateContent(prompt);
    const summary = await result.response.text();
    
    return NextResponse.json({summary});

  }catch (err: any){
    console.log(err);
    return NextResponse.json({error: err?.message ?? "Server Error"}, {status:500});
  }
}


