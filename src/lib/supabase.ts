import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://mock.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "mock-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveMessage(sessionId: string, role: string, message: string, userId?: string | null) {
  const { data, error } = await supabase.from('chat_history').insert([
    { session_id: sessionId, role, message, user_id: userId || null }
  ]);
  if (error) console.error("Error saving message", error);
  return data;
}

export async function getSessionMessages(sessionId: string) {
  const { data, error } = await supabase
    .from('chat_history')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });
  if (error) console.error("Error fetching messages", error);
  return data || [];
}

export async function saveQuizAttempt(userId: string, topic: string, score: number, total: number, timeTaken: number) {
  const percentage = (score / total) * 100;
  const { data, error } = await supabase.from('quiz_attempts').insert([
    { user_id: userId, quiz_topic: topic, score, total_questions: total, percentage, time_taken_seconds: timeTaken }
  ]);
  if (error) console.error("Error saving quiz attempt", error);
  return data;
}

export async function getUserStats(userId: string) {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('score, percentage')
    .eq('user_id', userId);
  
  if (error) {
    console.error("Error fetching stats", error);
    return { count: 0, avg: 0, best: 0 };
  }
  
  if (!data || data.length === 0) return { count: 0, avg: 0, best: 0 };
  
  const count = data.length;
  const avg = data.reduce((acc, curr) => acc + curr.percentage, 0) / count;
  const best = Math.max(...data.map(d => d.percentage));
  
  return { count, avg, best };
}

export async function saveMyFeedback(userId: string | null, mythId: string, wasHelpful: boolean) {
  const { data, error } = await supabase.from('myth_feedback').insert([
    { user_id: userId || null, myth_id: mythId, was_helpful: wasHelpful }
  ]);
  if (error) console.error("Error saving myth feedback", error);
  return data;
}

export async function getLeaderboard() {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('percentage, score, users_profile(full_name)')
    .order('percentage', { ascending: false })
    .limit(5);
  if (error) console.error("Error fetching leaderboard", error);
  return data || [];
}

export async function getQuizHistory(userId: string) {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });
    if (error) console.error("Error fetching quiz history", error);
    return data || [];
}

export async function updateRegistrationStatus(userId: string, status: string) {
  const { data, error } = await supabase.from('users_profile').update({ registration_status: status }).eq('id', userId);
  if (error) console.error("Error updating registration status", error);
  return data;
}

export async function updateVotingStatus(userId: string, hasVoted: boolean) {
  const { data, error } = await supabase.from('users_profile').update({ has_voted: hasVoted }).eq('id', userId);
  if (error) console.error("Error updating voting status", error);
  return data;
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase.from('users_profile').select('*').eq('id', userId).single();
  if (error) console.error("Error fetching user profile", error);
  return data;
}