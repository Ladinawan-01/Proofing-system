// Mock data with status information
const mockProjects = [
  {
    id: 1,
    project_number: "NSB-2024-001",
    name: "Brand Identity Package",
    description: "Complete brand identity redesign including logo, business cards, and letterhead",
    client_email: "john.doe@techcorp.com",
    archived: false,
    download_enabled: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date("2024-01-15"),
  },
  {
    id: 2,
    project_number: "NSB-2024-002",
    name: "Website Redesign",
    description: "Modern website with new branding and responsive design",
    client_email: "sarah@digitalventures.com",
    archived: false,
    download_enabled: false,
    created_at: new Date("2024-02-01"),
    updated_at: new Date("2024-02-01"),
  },
  {
    id: 3,
    project_number: "NSB-2024-003",
    name: "Marketing Campaign Materials",
    description: "Social media assets, banner ads, and print collateral for Q1 2024 campaign",
    client_email: "marketing@greenleaf.com",
    archived: false,
    download_enabled: true,
    created_at: new Date("2024-03-10"),
    updated_at: new Date("2024-03-10"),
  },
  {
    id: 4,
    project_number: "NSB-2024-004",
    name: "Product Packaging Design",
    description: "Premium packaging design for new product line launch",
    client_email: "james@luxurygoods.com",
    archived: false,
    download_enabled: true,
    created_at: new Date("2024-03-22"),
    updated_at: new Date("2024-03-22"),
  },
  {
    id: 5,
    project_number: "NSB-2024-005",
    name: "Corporate Presentation Deck",
    description: "Investor pitch deck with company overview and financial projections",
    client_email: "ceo@startuphub.io",
    archived: false,
    download_enabled: false,
    created_at: new Date("2024-04-05"),
    updated_at: new Date("2024-04-05"),
  },
  {
    id: 6,
    project_number: "NSB-2024-006",
    name: "Restaurant Menu & Signage",
    description: "Complete menu redesign and interior signage for upscale restaurant",
    client_email: "owner@thegourmetbistro.com",
    archived: false,
    download_enabled: true,
    created_at: new Date("2024-04-18"),
    updated_at: new Date("2024-04-18"),
  },
  {
    id: 7,
    project_number: "NSB-2024-007",
    name: "Mobile App UI/UX Design",
    description: "Complete UI/UX design for fitness tracking mobile application",
    client_email: "product@fittrack.app",
    archived: false,
    download_enabled: false,
    created_at: new Date("2024-05-02"),
    updated_at: new Date("2024-05-02"),
  },
  {
    id: 8,
    project_number: "NSB-2024-008",
    name: "Event Branding Package",
    description: "Conference branding including banners, badges, and promotional materials",
    client_email: "events@techsummit.com",
    archived: false,
    download_enabled: true,
    created_at: new Date("2024-05-20"),
    updated_at: new Date("2024-05-20"),
  },
  {
    id: 9,
    project_number: "NSB-2023-045",
    name: "Annual Report Design",
    description: "2023 annual report with infographics and data visualization",
    client_email: "communications@globalcorp.com",
    archived: true,
    download_enabled: true,
    created_at: new Date("2023-11-10"),
    updated_at: new Date("2023-12-15"),
  },
  {
    id: 10,
    project_number: "NSB-2023-050",
    name: "Rebranding Initiative",
    description: "Complete company rebrand including new name, logo, and brand guidelines",
    client_email: "cmo@innovatetech.com",
    archived: true,
    download_enabled: true,
    created_at: new Date("2023-12-01"),
    updated_at: new Date("2024-01-05"),
  },
]

const mockReviews = [
  {
    id: 1,
    project_id: 1,
    share_link: "abc123xyz",
    status: "pending",
    created_at: new Date("2024-01-16"),
    updated_at: new Date("2024-01-16"),
  },
  {
    id: 2,
    project_id: 1,
    share_link: "def456uvw",
    status: "approved",
    created_at: new Date("2024-01-20"),
    updated_at: new Date("2024-01-21"),
  },
  {
    id: 3,
    project_id: 2,
    share_link: "ghi789rst",
    status: "revision_requested",
    created_at: new Date("2024-02-02"),
    updated_at: new Date("2024-02-03"),
  },
  {
    id: 4,
    project_id: 3,
    share_link: "mkt2024q1a",
    status: "approved",
    created_at: new Date("2024-03-11"),
    updated_at: new Date("2024-03-14"),
  },
  {
    id: 5,
    project_id: 4,
    share_link: "pkg001rev1",
    status: "pending",
    created_at: new Date("2024-03-23"),
    updated_at: new Date("2024-03-23"),
  },
  {
    id: 6,
    project_id: 4,
    share_link: "pkg001rev2",
    status: "revision_requested",
    created_at: new Date("2024-03-27"),
    updated_at: new Date("2024-03-28"),
  },
  {
    id: 7,
    project_id: 5,
    share_link: "pitch2024v1",
    status: "pending",
    created_at: new Date("2024-04-06"),
    updated_at: new Date("2024-04-06"),
  },
  {
    id: 8,
    project_id: 6,
    share_link: "menu001final",
    status: "approved",
    created_at: new Date("2024-04-19"),
    updated_at: new Date("2024-04-22"),
  },
  {
    id: 9,
    project_id: 7,
    share_link: "app ui v1",
    status: "revision_requested",
    created_at: new Date("2024-05-03"),
    updated_at: new Date("2024-05-05"),
  },
  {
    id: 10,
    project_id: 8,
    share_link: "event2024conf",
    status: "pending",
    created_at: new Date("2024-05-21"),
    updated_at: new Date("2024-05-21"),
  },
]

