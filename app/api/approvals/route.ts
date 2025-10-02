import { NextResponse } from "next/server"
import { createApproval, createActivityLog } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const approval = await createApproval(data)
    
    // Log activity
    // Note: We would need to get project_id from the review to log properly
    // For now, we'll log without project context
    console.log("[Static Mode] Approval created:", approval)
    
    // In production, you would emit a socket event here:
    // const review = await getReviewById(data.reviewId)
    // io.to(`project_${review.project_id}`).emit('approval_received', approval)
    // io.to(`review_${data.reviewId}`).emit('status_updated', { status: approval.decision })
    
    return NextResponse.json(approval)
  } catch (error) {
    console.error("Error creating approval:", error)
    return NextResponse.json({ error: "Failed to create approval" }, { status: 500 })
  }
}
