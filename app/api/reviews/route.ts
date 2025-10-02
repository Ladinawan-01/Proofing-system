import { NextResponse } from "next/server"
import { createReview, createActivityLog } from "@/lib/db"
import { nanoid } from "nanoid"

export async function POST(request: Request) {
  try {
    const { projectId } = await request.json()
    const shareLink = nanoid(10)
    const review = await createReview(projectId, shareLink)
    
    // Log activity
    await createActivityLog({
      projectId: projectId,
      userName: "Admin",
      action: "REVIEW_CREATED",
      details: `Created review ${shareLink}`,
    })
    
    console.log("[Static Mode] Review created:", review)
    
    // In production, you would emit a socket event here:
    // io.to(`project_${projectId}`).emit('review_created', review)
    
    return NextResponse.json(review)
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