const mockDesignItems = [
  {
    id: 1,
    review_id: 1,
    file_url: "/tent-design-mockup.jpg",
    file_name: "logo-concept-1.jpg",
    version: 1,
    order_index: 0,
    created_at: new Date("2024-01-16"),
  },
  {
    id: 2,
    review_id: 1,
    file_url: "/placeholder.jpg",
    file_name: "logo-concept-2.jpg",
    version: 1,
    order_index: 1,
    created_at: new Date("2024-01-16"),
  },
  {
    id: 3,
    review_id: 1,
    file_url: "/tent-design-mockup.jpg",
    file_name: "business-card-design.jpg",
    version: 1,
    order_index: 2,
    created_at: new Date("2024-01-16"),
  },
  {
    id: 4,
    review_id: 2,
    file_url: "/tent-design-mockup.jpg",
    file_name: "brand-guideline.pdf",
    version: 2,
    order_index: 0,
    created_at: new Date("2024-01-20"),
  },
  {
    id: 5,
    review_id: 2,
    file_url: "/placeholder.jpg",
    file_name: "logo-final.jpg",
    version: 2,
    order_index: 1,
    created_at: new Date("2024-01-20"),
  },
  {
    id: 6,
    review_id: 3,
    file_url: "/tent-design-mockup.jpg",
    file_name: "homepage-mockup.jpg",
    version: 1,
    order_index: 0,
    created_at: new Date("2024-02-02"),
  },
  {
    id: 7,
    review_id: 3,
    file_url: "/placeholder.jpg",
    file_name: "about-page-mockup.jpg",
    version: 1,
    order_index: 1,
    created_at: new Date("2024-02-02"),
  },
  {
    id: 8,
    review_id: 3,
    file_url: "/tent-design-mockup.jpg",
    file_name: "contact-page-mockup.jpg",
    version: 1,
    order_index: 2,
    created_at: new Date("2024-02-02"),
  },
  {
    id: 9,
    review_id: 4,
    file_url: "/placeholder.jpg",
    file_name: "social-media-banner-1.jpg",
    version: 1,
    order_index: 0,
    created_at: new Date("2024-03-11"),
  },
  {
    id: 10,
    review_id: 4,
    file_url: "/tent-design-mockup.jpg",
    file_name: "facebook-ad-design.jpg",
    version: 1,
    order_index: 1,
    created_at: new Date("2024-03-11"),
  },
  {
    id: 11,
    review_id: 4,
    file_url: "/placeholder.jpg",
    file_name: "instagram-stories.jpg",
    version: 1,
    order_index: 2,
    created_at: new Date("2024-03-11"),
  },
  {
    id: 12,
    review_id: 5,
    file_url: "/tent-design-mockup.jpg",
    file_name: "packaging-front.jpg",
    version: 1,
    order_index: 0,
    created_at: new Date("2024-03-23"),
  },
  {
    id: 13,
    review_id: 5,
    file_url: "/placeholder.jpg",
    file_name: "packaging-back.jpg",
    version: 1,
    order_index: 1,
    created_at: new Date("2024-03-23"),
  },
  {
    id: 14,
    review_id: 6,
    file_url: "/tent-design-mockup.jpg",
    file_name: "packaging-revised-front.jpg",
    version: 2,
    order_index: 0,
    created_at: new Date("2024-03-27"),
  },
  {
    id: 15,
    review_id: 6,
    file_url: "/placeholder.jpg",
    file_name: "packaging-revised-back.jpg",
    version: 2,
    order_index: 1,
    created_at: new Date("2024-03-27"),
  },
  {
    id: 16,
    review_id: 7,
    file_url: "/tent-design-mockup.jpg",
    file_name: "pitch-deck-slide-1.jpg",
    version: 1,
    order_index: 0,
    created_at: new Date("2024-04-06"),
  },
  {
    id: 17,
    review_id: 7,
    file_url: "/placeholder.jpg",
    file_name: "pitch-deck-slide-2.jpg",
    version: 1,
    order_index: 1,
    created_at: new Date("2024-04-06"),
  },
  {
    id: 18,
    review_id: 8,
    file_url: "/placeholder.jpg",
    file_name: "menu-design-final.jpg",
    version: 1,
    order_index: 0,
    created_at: new Date("2024-04-19"),
  },
  {
    id: 19,
    review_id: 8,
    file_url: "/tent-design-mockup.jpg",
    file_name: "signage-entrance.jpg",
    version: 1,
    order_index: 1,
    created_at: new Date("2024-04-19"),
  },
  {
    id: 20,
    review_id: 9,
    file_url: "/placeholder.jpg",
    file_name: "app-home-screen.jpg",
    version: 1,
    order_index: 0,
    created_at: new Date("2024-05-03"),
  },
  {
    id: 21,
    review_id: 9,
    file_url: "/tent-design-mockup.jpg",
    file_name: "app-workout-screen.jpg",
    version: 1,
    order_index: 1,
    created_at: new Date("2024-05-03"),
  },
  {
    id: 22,
    review_id: 10,
    file_url: "/tent-design-mockup.jpg",
    file_name: "conference-banner.jpg",
    version: 1,
    order_index: 0,
    created_at: new Date("2024-05-21"),
  },
  {
    id: 23,
    review_id: 10,
    file_url: "/placeholder.jpg",
    file_name: "badge-design.jpg",
    version: 1,
    order_index: 1,
    created_at: new Date("2024-05-21"),
  },
]

