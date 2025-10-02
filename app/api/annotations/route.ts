import { NextResponse } from "next/server"

// Mock annotations storage (in production, this would be in database)
const mockAnnotations: any[] = []

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get("fileId")

    if (fileId) {
      const annotations = mockAnnotations.filter((a) => a.file_id === parseInt(fileId))
      return NextResponse.json(annotations)
    }

    return NextResponse.json(mockAnnotations)
  } catch (error) {
    console.error("Error fetching annotations:", error)
    return NextResponse.json({ error: "Failed to fetch annotations" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const annotation = {
      id: mockAnnotations.length + 1,
      file_id: data.fileId,
      x: data.x,
      y: data.y,
      type: data.type,
      color: data.color,
      content: data.content,
      author: data.author,
      status: "open",
      created_at: new Date(),
      updated_at: new Date(),
    }
    
    mockAnnotations.push(annotation)
    
    console.log("[Static Mode] Annotation created:", annotation)
    
    // In production, you would emit a socket event here:
    // io.to(`file_${data.fileId}`).emit('annotation_added', annotation)
    
    return NextResponse.json(annotation)
  } catch (error) {
    console.error("Error creating annotation:", error)
    return NextResponse.json({ error: "Failed to create annotation" }, { status: 500 })
  }
}

