import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { streamChat, type ChatMessage } from "@/lib/ai";
import { chatMessageSchema } from "@/lib/validations";
import { INTAKE_SYSTEM_PROMPT } from "@/config/prompts";
import type { Prisma } from "@/generated/prisma/client";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { message, businessId, sessionId } = chatMessageSchema.parse(body);

    const business = await prisma.business.findFirst({
      where: { id: businessId, ownerId: (session.user as { id: string }).id },
      include: { profile: true },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    let intakeSession;
    if (sessionId) {
      intakeSession = await prisma.intakeSession.findUnique({
        where: { id: sessionId },
      });
    }

    if (!intakeSession) {
      intakeSession = await prisma.intakeSession.create({
        data: { businessId, messages: [] },
      });
    }

    const existingMessages = intakeSession.messages as unknown as ChatMessage[];
    const updatedMessages: ChatMessage[] = [
      ...existingMessages,
      { role: "user", content: message },
    ];

    const encoder = new TextEncoder();
    let assistantResponse = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamChat(updatedMessages, INTAKE_SYSTEM_PROMPT)) {
            assistantResponse += chunk;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
          }

          const finalMessages: ChatMessage[] = [
            ...updatedMessages,
            { role: "assistant", content: assistantResponse },
          ];

          await prisma.intakeSession.update({
            where: { id: intakeSession.id },
            data: { messages: JSON.parse(JSON.stringify(finalMessages)) as Prisma.InputJsonValue },
          });

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ done: true, sessionId: intakeSession.id })}\n\n`
            )
          );
          controller.close();
        } catch (error) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: "Stream failed" })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