const mockApprovals: any[] = [
  {
    id: 1,
    review_id: 2,
    first_name: "John",
    last_name: "Doe",
    decision: "approved",
    notes: "Looks great! The final logo perfectly captures our brand identity.",
    created_at: new Date("2024-01-21"),
  },
  {
    id: 2,
    review_id: 3,
    first_name: "Sarah",
    last_name: "Johnson",
    decision: "revision_requested",
    notes: "Please adjust the header navigation. The mobile menu needs better contrast.",
    created_at: new Date("2024-02-03"),
  },
  {
    id: 3,
    review_id: 4,
    first_name: "Michael",
    last_name: "Chen",
    decision: "approved",
    notes: "All marketing materials are approved. Excellent work on the social media assets!",
    created_at: new Date("2024-03-14"),
  },
  {
    id: 4,
    review_id: 6,
    first_name: "James",
    last_name: "Wilson",
    decision: "revision_requested",
    notes: "Can we try a matte finish instead of glossy? Also, the color seems slightly off.",
    created_at: new Date("2024-03-28"),
  },
  {
    id: 5,
    review_id: 8,
    first_name: "Robert",
    last_name: "Brown",
    decision: "approved",
    notes: "Perfect! The menu design is exactly what we envisioned.",
    created_at: new Date("2024-04-22"),
  },
  {
    id: 6,
    review_id: 9,
    first_name: "Lisa",
    last_name: "Anderson",
    decision: "revision_requested",
    notes: "The workout screen needs more spacing between elements. Otherwise looking good!",
    created_at: new Date("2024-05-05"),
  },
]

// Activity Log
interface ActivityLog {
  id: number
  project_id: number
  user_name: string
  action: string
  details: string
  created_at: Date
}

const mockActivityLogs: ActivityLog[] = [
  {
    id: 1,
    project_id: 1,
    user_name: "Admin",
    action: "PROJECT_CREATED",
    details: "Created project NSB-2024-001",
    created_at: new Date("2024-01-15T10:30:00"),
  },
  {
    id: 2,
    project_id: 1,
    user_name: "Admin",
    action: "REVIEW_CREATED",
    details: "Created review abc123xyz",
    created_at: new Date("2024-01-16T09:15:00"),
  },
  {
    id: 3,
    project_id: 1,
    user_name: "John Doe",
    action: "ANNOTATION_ADDED",
    details: "Added annotation on logo-concept-1.jpg",
    created_at: new Date("2024-01-17T14:22:00"),
  },
  {
    id: 4,
    project_id: 1,
    user_name: "Admin",
    action: "ANNOTATION_REPLIED",
    details: "Replied to annotation #1",
    created_at: new Date("2024-01-17T15:45:00"),
  },
  {
    id: 5,
    project_id: 1,
    user_name: "Admin",
    action: "REVIEW_CREATED",
    details: "Created review def456uvw (V2)",
    created_at: new Date("2024-01-20T11:00:00"),
  },
  {
    id: 6,
    project_id: 1,
    user_name: "John Doe",
    action: "REVIEW_APPROVED",
    details: "Approved review def456uvw",
    created_at: new Date("2024-01-21T16:30:00"),
  },
  {
    id: 7,
    project_id: 2,
    user_name: "Admin",
    action: "PROJECT_CREATED",
    details: "Created project NSB-2024-002",
    created_at: new Date("2024-02-01T09:00:00"),
  },
  {
    id: 8,
    project_id: 3,
    user_name: "Admin",
    action: "PROJECT_CREATED",
    details: "Created project NSB-2024-003",
    created_at: new Date("2024-03-10T10:15:00"),
  },
  {
    id: 9,
    project_id: 3,
    user_name: "Michael Chen",
    action: "REVIEW_APPROVED",
    details: "Approved review mkt2024q1a",
    created_at: new Date("2024-03-14T14:00:00"),
  },
  {
    id: 10,
    project_id: 4,
    user_name: "James Wilson",
    action: "REVISION_REQUESTED",
    details: "Requested revisions on review pkg001rev1",
    created_at: new Date("2024-03-25T11:30:00"),
  },
]

