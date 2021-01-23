export type CreateCheckRequest = CheckRequest & { name: string };

export type UpdateCheckRequest = CheckRequest & { check_run_id: number };

export interface CheckRequest {
  status?: CheckStatus;
  started_at?: string;
  conclusion?: CheckConclusion;
  completed_at?: string;
  output?: CheckOutput;
}

type CheckStatus = "queued" | "in_progress" | "completed";

export type CheckConclusion =
  | "success"
  | "failure"
  | "neutral"
  | "cancelled"
  | "skipped"
  | "timed_out"
  | "action_required";

interface CheckOutput {
  title: string;
  summary: string;
  text?: string;
  annotations?: CheckAnnotation[];
}

export interface CheckAnnotation {
  path: string;
  start_line: number;
  end_line: number;
  start_column?: number;
  end_column?: number;
  annotation_level: AnnotationLevel;
  message: string;
  title?: string;
  raw_details?: string;
}

export type AnnotationLevel = "notice" | "warning" | "failure";
