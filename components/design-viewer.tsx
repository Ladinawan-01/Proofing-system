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
  PenTool,
  Droplets,
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
  hideApprovalButtons?: boolean; // Add this new prop
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
  hideApprovalButtons = false,
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
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between p-4 lg:p-6 bg-[#1a1a1a] gap-4 lg:gap-0">
        {/* Thumbnails */}
        <div className="flex gap-3 lg:gap-6 overflow-x-auto">
          {designItems.map((item, index) => (
            <div
              key={item.id}
              className="flex flex-col items-center gap-2 flex-shrink-0"
            >
              <button
                onClick={() => setSelectedIndex(index)}
                className={`w-24 h-16 lg:w-32 lg:h-20 rounded overflow-hidden border-2 transition-all ${
                  selectedIndex === index
                    ? "border-[#fdb913] ring-2 ring-[#fdb913]/50"
                    : "border-neutral-700 hover:border-neutral-600"
                }`}
              >
                <Image
                  src={item.file_url || "/placeholder.svg"}
                  alt={item.file_name}
                  width={128}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </button>
              <span className="text-xs lg:text-sm text-white text-center max-w-24 lg:max-w-none">
                {item.file_name}
              </span>
            </div>
          ))}
        </div>

        {/* Action Buttons - Conditionally render based on hideApprovalButtons prop */}
        {!hideApprovalButtons && (
          <div className="flex flex-row lg:flex-col gap-3 lg:min-w-[280px] w-full lg:w-auto">
            <button className="flex-1 lg:w-full px-4 lg:px-6 py-2.5 lg:py-3.5 bg-transparent border-2 border-[#fdb913] text-[#fdb913] font-bold rounded hover:bg-[#fdb913] hover:text-black transition-all uppercase tracking-wide text-xs lg:text-sm">
              Approve Project
            </button>
            <button className="flex-1 lg:w-full px-4 lg:px-6 py-2.5 lg:py-3.5 bg-transparent border-2 border-white text-white font-bold rounded hover:bg-white hover:text-black transition-all uppercase tracking-wide text-xs lg:text-sm">
              Request Revisions
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Image Display Area with Drawing Canvas */}
        <div className="flex-1 bg-black flex items-center justify-center p-2 lg:p-4 overflow-hidden relative min-h-0">
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={selectedItem.file_url || "/placeholder.svg"}
              alt={selectedItem.file_name}
              width={800}
              height={600}
              className="h-[300px] lg:h-[600px] w-auto object-contain max-w-full"
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
                  width={800}
                  height={600}
                  className="h-[300px] lg:h-[600px] w-auto object-contain max-w-full"
                />
              </div>
            )}

            {/* Viewing Indicator Badge */}
            {viewingAnnotation && !annotationMode && (
              <div className="absolute top-2 left-2 lg:top-4 lg:left-4 px-2 lg:px-4 py-1 lg:py-2 bg-[#fdb913] text-black rounded-lg font-bold text-xs lg:text-sm shadow-xl flex items-center gap-1 lg:gap-2 animate-pulse">
                <Pencil className="w-3 h-3 lg:w-4 lg:h-4" />
                <span className="hidden sm:inline">
                  Viewing Annotation on Image
                </span>
                <span className="sm:hidden">Viewing</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Comments & Annotations */}
        <div className="w-full lg:w-96 bg-black border-t lg:border-t-0 lg:border-l border-neutral-800 flex flex-col max-h-96 lg:max-h-none">
          {/* Section Header */}
          <div className="p-3 lg:p-4 border-b border-neutral-800">
            <h3 className="text-base lg:text-lg font-bold text-white flex items-center gap-2">
              <span className="text-[#fdb913]">💬</span>
              Comments & Annotations
            </h3>
          </div>

          {/* Comments & Annotations List */}
          <div className="flex-1 overflow-y-auto p-3 lg:p-6">
            {itemComments.length > 0 ? (
              <div className="space-y-3 lg:space-y-4">
                {itemComments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`cursor-pointer transition-all ${
                      comment.type === "annotation"
                        ? `p-2 lg:p-3 rounded-lg ${
                            viewingAnnotation === comment.drawingData
                              ? "bg-[#fdb913]/30 border-2 border-[#fdb913]"
                              : "bg-[#fdb913]/10 border border-[#fdb913]/30"
                          } hover:bg-[#fdb913]/20`
                        : "hover:bg-neutral-900/50 p-2 rounded"
                    }`}
                    onClick={() => handleAnnotationClick(comment)}
                  >
                    <div className="flex gap-2 lg:gap-3">
                      <div
                        className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-white font-bold text-xs lg:text-sm flex-shrink-0 ${
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
                        <div className="flex items-baseline gap-1 lg:gap-2 mb-1 flex-wrap">
                          <span className="text-white font-semibold text-xs lg:text-sm">
                            {comment.author}
                          </span>
                          {comment.type === "annotation" && (
                            <span className="px-1.5 lg:px-2 py-0.5 bg-[#fdb913]/20 text-[#fdb913] text-xs rounded font-semibold">
                              Annotation
                            </span>
                          )}
                          <span className="text-neutral-500 text-xs">
                            •{getTimeAgo(comment.timestamp)}
                          </span>
                        </div>
                        <p className="text-neutral-300 text-xs lg:text-sm leading-relaxed">
                          {comment.content}
                        </p>
                        {comment.hasDrawing && (
                          <div className="mt-1 lg:mt-2 text-xs text-[#fdb913] flex items-center gap-1">
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
                <p className="text-neutral-500 text-xs lg:text-sm">
                  No comments yet
                </p>
              </div>
            )}
          </div>

          {/* Add Comment/Annotation Input - WeTransfer Style with Custom Icons */}
          <div className="p-3 lg:p-4 border-t border-neutral-800 space-y-2 lg:space-y-3">
            {/* Mode Indicator */}
            {isAddingAnnotation && (
              <div className="px-2 lg:px-3 py-1.5 lg:py-2 bg-[#fdb913]/20 border border-[#fdb913]/50 rounded text-[#fdb913] text-xs font-semibold flex items-center gap-2">
                <Pencil className="w-3 h-3 lg:w-4 lg:h-4" />
                <span className="hidden sm:inline">
                  Annotation Mode - Draw on image & add message
                </span>
                <span className="sm:hidden">Annotation Mode</span>
              </div>
            )}

            {/* Name Display */}
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-2.5 bg-neutral-900/50 rounded-lg border border-neutral-700">
                <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <PenTool className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                </div>
                <span className="flex-1 text-white text-xs lg:text-sm font-semibold truncate">
                  {authorName || "Your name"}
                </span>
              </div>
              <button
                onClick={handleChangeName}
                className="p-2 lg:p-2.5 bg-neutral-800 text-neutral-400 rounded hover:bg-neutral-700 hover:text-[#fdb913] transition-colors"
                title="Change Name"
              >
                <Edit2 className="w-3 h-3 lg:w-4 lg:h-4" />
              </button>
            </div>

            {/* Comment Input Box - WeTransfer Style */}
            <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-2 lg:p-3">
              {/* Annotation Controls Row - WeTransfer Style */}
              <div className="flex items-center gap-2 mb-2">
                {/* Color Swatches - Only show when annotation mode is active */}
                {isAddingAnnotation && (
                  <div className="flex items-center gap-1">
                    {colors.slice(0, 4).map((c) => (
                      <button
                        key={c}
                        onClick={() => setStrokeColor(c)}
                        className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full border transition-transform hover:scale-110 ${
                          strokeColor === c
                            ? "border-white scale-110"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: c }}
                        title={`Select ${c} color`}
                      />
                    ))}
                  </div>
                )}

                {/* Annotation Tools - Using Lucide Icons */}
                <div className="flex items-center gap-1 ml-2">
                  {/* Drawing/Pen Icon - Using Lucide PenTool */}
                  <button
                    onClick={() => {
                      setIsAddingAnnotation(!isAddingAnnotation);
                      setAnnotationMode(!isAddingAnnotation);
                    }}
                    className={`p-1 lg:p-1.5 rounded transition-colors ${
                      isAddingAnnotation
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-neutral-700 text-white hover:bg-neutral-600"
                    }`}
                    title={
                      isAddingAnnotation
                        ? "Exit annotation mode"
                        : "Add annotation"
                    }
                  >
                    <PenTool className="w-3 h-3" />
                  </button>

                  {/* Separator Line - Only show when colors are visible */}
                  {isAddingAnnotation && (
                    <div className="w-px h-3 lg:h-4 bg-neutral-600"></div>
                  )}

                  {/* Color Drop/Pin Icon - Using Lucide Droplets */}
                  <button
                    onClick={() => {
                      setIsAddingAnnotation(!isAddingAnnotation);
                      setAnnotationMode(!isAddingAnnotation);
                    }}
                    className={`p-1 lg:p-1.5 rounded transition-colors ${
                      isAddingAnnotation
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-neutral-700 text-red-500 hover:bg-neutral-600 hover:text-red-400"
                    }`}
                    title={
                      isAddingAnnotation
                        ? "Exit annotation mode"
                        : "Add annotation"
                    }
                  >
                    <Droplets className="w-3 h-3" />
                  </button>

                  {/* Trash Can Icon - Using Lucide Trash2 */}
                  {isAddingAnnotation && (
                    <button
                      onClick={handleClearDrawings}
                      className="p-1 lg:p-1.5 rounded bg-neutral-700 text-neutral-400 hover:bg-neutral-600 hover:text-red-400 transition-colors"
                      title="Clear all drawings"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Additional Controls when in annotation mode */}
                {isAddingAnnotation && (
                  <div className="flex items-center gap-1 lg:gap-2 ml-auto">
                    <div className="flex items-center gap-1">
                      <span className="text-neutral-400 text-xs hidden sm:inline">
                        Size:
                      </span>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={strokeWidth}
                        onChange={(e) =>
                          setStrokeWidth(parseInt(e.target.value))
                        }
                        className="w-8 lg:w-12 accent-[#fdb913]"
                        title="Brush size"
                      />
                      <span className="text-white text-xs w-3 lg:w-4">
                        {strokeWidth}px
                      </span>
                    </div>

                    <button
                      onClick={handleUndo}
                      className="p-1 lg:p-1.5 rounded bg-neutral-700 text-neutral-400 hover:bg-neutral-600 hover:text-white transition-colors"
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
                rows={2}
                className="w-full bg-transparent text-white text-xs lg:text-sm outline-none placeholder:text-neutral-500 resize-none"
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
                className="px-3 lg:px-4 py-1.5 lg:py-2 text-neutral-400 hover:text-white transition-colors text-xs lg:text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAnnotation}
                disabled={!newCommentText.trim() || !authorName.trim()}
                className="ml-auto px-3 lg:px-4 py-1.5 lg:py-2 bg-[#fdb913] text-black font-bold rounded hover:bg-[#e5a711] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs lg:text-sm"
              >
                {isAddingAnnotation ? "Add Annotation" : "Add"}
              </button>
            </div>

            {/* Helper Text */}
            {isAddingAnnotation && (
              <p className="text-xs text-neutral-500 text-center">
                <span className="hidden sm:inline">
                  Draw on the image using colors above, then add your message
                </span>
                <span className="sm:hidden">
                  Draw on image, then add message
                </span>
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