// Mock database query helpers
export async function getProjects(archived = false) {
  return mockProjects.filter((p) => p.archived === archived)
}

export async function getProjectById(id: number) {
  return mockProjects.find((p) => p.id === id)
}

export async function createProject(data: {
  projectNumber: string
  name: string
  description?: string
  clientEmail?: string
}) {
  const newProject = {
    id: mockProjects.length + 1,
    project_number: data.projectNumber,
    name: data.name,
    description: data.description || "",
    client_email: data.clientEmail || "",
    archived: false,
    download_enabled: false,
    created_at: new Date(),
    updated_at: new Date(),
  }
  mockProjects.push(newProject)
  return newProject
}

export async function getReviewsByProjectId(projectId: number) {
  return mockReviews.filter((r) => r.project_id === projectId)
}

export async function getReviewByShareLink(shareLink: string) {
  const review = mockReviews.find((r) => r.share_link === shareLink)
  if (!review) return undefined
  
  const project = mockProjects.find((p) => p.id === review.project_id)
  return {
    ...review,
    project_name: project?.name,
    project_number: project?.project_number,
    download_enabled: project?.download_enabled,
  }
}

export async function getDesignItemsByReviewId(reviewId: number) {
  return mockDesignItems.filter((d) => d.review_id === reviewId)
}

export async function createReview(projectId: number, shareLink: string) {
  const newReview = {
    id: mockReviews.length + 1,
    project_id: projectId,
    share_link: shareLink,
    status: "pending",
    created_at: new Date(),
    updated_at: new Date(),
  }
  mockReviews.push(newReview)
  return newReview
}

export async function createDesignItem(data: {
  reviewId: number
  fileUrl: string
  fileName: string
  version?: number
  orderIndex?: number
}) {
  const newItem = {
    id: mockDesignItems.length + 1,
    review_id: data.reviewId,
    file_url: data.fileUrl,
    file_name: data.fileName,
    version: data.version || 1,
    order_index: data.orderIndex || 0,
    created_at: new Date(),
  }
  mockDesignItems.push(newItem)
  return newItem
}

export async function createApproval(data: {
  reviewId: number
  firstName: string
  lastName: string
  decision: string
  notes?: string
}) {
  const newApproval = {
    id: mockApprovals.length + 1,
    review_id: data.reviewId,
    first_name: data.firstName,
    last_name: data.lastName,
    decision: data.decision,
    notes: data.notes || "",
    created_at: new Date(),
  }
  mockApprovals.push(newApproval)

  // Update review status
  const review = mockReviews.find((r) => r.id === data.reviewId)
  if (review) {
    review.status = data.decision === "approved" ? "approved" : "revision_requested"
    review.updated_at = new Date()
  }

  return newApproval
}

export async function searchProjects(query: string) {
  const lowerQuery = query.toLowerCase()
  return mockProjects.filter(
    (p) =>
      !p.archived &&
      (p.name.toLowerCase().includes(lowerQuery) ||
        p.project_number.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery))
  )
}

export async function getActivityLogs(projectId?: number) {
  if (projectId) {
    return mockActivityLogs.filter((log) => log.project_id === projectId)
  }
  return mockActivityLogs.sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
}

export async function createActivityLog(data: {
  projectId: number
  userName: string
  action: string
  details: string
}) {
  const newLog = {
    id: mockActivityLogs.length + 1,
    project_id: data.projectId,
    user_name: data.userName,
    action: data.action,
    details: data.details,
    created_at: new Date(),
  }
  mockActivityLogs.push(newLog)
  return newLog
}

export async function updateProject(id: number, data: Partial<typeof mockProjects[0]>) {
  const projectIndex = mockProjects.findIndex((p) => p.id === id)
  if (projectIndex !== -1) {
    mockProjects[projectIndex] = { ...mockProjects[projectIndex], ...data, updated_at: new Date() }
    return mockProjects[projectIndex]
  }
  return undefined
}

export async function getApprovalsByReviewId(reviewId: number) {
  return mockApprovals.filter((a) => a.review_id === reviewId)
}
