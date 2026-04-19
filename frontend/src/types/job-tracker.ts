export const APPLICATION_STATUSES = [
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];
export type ApplicationView = "table" | "kanban";

export interface ReminderInfo {
  needs_follow_up: boolean;
  follow_up_date: string;
  needs_interview_reminder: boolean;
}

export interface Application {
  id: string;
  user_id: string;
  company_name: string;
  role: string;
  job_link: string | null;
  job_description: string | null;
  resume_text: string | null;
  applied_date: string;
  interview_date: string | null;
  status: ApplicationStatus;
  match_score: number | null;
  created_at: string;
  reminders: ReminderInfo;
}

export interface ApplicationPayload {
  company_name: string;
  role: string;
  job_link?: string | null;
  job_description?: string | null;
  resume_text?: string | null;
  applied_date: string;
  interview_date?: string | null;
  status: ApplicationStatus;
  match_score?: number | null;
}

export interface InsightItem {
  title: string;
  severity: "info" | "medium" | "high";
  message: string;
}

export interface TrendPoint {
  week_start: string;
  count: number;
}

export interface Analytics {
  total_applications: number;
  interview_rate: number;
  offer_rate: number;
  rejection_rate: number;
  average_match_score: number;
  weekly_trend: TrendPoint[];
  insights: InsightItem[];
}

export interface MatchAnalysis {
  match_score: number;
  matched_keywords: string[];
  missing_keywords: string[];
  improvement_suggestions: string[];
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}
