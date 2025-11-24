/*
  # Create CFO AI Tutor Conversations Schema

  1. New Tables
    - `sessions`
      - `id` (uuid, primary key) - Unique session identifier
      - `created_at` (timestamptz) - When the session was started
      - `ended_at` (timestamptz, nullable) - When the session ended
      - `session_duration` (integer, nullable) - Duration in seconds
    
    - `messages`
      - `id` (uuid, primary key) - Unique message identifier
      - `session_id` (uuid, foreign key) - References sessions table
      - `role` (text) - Either 'user' or 'assistant'
      - `content` (text) - The message content
      - `created_at` (timestamptz) - When the message was created
      - `audio_duration` (integer, nullable) - Duration of audio in seconds

  2. Security
    - Enable RLS on all tables
    - Public access for reading sessions and messages (for demo purposes)
    - Anyone can create sessions and messages (for demo purposes)
    
  3. Indexes
    - Index on session_id for faster message queries
    - Index on created_at for chronological ordering
*/

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now() NOT NULL,
  ended_at timestamptz,
  session_duration integer
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  audio_duration integer
);

-- Enable Row Level Security
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for sessions (public access for demo)
CREATE POLICY "Anyone can view sessions"
  ON sessions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create sessions"
  ON sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update sessions"
  ON sessions FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create policies for messages (public access for demo)
CREATE POLICY "Anyone can view messages"
  ON messages FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create messages"
  ON messages FOR INSERT
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS messages_session_id_idx ON messages(session_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages(created_at);
CREATE INDEX IF NOT EXISTS sessions_created_at_idx ON sessions(created_at);