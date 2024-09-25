import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

type Message = {
    role: "system";
    content: string;
  };

const instructionMessage: Message = {
    role: "system",
    content: "You are a code generator, you must answer only in markdown code snippets. Use code comments for explanations."
}

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { messages } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!messages) {
            return new NextResponse("Messages are required", { status: 400 });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [instructionMessage, ...messages]
        });

        return NextResponse.json(response.choices[0].message);

    } catch (error) {
        console.log('[CODE_ERROR]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


