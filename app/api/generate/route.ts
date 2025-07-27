import { type NextRequest, NextResponse } from "next/server"
import { generateFullStackCode } from "@/lib/code-generator"

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required and must be a string" }, { status: 400 })
    }

    // Generate unified full-stack code
    const result = await generateFullStackCode(prompt)

    return NextResponse.json({
      files: result.files,
      prompt,
    })
  } catch (error) {
    console.error("Code generation error:", error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate code",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 },
    )
  }
}
