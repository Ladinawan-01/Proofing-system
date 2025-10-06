import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// PATCH - Update review status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reviewId = parseInt(params.id)
    const { status } = await request.json()

    if (!status || !['PENDING', 'APPROVED', 'REVISION_REQUESTED'].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: { status },
      include: {
        project: true
      }
    })

    return NextResponse.json(updatedReview)
  } catch (error) {
    console.error('Error updating review status:', error)
    return NextResponse.json({ error: "Failed to update review status" }, { status: 500 })
  }
}
