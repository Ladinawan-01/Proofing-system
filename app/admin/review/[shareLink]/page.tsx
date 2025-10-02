import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { getReviewByShareLink, getDesignItemsByReviewId } from "@/lib/db"
import { AdminDesignViewer } from "@/components/admin-design-viewer"

export default async function AdminReviewPage({
  params,
}: {
  params: { shareLink: string }
}) {
  const review = await getReviewByShareLink(params.shareLink)

  if (!review) {
    notFound()
  }

  const designItems = await getDesignItemsByReviewId(review.id)

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-neutral-800">
        <div className="px-8 py-4">
          <div className="flex items-center gap-8">
            <Link
              href={`/admin/project/${review.project_id || 1}`}
              className="p-2 bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors border border-neutral-800"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-400" />
            </Link>
            <Image
              src="/images/nsb-logo.png"
              alt="Newstate Branding Co."
              width={180}
              height={50}
              className="h-12 w-auto"
            />
            <h1 className="text-xl font-bold text-white tracking-wide">
              Admin Review: {review.project_number} - {review.project_name?.toUpperCase()}
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content - Full Height */}
      <main className="flex-1 overflow-hidden">
        {designItems.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center py-20">
              <p className="text-neutral-400 text-lg">No design items uploaded yet</p>
            </div>
          </div>
        ) : (
          <AdminDesignViewer 
            designItems={designItems} 
            reviewId={review.id} 
            projectId={review.project_id || 1}
            projectName={`${review.project_number} - ${review.project_name?.toUpperCase()}`}
          />
        )}
      </main>
    </div>
  )
}

