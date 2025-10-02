import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Clock, FileText, CheckCircle, XCircle, AlertCircle, Plus, Eye, Download, Archive, MessageCircle } from "lucide-react"
import { getProjectById, getReviewsByProjectId, getDesignItemsByReviewId, getActivityLogs } from "@/lib/db"
import { NewReviewButton } from "@/components/new-review-button"
import { ReviewsList } from "@/components/reviews-list"
import { CopyLinkButton } from "@/components/copy-link-button"

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const projectId = parseInt(params.id)
  const project = await getProjectById(projectId)

  if (!project) {
    notFound()
  }

  const reviews = await getReviewsByProjectId(projectId)
  const activityLogs = await getActivityLogs(projectId)

  // Get design items count for each review
  const reviewsWithCounts = await Promise.all(
    reviews.map(async (review) => {
      const designItems = await getDesignItemsByReviewId(review.id)
      return {
        ...review,
        designItemsCount: designItems.length,
      }
    })
  )

  // Status counts
  const statusCounts = {
    pending: reviews.filter((r) => r.status === "pending").length,
    approved: reviews.filter((r) => r.status === "approved").length,
    revision_requested: reviews.filter((r) => r.status === "revision_requested").length,
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-black">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin/dashboard">
              <Image
                src="/images/nsb-logo.png"
                alt="Newstate Branding Co."
                width={200}
                height={60}
                className="h-12 w-auto"
              />
            </Link>

            <nav className="flex items-center gap-6 text-sm">
              <Link href="/admin/dashboard" className="text-neutral-400 hover:text-brand-yellow transition-colors">
                DASHBOARD
              </Link>
              <span className="text-neutral-600">|</span>
              <Link href="/admin/new-project" className="text-neutral-400 hover:text-brand-yellow transition-colors">
                ADD NEW PROJECT
              </Link>
              <span className="text-neutral-600">|</span>
              <Link href="/admin/archives" className="text-neutral-400 hover:text-brand-yellow transition-colors">
                PROJECT ARCHIVES
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Project Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-neutral-500 mt-2">✏️</span>
                <h1 className="text-4xl font-bold text-white uppercase tracking-wide">
                  {project.name}
              </h1>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-neutral-500 mt-1">✏️</span>
                <p className="text-base text-neutral-400">
                  {project.description || "Add project description or message to clients."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {reviews.length > 0 && (
                <CopyLinkButton shareLink={reviews[0].share_link} showUrl />
              )}
              <NewReviewButton projectId={projectId} />
            </div>
          </div>

        </div>

        {/* Reviews Section */}
        {reviews.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-neutral-400 text-lg mb-2">No current reviews.</p>
            <p className="text-neutral-500 text-sm mb-6">Create new client review to get things going!</p>
            <NewReviewButton projectId={projectId} variant="large" />
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-white">Reviews & Versions</h2>
            <div className="space-y-4">
              {reviewsWithCounts.map((review, index) => (
                <div
                  key={review.id}
                  className="bg-neutral-900 rounded-lg p-6 border border-neutral-800 hover:border-brand-yellow transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-lg font-bold text-white">
                          V{reviewsWithCounts.length - index}
                        </span>
                        <span className="text-sm text-neutral-400">
                          {review.created_at.toLocaleDateString()}
                        </span>
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            review.status === "approved"
                              ? "bg-green-600/20 text-green-400"
                              : review.status === "pending"
                              ? "bg-yellow-600/20 text-yellow-400"
                              : "bg-red-600/20 text-red-400"
                          }`}
                        >
                          {review.status === "approved"
                            ? "✓ Approved"
                            : review.status === "pending"
                            ? "⏳ Pending"
                            : "✎ Needs Revision"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-neutral-400">
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          <span>{review.designItemsCount} files</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-600">Share Link:</span>
                          <code className="px-2 py-0.5 bg-neutral-800 rounded text-brand-yellow">
                            {review.share_link}
                          </code>
                          <CopyLinkButton shareLink={review.share_link} variant="small" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/review/${review.share_link}`}
                        className="px-5 py-2 bg-brand-yellow text-black font-bold rounded hover:bg-brand-yellow-hover transition-colors flex items-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Reply to Feedback
                      </Link>
                    
                      <button className="px-5 py-2 bg-neutral-800 text-white rounded hover:bg-neutral-700 transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          )}
      </main>
    </div>
  )
}
