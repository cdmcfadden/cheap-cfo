/*
  # Create Blog Posts Table

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key) - Unique post identifier
      - `title` (text) - Post title
      - `slug` (text, unique) - URL-friendly identifier
      - `excerpt` (text) - Short description
      - `url` (text) - Link to the blog post
      - `published_at` (timestamptz) - Publication date
      - `category` (text) - Post category
      - `read_time` (text) - Estimated reading time
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on `blog_posts` table
    - Public read access for all posts
    - No write access (posts managed by admin only)

  3. Indexes
    - Index on published_at for sorting by date
    - Index on slug for URL lookups
*/

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL,
  url text NOT NULL,
  published_at timestamptz DEFAULT now() NOT NULL,
  category text DEFAULT 'Finance' NOT NULL,
  read_time text DEFAULT '5 min' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can view blog posts"
  ON blog_posts FOR SELECT
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS blog_posts_published_at_idx ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts(slug);

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, url, published_at, category, read_time) VALUES
  (
    'Understanding EBITDA: A CFO''s Guide',
    'understanding-ebitda-cfo-guide',
    'Learn what EBITDA means, why it matters, and how to use it effectively in financial analysis and decision-making.',
    '#',
    now() - interval '2 days',
    'Financial Metrics',
    '8 min'
  ),
  (
    'Cash Flow Forecasting Best Practices',
    'cash-flow-forecasting-best-practices',
    'Master the art of predicting your company''s cash position with proven forecasting techniques and real-world examples.',
    '#',
    now() - interval '5 days',
    'Cash Flow Management',
    '10 min'
  ),
  (
    'The Ultimate Guide to Financial Ratios',
    'ultimate-guide-financial-ratios',
    'Discover the essential financial ratios every business leader should monitor to drive better decision-making.',
    '#',
    now() - interval '1 week',
    'Financial Analysis',
    '12 min'
  ),
  (
    'Working Capital Optimization Strategies',
    'working-capital-optimization',
    'Improve your company''s liquidity and efficiency with these proven working capital management techniques.',
    '#',
    now() - interval '2 weeks',
    'Cash Flow Management',
    '9 min'
  ),
  (
    'Building a Rolling Forecast Model',
    'building-rolling-forecast-model',
    'Move beyond static budgets with continuous rolling forecasts that adapt to changing business conditions.',
    '#',
    now() - interval '3 weeks',
    'FP&A',
    '11 min'
  );
