import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { getProjects } from "@/lib/db";
import { ProjectCard } from "@/components/project-card";
import { SearchBar } from "@/components/search-bar";

export default async function AdminDashboard() {
  const projects = await getProjects(false);

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
              <Link
                href="/admin/dashboard"
                className="text-white hover:text-brand-yellow transition-colors"
              >
                DASHBOARD
              </Link>
              <span className="text-neutral-600">|</span>
              <Link
                href="/admin/new-project"
                className="text-neutral-400 hover:text-brand-yellow transition-colors"
              >
                ADD NEW PROJECT
              </Link>
              <span className="text-neutral-600">|</span>
              <Link
                href="/admin/archives"
                className="text-neutral-400 hover:text-brand-yellow transition-colors"
              >
                PROJECT ARCHIVES
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Search and Add Button */}
        <div className="flex items-center justify-end gap-4 mb-8">
          <SearchBar />
          <Link
            href="/admin/new-project"
            className="flex items-center gap-2 px-6 py-3 bg-brand-yellow text-black font-semibold rounded hover:bg-brand-yellow-hover transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Project
          </Link>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral-400 text-lg mb-4">No projects yet</p>
            <Link
              href="/admin/new-project"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-yellow text-black font-semibold rounded hover:bg-brand-yellow-hover transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Your First Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project: any) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
