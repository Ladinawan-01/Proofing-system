"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ReactSketchCanvas } from "react-sketch-canvas";
import {
  MapPin,
  Circle,
  Square,
  ArrowRight,
  Type,
  Pencil,
  X,
  Trash2,
  Undo,
  Edit2,
} from "lucide-react";
import { saveComment, getCommentsByFile, StoredComment } from "@/lib/storage";
import { WelcomeModal } from "./welcome-modal";

interface DesignItem {
  id: number;
  file_url: string;
  file_name: string;
  version: number;
}

interface DesignViewerProps {
  designItems: DesignItem[];
  reviewId: number;
  projectName: string;
}

interface Comment {
  id: number;
  author: string;
  content: string;
  timestamp: Date;
  type: "comment" | "annotation";
  hasDrawing: boolean;
  drawingData?: string; // Base64 image of the drawing
}

export function DesignViewer({
  designItems,
  reviewId,
  projectName,
}: DesignViewerProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [newCommentText, setNewCommentText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isAddingAnnotation, setIsAddingAnnotation] = useState(false);
  const [selectedComment, setSelectedComment] = useState<number | null>(null);
  const [annotationDrawings, setAnnotationDrawings] = useState<
    Record<number, string>
  >({});
  const [loaded, setLoaded] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // Annotation state
  const [annotationMode, setAnnotationMode] = useState(false);
  const [strokeColor, setStrokeColor] = useState("#ef4444");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [viewingAnnotation, setViewingAnnotation] = useState<string | null>(
    null
  );
  const canvasRef = useRef<any>(null);

  const selectedItem = designItems[selectedIndex];
  const itemComments = comments[selectedItem.id] || [];

  const colors = [
    "#ef4444",
    "#3b82f6",
    "#22c55e",
    "#eab308",
    "#a855f7",
    "#ec4899",
    "#000000",
  ];

  // Load comments from localStorage on mount
  useEffect(() => {
    const loadComments = () => {
      const allStoredComments = getCommentsByFile(reviewId, selectedItem.id);

      // Convert stored comments to component format
      const commentsMap: Record<number, Comment[]> = {};

      designItems.forEach((item) => {
        const fileComments = getCommentsByFile(reviewId, item.id);
        commentsMap[item.id] = fileComments.map((sc) => ({
          id: sc.id,
          author: sc.author,
          content: sc.content,
          timestamp: new Date(sc.timestamp),
          type: sc.type,
          hasDrawing: sc.hasDrawing,
          drawingData: sc.drawingData,
        }));
      });

      setComments(commentsMap);
      setLoaded(true);
    };

    loadComments();
  }, [reviewId]);

  // Check for author name and show welcome modal if needed
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("client_proofing_author_name");
      if (savedName) {
        setAuthorName(savedName);
        setShowWelcomeModal(false);
      } else {
        // No name found, show welcome modal
        setShowWelcomeModal(true);
      }
    }
  }, []);

  const handleWelcomeSubmit = (name: string) => {
    setAuthorName(name);
    localStorage.setItem("client_proofing_author_name", name);
    setShowWelcomeModal(false);
  };

  const handleChangeName = () => {
    const newName = prompt("Enter your new name:", authorName);
    if (newName && newName.trim()) {
      setAuthorName(newName.trim());
      localStorage.setItem("client_proofing_author_name", newName.trim());
    }
  };

  const handleSubmitAnnotation = async () => {
    if (!newCommentText.trim() || !authorName.trim()) {
      alert("Please enter your name and message");
      return;
    }

    let hasDrawing = false;
    let drawingData = undefined;

    // Check if there are any drawings and export image
    if (canvasRef.current && isAddingAnnotation) {
      try {
        const paths = await canvasRef.current.exportPaths();
        hasDrawing = paths && paths.length > 0;

        if (hasDrawing) {
          // Export drawing as base64 image
          drawingData = await canvasRef.current.exportImage("png");
        }
      } catch (e) {
        console.log("No drawings to export");
      }
    }

    const commentId = Date.now();
    const newComment: Comment = {
      id: commentId,
      author: authorName,
      content: newCommentText,
      timestamp: new Date(),
      type: isAddingAnnotation ? "annotation" : "comment",
      hasDrawing: hasDrawing,
      drawingData: drawingData,
    };

    // Save to state
    setComments({
      ...comments,
      [selectedItem.id]: [...itemComments, newComment],
    });

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
    };
    saveComment(storedComment);

    // Save author name for future use
    if (typeof window !== "undefined") {
      localStorage.setItem("client_proofing_author_name", authorName);
    }

    // Store drawing separately for overlay display
    if (drawingData) {
      setAnnotationDrawings({
        ...annotationDrawings,
        [commentId]: drawingData,
      });
    }

    setNewCommentText("");
    setIsAddingAnnotation(false);
    setAnnotationMode(false);

    if (hasDrawing) {
      alert("✅ Annotation with drawing saved successfully!");
      // Clear canvas after submit
      if (canvasRef.current) {
        canvasRef.current.clearCanvas();
      }
    } else {
      alert("✅ Comment saved successfully!");
    }
  };

  const handleAnnotationClick = (comment: Comment) => {
    if (comment.type === "annotation" && comment.drawingData) {
      // Toggle viewing annotation on image
      if (viewingAnnotation === comment.drawingData) {
        setViewingAnnotation(null);
        setSelectedComment(null);
      } else {
        setViewingAnnotation(comment.drawingData);
        setSelectedComment(comment.id);
      }
    } else {
      setSelectedComment(selectedComment === comment.id ? null : comment.id);
    }
  };

  const handleClearDrawings = () => {
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
    }
  };

  const handleUndo = () => {
    if (canvasRef.current) {
      canvasRef.current.undo();
    }
  };

  const getTimeAgo = (date: Date) => {
    const days = Math.floor(
      (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (days === 0) return "today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  };

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

        {/* Action Buttons - Removed Add Annotations button */}
        <div className="flex flex-col gap-3 min-w-[280px]">
          <button className="w-full px-6 py-3.5 bg-transparent border-2 border-[#fdb913] text-[#fdb913] font-bold rounded hover:bg-[#fdb913] hover:text-black transition-all uppercase tracking-wide text-sm">
            Approve Project
          </button>
          <button className="w-full px-6 py-3.5 bg-transparent border-2 border-white text-white font-bold rounded hover:bg-white hover:text-black transition-all uppercase tracking-wide text-sm">
            Request Revisions
          </button>
        </div>
      </div>

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
                        ? `p-3 rounded-lg ${
                            viewingAnnotation === comment.drawingData
                              ? "bg-[#fdb913]/30 border-2 border-[#fdb913]"
                              : "bg-[#fdb913]/10 border border-[#fdb913]/30"
                          } hover:bg-[#fdb913]/20`
                        : "hover:bg-neutral-900/50 p-2 rounded"
                    }`}
                    onClick={() => handleAnnotationClick(comment)}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                          comment.type === "annotation"
                            ? "bg-gradient-to-br from-[#fdb913] to-orange-500"
                            : "bg-gradient-to-br from-purple-500 to-pink-500"
                        }`}
                      >
                        {comment.type === "annotation"
                          ? "📍"
                          : comment.author.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                          <span className="text-white font-semibold text-sm">
                            {comment.author}
                          </span>
                          {comment.type === "annotation" && (
                            <span className="px-2 py-0.5 bg-[#fdb913]/20 text-[#fdb913] text-xs rounded font-semibold">
                              Annotation
                            </span>
                          )}
                          <span className="text-neutral-500 text-xs">
                            •{getTimeAgo(comment.timestamp)}
                          </span>
                        </div>
                        <p className="text-neutral-300 text-sm leading-relaxed">
                          {comment.content}
                        </p>
                        {comment.hasDrawing && (
                          <div className="mt-2 text-xs text-[#fdb913] flex items-center gap-1">
                            <Pencil className="w-3 h-3" />
                            {viewingAnnotation === comment.drawingData
                              ? "✓ Showing on image"
                              : "👁️ Click to view on image"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-neutral-500 text-sm">No comments yet</p>
              </div>
            )}
          </div>

          {/* Add Comment/Annotation Input - WeTransfer Style with Custom Icons */}
          <div className="p-4 border-t border-neutral-800 space-y-3">
            {/* Mode Indicator */}
            {isAddingAnnotation && (
              <div className="px-3 py-2 bg-[#fdb913]/20 border border-[#fdb913]/50 rounded text-[#fdb913] text-xs font-semibold flex items-center gap-2">
                <Pencil className="w-4 h-4" />
                Annotation Mode - Draw on image & add message
              </div>
            )}

            {/* Name Display */}
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-3 px-4 py-2.5 bg-neutral-900/50 rounded-lg border border-neutral-700">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
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

            {/* Comment Input Box - WeTransfer Style */}
            <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-3">
              {/* Annotation Controls Row - WeTransfer Style */}
              <div className="flex items-center gap-2 mb-2">
                {/* Color Swatches - WeTransfer Style */}
                <div className="flex items-center gap-1">
                  {colors.slice(0, 4).map((c) => (
                    <button
                      key={c}
                      onClick={() => setStrokeColor(c)}
                      className={`w-4 h-4 rounded-full border transition-transform hover:scale-110 ${
                        strokeColor === c
                          ? "border-white scale-110"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: c }}
                      title={`Select ${c} color`}
                    />
                  ))}
                </div>

                {/* Annotation Tools - WeTransfer Icons */}
                <div className="flex items-center gap-1 ml-2">
                  {/* Drawing/Pen Icon - Squiggly line (white) */}
                  <button
                    onClick={() => {
                      setIsAddingAnnotation(!isAddingAnnotation);
                      setAnnotationMode(!isAddingAnnotation);
                    }}
                    className={`p-1.5 rounded transition-colors ${
                      isAddingAnnotation
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-neutral-700 text-white hover:bg-neutral-600"
                    }`}
                    title={isAddingAnnotation ? "Exit annotation mode" : "Add annotation"}
                  >
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 3l4 8 5-5 5 15H2L8 3z"/>
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l14 0Z"/>
                    </svg>
                  </button>

                  {/* Separator Line */}
                  <div className="w-px h-4 bg-neutral-600"></div>

                  {/* Color Drop/Pin Icon - Solid red teardrop */}
                  <button
                    onClick={() => {
                      setIsAddingAnnotation(!isAddingAnnotation);
                      setAnnotationMode(!isAddingAnnotation);
                    }}
                    className={`p-1.5 rounded transition-colors ${
                      isAddingAnnotation
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-neutral-700 hover:bg-neutral-600"
                    }`}
                    title={isAddingAnnotation ? "Exit annotation mode" : "Add annotation"}
                  >
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </button>

                  {/* Trash Can Icon - Light gray outline */}
                  {isAddingAnnotation && (
                    <button
                      onClick={handleClearDrawings}
                      className="p-1.5 rounded bg-neutral-700 text-neutral-400 hover:bg-neutral-600 hover:text-red-400 transition-colors"
                      title="Clear all drawings"
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="M19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                      </svg>
                    </button>
                  )}
                </div>

                {/* Additional Controls when in annotation mode */}
                {isAddingAnnotation && (
                  <div className="flex items-center gap-2 ml-auto">
                    <div className="flex items-center gap-1">
                      <span className="text-neutral-400 text-xs">Size:</span>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={strokeWidth}
                        onChange={(e) =>
                          setStrokeWidth(parseInt(e.target.value))
                        }
                        className="w-12 accent-[#fdb913]"
                        title="Brush size"
                      />
                      <span className="text-white text-xs w-4">
                        {strokeWidth}px
                      </span>
                    </div>

                    <button
                      onClick={handleUndo}
                      className="p-1.5 rounded bg-neutral-700 text-neutral-400 hover:bg-neutral-600 hover:text-white transition-colors"
                      title="Undo"
                    >
                      <Undo className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Text Input Area */}
              <textarea
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Add comment..."
                rows={3}
                className="w-full bg-transparent text-white text-sm outline-none placeholder:text-neutral-500 resize-none"
              />
            </div>

            {/* Action Buttons - WeTransfer Style */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsAddingAnnotation(false);
                  setAnnotationMode(false);
                  setNewCommentText("");
                }}
                className="px-4 py-2 text-neutral-400 hover:text-white transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAnnotation}
                disabled={!newCommentText.trim() || !authorName.trim()}
                className="ml-auto px-4 py-2 bg-[#fdb913] text-black font-bold rounded hover:bg-[#e5a711] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isAddingAnnotation ? "Add Annotation" : "Add"}
              </button>
            </div>

            {/* Helper Text */}
            {isAddingAnnotation && (
              <p className="text-xs text-neutral-500 text-center">
                Draw on the image using colors above, then add your message
              </p>
            )}
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
  );
}
