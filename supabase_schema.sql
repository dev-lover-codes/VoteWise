-- Create the following tables in Supabase using SQL migrations:

-- Table 1: users_profile
CREATE TABLE users_profile (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name TEXT,
    email TEXT,
    avatar_url TEXT,
    state TEXT,
    age INTEGER,
    is_first_time_voter BOOLEAN DEFAULT FALSE,
    registration_status TEXT DEFAULT 'Pending',
    has_voted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table 2: quiz_attempts
CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users_profile(id),
    quiz_topic TEXT,
    score INTEGER,
    total_questions INTEGER,
    percentage NUMERIC(5,2),
    time_taken_seconds INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table 3: chat_history
CREATE TABLE chat_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users_profile(id), -- nullable
    session_id TEXT,
    role TEXT,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table 4: myth_feedback
CREATE TABLE myth_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- nullable
    myth_id TEXT,
    was_helpful BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE myth_feedback ENABLE ROW LEVEL SECURITY;

-- Policies for users_profile
CREATE POLICY "Users can read own profile" ON users_profile FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users_profile FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users_profile FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies for quiz_attempts
CREATE POLICY "Users can read own quiz attempts" ON quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quiz attempts" ON quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anyone can read leaderboard" ON quiz_attempts FOR SELECT USING (true);

-- Policies for chat_history
CREATE POLICY "Users can read own chat history" ON chat_history FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can insert own chat history" ON chat_history FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Policies for myth_feedback
CREATE POLICY "Anyone can insert myth feedback" ON myth_feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can read own myth feedback" ON myth_feedback FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);