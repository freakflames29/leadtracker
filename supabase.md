-- profiles table
CREATE TABLE profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile."
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- leads table
CREATE TYPE lead_status AS ENUM ('active', 'dropped');
CREATE TYPE lead_type AS ENUM ('hot', 'warm', 'cold', 'other');

CREATE TABLE leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  name text NOT NULL,
  phone text NOT NULL,
  type lead_type DEFAULT 'other' NOT NULL,
  category text,
  status lead_status DEFAULT 'active' NOT NULL,
  follow_up_date date NOT NULL,
  
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own leads."
  ON leads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own leads."
  ON leads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own leads."
  ON leads FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own leads."
  ON leads FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_leads_user_id ON leads(user_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_follow_up ON leads(follow_up_date);

-- lead_followups table
CREATE TABLE lead_followups (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
  
  note text NOT NULL,
  
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE lead_followups ENABLE ROW LEVEL SECURITY;

-- Note: RLS on lead_followups assumes that if the user has access to the lead, they have access to the follow-ups.
CREATE POLICY "Users can view followups for their leads."
  ON lead_followups FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM leads 
      WHERE leads.id = lead_followups.lead_id 
      AND leads.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert followups for their leads."
  ON lead_followups FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads 
      WHERE leads.id = lead_id 
      AND leads.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update followups for their leads."
  ON lead_followups FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM leads 
      WHERE leads.id = lead_followups.lead_id 
      AND leads.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete followups for their leads."
  ON lead_followups FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM leads 
      WHERE leads.id = lead_followups.lead_id 
      AND leads.user_id = auth.uid()
    )
  );

CREATE INDEX idx_lead_followups_lead_id ON lead_followups(lead_id);
CREATE INDEX idx_lead_followups_created_at ON lead_followups(created_at);
