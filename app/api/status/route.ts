import { NextResponse } from "next/server"
import { createActivityLog } from "@/lib/db"

export async function PUT(request: Request) {
  try {
    const { reviewId, projectId, status, userName } = await request.json()
    
    console.log("[Static Mode] Status updated:", { reviewId, status })
    
    // Log activity
    if (projectId) {
      await createActivityLog({
        projectId: projectId,
        userName: userName || "Client",
        action: "STATUS_UPDATED",
        details: `Changed status to ${status}`,
      })
    }
    
    // In production, you would:
    // 1. Update the review status in database
    // 2. Emit socket event for real-time updates
    // io.to(`project_${projectId}`).emit('status_updated', { reviewId, status })
    // io.to(`review_${reviewId}`).emit('status_changed', { status })
    
    return NextResponse.json({ success: true, status })
  } catch (error) {
    console.error("Error updating status:", error)
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 })
  }
}

