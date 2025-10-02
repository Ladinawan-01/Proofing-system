"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ReactSketchCanvas } from "react-sketch-canvas"
import { MapPin, Circle, Square, ArrowRight, Type, Pencil, X, Trash2, Undo, Edit2 } from "lucide-react"
import { saveComment, getCommentsByFile, StoredComment } from "@/lib/storage"
import { WelcomeModal } from "./welcome-modal"

interface DesignItem {
  id: number
  file_url: string
  file_name: string
  version: number
}

interface DesignViewerProps {
  designItems: DesignItem[]
  reviewId: number
  projectName: string
}

interface Comment {
  id: number
  author: string
  content: string
  timestamp: Date
  type: "comment" | "annotation"
  hasDrawing: boolean
  drawingData?: string // Base64 image of the drawing
}

export function DesignViewer({ designItems, reviewId, projectName }: DesignViewerProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [comments, setComments] = useState<Record<number, Comment[]>>({})
  const [newCommentText, setNewCommentText] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [isAddingAnnotation, setIsAddingAnnotation] = useState(false)
  const [selectedComment, setSelectedComment] = useState<number | null>(null)
  const [annotationDrawings, setAnnotationDrawings] = useState<Record<number, string>>({})
  const [loaded, setLoaded] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  
  // Annotation state
  const [annotationMode, setAnnotationMode] = useState(false)
  const [strokeColor, setStrokeColor] = useState("#ef4444")
  const [strokeWidth, setStrokeWidth] = useState(3)
  const [viewingAnnotation, setViewingAnnotation] = useState<string | null>(null)
  const canvasRef = useRef<any>(null)
  
  const selectedItem = designItems[selectedIndex]
  const itemComments = comments[selectedItem.id] || []

  const colors = ["#ef4444", "#3b82f6", "#22c55e", "#eab308", "#a855f7", "#ec4899", "#000000"]

  // Load comments from localStorage on mount
  useEffect(() => {
    const loadComments = () => {
      const allStoredComments = getCommentsByFile(reviewId, selectedItem.id)
      
      // Convert stored comments to component format
      const commentsMap: Record<number, Comment[]> = {}
      
      designItems.forEach((item) => {
        const fileComments = getCommentsByFile(reviewId, item.id)
        commentsMap[item.id] = fileComments.map((sc) => ({
          id: sc.id,
          author: sc.author,
          content: sc.content,
          timestamp: new Date(sc.timestamp),
          type: sc.type,
          hasDrawing: sc.hasDrawing,
          drawingData: sc.drawingData,
        }))
      })
      
      setComments(commentsMap)
      setLoaded(true)
    }
    
    loadComments()
  }, [reviewId])

  // Check for author name and show welcome modal if needed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('client_proofing_author_name')
      if (savedName) {
        setAuthorName(savedName)
        setShowWelcomeModal(false)
      } else {
        // No name found, show welcome modal
        setShowWelcomeModal(true)
      }
    }
  }, [])

  const handleWelcomeSubmit = (name: string) => {
    setAuthorName(name)
    localStorage.setItem('client_proofing_author_name', name)
    setShowWelcomeModal(false)
  }

  const handleChangeName = () => {
    const newName = prompt("Enter your new name:", authorName)
    if (newName && newName.trim()) {
      setAuthorName(newName.trim())
      localStorage.setItem('client_proofing_author_name', newName.trim())
    }
  }

  const handleSubmitAnnotation = async () => {
    if (!newCommentText.trim() || !authorName.trim()) {
      alert("Please enter your name and message")
      return
    }

    let hasDrawing = false
    let drawingData = undefined

    // Check if there are any drawings and export image
    if (canvasRef.current && isAddingAnnotation) {
      try {
        const paths = await canvasRef.current.exportPaths()
        hasDrawing = paths && paths.length > 0
        
        if (hasDrawing) {
          // Export drawing as base64 image
          drawingData = await canvasRef.current.exportImage("png")
        }
      } catch (e) {
        console.log("No drawings to export")
      }
    }

    const commentId = Date.now()
    const newComment: Comment = {
      id: commentId,
      author: authorName,
      content: newCommentText,
      timestamp: new Date(),
      type: isAddingAnnotation ? "annotation" : "comment",
      hasDrawing: hasDrawing,
      drawingData: drawingData,
    }

    // Save to state
    setComments({
      ...comments,
      [selectedItem.id]: [...itemComments, newComment],
    })

    // Save to localStorage
    const storedComment: StoredComment = {
      id: commentId,
      author: authorName,
      content: newCommentText,
      timestamp: new Date().toISOString(),
      type: isAddingAnnotation ? "annotation" : "comment",
      hasDrawing: hasDrawing,
      drawingData: drawingData,
      reviewId: reviewId,
      fileId: selectedItem.id,
    }
    saveComment(storedComment)

    // Save author name for future use
    if (typeof window !== 'undefined') {
      localStorage.setItem('client_proofing_author_name', authorName)
    }

    // Store drawing separately for overlay display
    if (drawingData) {
      setAnnotationDrawings({
        ...annotationDrawings,
        [commentId]: drawingData,
      })
    }
    
    setNewCommentText("")
    setIsAddingAnnotation(false)
    
    if (hasDrawing) {
      alert("✅ Annotation with drawing saved successfully!")
      // Clear canvas after submit
      if (canvasRef.current) {
        canvasRef.current.clearCanvas()
      }
    } else {
      alert("✅ Comment saved successfully!")
    }
  }

  const handleAnnotationClick = (comment: Comment) => {
    if (comment.type === "annotation" && comment.drawingData) {
      // Toggle viewing annotation on image
      if (viewingAnnotation === comment.drawingData) {
        setViewingAnnotation(null)
        setSelectedComment(null)
      } else {
        setViewingAnnotation(comment.drawingData)
        setSelectedComment(comment.id)
      }
    } else {
      setSelectedComment(selectedComment === comment.id ? null : comment.id)
    }
  }

  const handleClearDrawings = () => {
    if (canvasRef.current) {
      canvasRef.current.clearCanvas()
    }
  }

  const handleUndo = () => {
    if (canvasRef.current) {
      canvasRef.current.undo()
    }
  }

  const getTimeAgo = (date: Date) => {
    const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (days === 0) return "today"
    if (days === 1) return "1 day ago"
    return `${days} days ago`
  }

  return (
    <div className="h-full flex flex-col bg-[#1a1a1a]">
      {/* Thumbnails Row with Buttons */}
      <div className="flex items-start justify-between p-6 bg-[#1a1a1a]">
      {/* Thumbnails */}
        <div className="flex gap-6">
        {designItems.map((item, index) => (
            <div key={item.id} className="flex flex-col items-center gap-2">
          <button
            onClick={() => setSelectedIndex(index)}
                className={`w-32 h-32 rounded overflow-hidden border-2 transition-all ${
                  selectedIndex === index 
                    ? "border-[#fdb913] ring-2 ring-[#fdb913]/50" 
                    : "border-neutral-700 hover:border-neutral-600"
            }`}
          >
            <Image
              src={item.file_url || "/placeholder.svg"}
              alt={item.file_name}
                  width={128}
                  height={128}
              className="w-full h-full object-cover"
            />
          </button>
              <span className="text-sm text-white">{item.file_name}</span>
            </div>
        ))}
      </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 min-w-[280px]">
          <button className="w-full px-6 py-3.5 bg-transparent border-2 border-[#fdb913] text-[#fdb913] font-bold rounded hover:bg-[#fdb913] hover:text-black transition-all uppercase tracking-wide text-sm">
            Approve Project
          </button>
          <button className="w-full px-6 py-3.5 bg-transparent border-2 border-white text-white font-bold rounded hover:bg-white hover:text-black transition-all uppercase tracking-wide text-sm">
            Request Revisions
              </button>
            <button
              onClick={() => {
                setAnnotationMode(!annotationMode)
              setIsAddingAnnotation(!annotationMode)
              }}
            className={`w-full px-6 py-3.5 font-bold rounded transition-all uppercase tracking-wide text-sm ${
                annotationMode
                ? "bg-[#fdb913] text-black hover:bg-[#e5a711]"
                : "bg-transparent border-2 border-white text-white hover:bg-white hover:text-black"
              }`}
            >
            {annotationMode ? "Exit Annotation Mode" : "Add Annotations"}
            </button>
          </div>
        </div>

        {/* Annotation Toolbar */}
        {annotationMode && (
        <div className="bg-neutral-900 border-y-2 border-[#fdb913] px-6 py-4">
          <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
              <span className="text-neutral-400 text-sm font-semibold">Color:</span>
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setStrokeColor(c)}
                  className={`w-8 h-8 rounded border-2 transition-transform hover:scale-110 ${
                    strokeColor === c ? "border-white scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>

            <div className="h-8 w-px bg-neutral-700"></div>

            <div className="flex items-center gap-2">
              <span className="text-neutral-400 text-sm font-semibold">Size:</span>
              <input
                type="range"
                min="1"
                max="10"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                className="w-24 accent-[#fdb913]"
              />
              <span className="text-white text-sm w-8">{strokeWidth}px</span>
              </div>

            <div className="h-8 w-px bg-neutral-700"></div>

            <button
              onClick={handleUndo}
              className="p-2 rounded bg-neutral-800 text-white hover:bg-neutral-700 transition-colors flex items-center gap-2"
            >
              <Undo className="w-4 h-4" />
              Undo
            </button>

            <button
              onClick={handleClearDrawings}
              className="p-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>

            <div className="flex-1"></div>

            <div className="text-sm text-[#fdb913] flex items-center gap-2">
              <Pencil className="w-4 h-4" />
              Click to add pin marker or draw on image
              </div>
            </div>
          </div>
        )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Image Display Area with Drawing Canvas */}
        <div className="flex-1 bg-black flex items-center justify-center p-8 overflow-auto relative">
          <div className="relative inline-block max-w-full">
          <Image
            src={selectedItem.file_url || "/placeholder.svg"}
            alt={selectedItem.file_name}
              width={1200}
              height={900}
              className="max-w-full h-auto"
              priority
            />
            
            {/* Annotation Mode - Drawing Canvas */}
            {annotationMode && (
              <div className="absolute inset-0">
                <ReactSketchCanvas
                  ref={canvasRef}
                  strokeColor={strokeColor}
                      strokeWidth={strokeWidth}
                  canvasColor="transparent"
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </div>
            )}

            {/* View Mode - Show Selected Annotation Drawing on Image */}
            {!annotationMode && viewingAnnotation && (
              <div className="absolute inset-0 pointer-events-none">
                <Image
                  src={viewingAnnotation}
                  alt="Annotation Overlay"
                  width={1200}
                  height={900}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Viewing Indicator Badge */}
            {viewingAnnotation && !annotationMode && (
              <div className="absolute top-4 left-4 px-4 py-2 bg-[#fdb913] text-black rounded-lg font-bold text-sm shadow-xl flex items-center gap-2 animate-pulse">
                <Pencil className="w-4 h-4" />
                Viewing Annotation on Image
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Comments & Annotations */}
        <div className="w-96 bg-black border-l border-neutral-800 flex flex-col">
          {/* Section Header */}
          <div className="p-4 border-b border-neutral-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-[#fdb913]">💬</span>
              Comments & Annotations
              {isAddingAnnotation && (
                <span className="ml-2 px-2 py-1 bg-[#fdb913] text-black text-xs rounded font-semibold animate-pulse">
                  Drawing Mode
                </span>
              )}
                  </h3>
                </div>

          {/* Comments & Annotations List */}
          <div className="flex-1 overflow-y-auto p-6">
            {itemComments.length > 0 ? (
              <div className="space-y-4">
              {itemComments.map((comment) => (
                  <div 
                    key={comment.id} 
                    className={`cursor-pointer transition-all ${
                      comment.type === "annotation" 
                        ? `p-3 rounded-lg ${viewingAnnotation === comment.drawingData ? 'bg-[#fdb913]/30 border-2 border-[#fdb913]' : 'bg-[#fdb913]/10 border border-[#fdb913]/30'} hover:bg-[#fdb913]/20` 
                        : "hover:bg-neutral-900/50 p-2 rounded"
                    }`}
                    onClick={() => handleAnnotationClick(comment)}
                  >
                    <div className="flex gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                        comment.type === "annotation" 
                          ? "bg-gradient-to-br from-[#fdb913] to-orange-500" 
                          : "bg-gradient-to-br from-purple-500 to-pink-500"
                      }`}>
                        {comment.type === "annotation" ? "📍" : comment.author.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                          <span className="text-white font-semibold text-sm">{comment.author}</span>
                          {comment.type === "annotation" && (
                            <span className="px-2 py-0.5 bg-[#fdb913]/20 text-[#fdb913] text-xs rounded font-semibold">
                              Annotation
                            </span>
                          )}
                          <span className="text-neutral-500 text-xs">
                            •{getTimeAgo(comment.timestamp)}
                          </span>
                                </div>
                        <p className="text-neutral-300 text-sm leading-relaxed">{comment.content}</p>
                        {comment.hasDrawing && (
                          <div className="mt-2 text-xs text-[#fdb913] flex items-center gap-1">
                            <Pencil className="w-3 h-3" />
                            {viewingAnnotation === comment.drawingData ? "✓ Showing on image" : "👁️ Click to view on image"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-neutral-500 text-sm">
                  {isAddingAnnotation ? "Draw on image, then add message below" : "No comments yet"}
                </p>
              </div>
            )}
          </div>

          {/* Add Comment/Annotation Input */}
          <div className="p-4 border-t border-neutral-800 space-y-3">
            {/* Mode Indicator */}
            {isAddingAnnotation && (
              <div className="px-3 py-2 bg-[#fdb913]/20 border border-[#fdb913]/50 rounded text-[#fdb913] text-xs font-semibold flex items-center gap-2">
                <Pencil className="w-4 h-4" />
                Annotation Mode - Draw on image & add message
            </div>
          )}

            {/* Name Display (Disabled) */}
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-3 px-4 py-2.5 bg-neutral-900/50 rounded-lg border border-neutral-700">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="flex-1 text-white text-sm font-semibold">
                  {authorName || "Your name"}
                </span>
              </div>
              <button
                onClick={handleChangeName}
                className="p-2.5 bg-neutral-800 text-neutral-400 rounded hover:bg-neutral-700 hover:text-[#fdb913] transition-colors"
                title="Change Name"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            {/* Message Textarea */}
            <div className="px-4 py-3 bg-neutral-900 rounded-lg border border-neutral-800 hover:border-neutral-700 focus-within:border-[#fdb913] transition-colors">
            <textarea
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder={isAddingAnnotation ? "Add annotation message..." : "Add comment..."}
              rows={3}
                className="w-full bg-transparent text-white text-sm outline-none placeholder:text-neutral-600 resize-none"
            />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitAnnotation}
              disabled={!newCommentText.trim() || !authorName.trim()}
              className="w-full px-4 py-2.5 bg-[#fdb913] text-black font-bold rounded hover:bg-[#e5a711] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wide"
            >
              {isAddingAnnotation ? "Submit Annotation" : "Submit Comment"}
            </button>

            {/* Helper Text */}
            <p className="text-xs text-neutral-500 text-center">
              {isAddingAnnotation 
                ? "Draw on the image using colors above, then add your message" 
                : "Share your feedback and comments"}
            </p>
          </div>
        </div>
      </div>

      {/* Welcome Modal */}
      {showWelcomeModal && (
        <WelcomeModal 
          onSubmit={handleWelcomeSubmit} 
          projectName={projectName} 
        />
      )}
    </div>
  )
}

