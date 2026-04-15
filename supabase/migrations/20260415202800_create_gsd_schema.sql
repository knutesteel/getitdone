/*
  # Get Shit Done - Initial Schema

  ## Summary
  Creates the core database tables for the GSD app:

  ## New Tables

  ### profiles
  - Stores user profile information linked to auth.users
  - Fields: id (auth uid), email, subscription tier, created_at, last_seen

  ### tasks
  - Core task table for the task matrix
  - Fields: id, user_id, text, category, due_date, notes, completed, completed_at, created_at
  - Category values: now, someday, forSomeReason, whyOnList, squirrel, rewards, reflection

  ### brain_dump_items
  - Temporary capture area before categorizing into matrix
  - Fields: id, user_id, text, created_at

  ### reviews
  - Book reviews with voting
  - Fields: id, user_id, title, rating, content, author_name, upvotes, downvotes, created_at

  ### review_votes
  - Tracks which users voted on which reviews
  - Fields: id, user_id, review_id, vote_type

  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
  - Reviews are publicly readable but only editable by author
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  subscription text NOT NULL DEFAULT 'free',
  subscription_granted_by text,
  created_at timestamptz DEFAULT now(),
  last_seen timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'now',
  due_date date,
  notes text DEFAULT '',
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON tasks(user_id);
CREATE INDEX IF NOT EXISTS tasks_completed_idx ON tasks(completed);
CREATE INDEX IF NOT EXISTS tasks_category_idx ON tasks(category);

CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS brain_dump_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE brain_dump_items ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS brain_dump_user_id_idx ON brain_dump_items(user_id);

CREATE POLICY "Users can view own brain dump items"
  ON brain_dump_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own brain dump items"
  ON brain_dump_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own brain dump items"
  ON brain_dump_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own brain dump items"
  ON brain_dump_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  title text NOT NULL DEFAULT '',
  rating integer NOT NULL DEFAULT 5,
  content text NOT NULL DEFAULT '',
  author_name text NOT NULL DEFAULT 'Anonymous',
  upvotes integer NOT NULL DEFAULT 0,
  downvotes integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS review_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  review_id uuid NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  vote_type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, review_id)
);

ALTER TABLE review_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own votes"
  ON review_votes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own votes"
  ON review_votes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own votes"
  ON review_votes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own votes"
  ON review_votes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS user_scores (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_score integer NOT NULL DEFAULT 0,
  streak integer NOT NULL DEFAULT 0,
  last_completed_date date,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scores"
  ON user_scores FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own scores"
  ON user_scores FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own scores"
  ON user_scores FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
