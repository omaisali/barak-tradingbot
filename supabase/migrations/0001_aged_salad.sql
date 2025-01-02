/*
  # User API Keys Schema

  1. New Tables
    - `user_api_keys`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `public_key` (text)
      - `private_key` (text, encrypted)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `is_valid` (boolean)

  2. Security
    - Enable RLS on `user_api_keys` table
    - Add policies for authenticated users to manage their own API keys
*/

CREATE TABLE IF NOT EXISTS user_api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  public_key text NOT NULL,
  private_key text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_valid boolean DEFAULT false,
  UNIQUE(user_id, public_key)
);

ALTER TABLE user_api_keys ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own API keys
CREATE POLICY "Users can view own api keys"
  ON user_api_keys
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own API keys
CREATE POLICY "Users can insert own api keys"
  ON user_api_keys
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own API keys
CREATE POLICY "Users can update own api keys"
  ON user_api_keys
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own API keys
CREATE POLICY "Users can delete own api keys"
  ON user_api_keys
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);