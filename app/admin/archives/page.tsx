import Link from "next/link"
import Image from "next/image"
import { Archive, ArrowLeft } from "lucide-react"
import { getProjects } from "@/lib/db"
import { ProjectCard } from "@/components/project-card"

export default async function ArchivesPage() {
  const archivedProjects = await getProjects(true)

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
              <Link href="/admin/archives" className="text-white hover:text-brand-yellow transition-colors">
                PROJECT ARCHIVES
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/dashboard"
            className="p-2 bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors border border-neutral-800"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Archive className="w-8 h-8 text-brand-yellow" />
              Project Archives
            </h1>
            <p className="text-neutral-400 mt-1">
              Completed and archived projects ({archivedProjects.length})
            </p>
          </div>
        </div>

        {/* Archived Projects Grid */}
        {archivedProjects.length === 0 ? (
          <div className="text-center py-20 bg-neutral-900 rounded-lg border border-neutral-800">
            <Archive className="w-20 h-20 text-neutral-700 mx-auto mb-4" />
            <p className="text-neutral-400 text-lg mb-2">No archived projects</p>
            <p className="text-neutral-500 text-sm">
              Projects you archive will appear here for future reference
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {archivedProjects.map((project: any) => (
              <div key={project.id} className="relative">
                <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-neutral-800/90 backdrop-blur-sm text-neutral-400 text-xs font-semibold rounded-full border border-neutral-700">
                  Archived
                </div>
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

