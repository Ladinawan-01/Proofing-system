import { notFound } from "next/navigation"
import Image from "next/image"
import { getReviewByShareLink, getDesignItemsByReviewId } from "@/lib/db"
import { DesignViewer } from "@/components/design-viewer"

export default async function ClientReviewPage({
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
            <Image
              src="/images/nsb-logo.png"
              alt="Newstate Branding Co."
              width={180}
              height={50}
              className="h-12 w-auto"
            />
            <h1 className="text-xl font-bold text-white tracking-wide">
              {review.project_number} - {review.project_name?.toUpperCase()}
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
          <DesignViewer 
            designItems={designItems} 
            reviewId={review.id} 
            projectName={`${review.project_number} - ${review.project_name?.toUpperCase()}`} 
          />
        )}
      </main>
    </div>
  )
}
