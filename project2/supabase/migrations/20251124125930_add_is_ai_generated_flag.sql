/*
  # Add AI Generated Flag to Blog Posts

  ## Changes
  1. Add `is_ai_generated` boolean column to distinguish between:
     - AI-generated articles (Knowledge Library content)
     - Human-written blog posts (Latest from the Blog)
  
  ## Notes
  - Defaults to false (human-written)
  - Allows filtering posts by type for different sections
*/

-- Add is_ai_generated column
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS is_ai_generated BOOLEAN DEFAULT false;

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_ai_generated 
ON blog_posts(is_ai_generated);
