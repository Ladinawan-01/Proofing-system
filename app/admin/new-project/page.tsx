import Link from "next/link"
import Image from "next/image"
import { NewProjectForm } from "@/components/new-project-form"

export default function NewProjectPage() {
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
              <Link href="/admin/new-project" className="text-white hover:text-brand-yellow transition-colors">
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
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <NewProjectForm />
      </main>
    </div>
  )
}
