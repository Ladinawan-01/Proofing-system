import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Upload, Settings } from "lucide-react"
import { getProjectById, getReviewsByProjectId, getDesignItemsByReviewId } from "@/lib/db"
import { CopyLinkButton } from "@/components/copy-link-button"

export default async function EditProjectPage({
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
  const allDesignItems = []
  
  for (const review of reviews) {
    const items = await getDesignItemsByReviewId(review.id)
    allDesignItems.push(...items)
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Header */}
      <header className="bg-[#111111] border-b border-neutral-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin/dashboard">
              <Image
                src="/images/nsb-logo.png"
                alt="Newstate Branding Co."
                width={180}
                height={50}
                className="h-10 w-auto"
              />
            </Link>

            <nav className="flex items-center gap-6 text-sm">
              <Link href="/admin/dashboard" className="text-white hover:text-brand-yellow transition-colors">
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
        {/* Project Name Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-neutral-500 mt-2">✏️</span>
                <input
                  type="text"
                  defaultValue={project.name.toUpperCase()}
                  placeholder="NAME PROJECT"
                  className="text-4xl font-bold text-white bg-transparent border-none outline-none w-full placeholder:text-neutral-700 uppercase tracking-wide"
                />
              </div>
              <div className="flex items-start gap-3">
                <span className="text-neutral-500 mt-1">✏️</span>
                <input
                  type="text"
                  defaultValue={project.description}
                  placeholder="Add project description or message to clients."
                  className="text-base text-neutral-400 bg-transparent border-none outline-none w-full placeholder:text-neutral-700"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white rounded hover:bg-neutral-700 transition-colors text-sm">
                📥 Download
              </button>
              {reviews.length > 0 && (
                <CopyLinkButton shareLink={reviews[0].share_link} showUrl />
              )}
              <Link href={`/admin/new-project`} className="flex items-center gap-2 px-6 py-2.5 bg-transparent border-2 border-[#fdb913] text-[#fdb913] font-bold rounded hover:bg-[#fdb913] hover:text-black transition-all uppercase tracking-wide text-sm">
                <Settings className="w-4 h-4" />
                Edit Project
              </Link>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-[#1a1d26] rounded-lg border-2 border-dashed border-neutral-700 p-12 mb-8">
          <div className="text-center">
            <p className="text-neutral-400 mb-4">
              <span className="font-semibold">Drag & drop</span> some files from your computer or hit the button below
            </p>
            <button className="inline-flex items-center gap-2 px-8 py-3 bg-[#fdb913] text-black font-bold rounded hover:bg-[#e5a711] transition-all uppercase tracking-wide">
              <Upload className="w-5 h-5" />
              Upload
            </button>
          </div>
        </div>

        {/* Design Items Grid */}
        {allDesignItems.length > 0 && (
          <div className="grid grid-cols-4 gap-6">
            {allDesignItems.map((item) => (
              <div
                key={item.id}
                className="aspect-square bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 hover:border-brand-yellow transition-all group relative"
              >
                <Image
                  src={item.file_url || "/placeholder.svg"}
                  alt={item.file_name}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <p className="text-white text-sm font-semibold truncate">
                    {item.file_name}
                  </p>
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Link href={`/admin/review/abc123xyz`} className="px-4 py-2 bg-[#fdb913] text-black rounded font-semibold">
                    View Client Feedback
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

