/*
  # Add Content and Author Fields to Blog Posts

  ## Changes
  1. Add `content` column to store full article content (markdown format)
  2. Add `author` column to store article author name
  3. Add new `read_minutes` column as integer
  4. Keep old `read_time` column for now for backwards compatibility
  
  ## Notes
  - Content field allows storing long-form blog articles
  - Author field defaults to 'Cheap CFO' for consistency
  - Read minutes is stored as integer for easier sorting/filtering
*/

-- Add content column for full article text
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS content TEXT;

-- Add author column
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS author TEXT DEFAULT 'Cheap CFO';

-- Add read_minutes as integer column
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS read_minutes INTEGER DEFAULT 5;
