-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  project_number VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  client_email VARCHAR(255),
  download_enabled BOOLEAN DEFAULT true,
  archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reviews table (individual proof sessions within a project)
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  share_link VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, revision_requested
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create design_items table (individual design files in a review)
CREATE TABLE IF NOT EXISTS design_items (
  id SERIAL PRIMARY KEY,
  review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  version INTEGER DEFAULT 1,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  design_item_id INTEGER REFERENCES design_items(id) ON DELETE CASCADE,
  author_name VARCHAR(255),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create annotations table (for marking up designs)
CREATE TABLE IF NOT EXISTS annotations (
  id SERIAL PRIMARY KEY,
  design_item_id INTEGER REFERENCES design_items(id) ON DELETE CASCADE,
  x_position DECIMAL(5,2) NOT NULL,
  y_position DECIMAL(5,2) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create approvals table
CREATE TABLE IF NOT EXISTS approvals (
  id SERIAL PRIMARY KEY,
  review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  signature_data TEXT,
  decision VARCHAR(50) NOT NULL, -- approved, revision_requested
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_archived ON projects(archived);
CREATE INDEX IF NOT EXISTS idx_reviews_project_id ON reviews(project_id);
CREATE INDEX IF NOT EXISTS idx_reviews_share_link ON reviews(share_link);
CREATE INDEX IF NOT EXISTS idx_design_items_review_id ON design_items(review_id);
CREATE INDEX IF NOT EXISTS idx_comments_design_item_id ON comments(design_item_id);
CREATE INDEX IF NOT EXISTS idx_annotations_design_item_id ON annotations(design_item_id);
