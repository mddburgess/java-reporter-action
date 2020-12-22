interface CheckRequest {
  status?: CheckStatus;
  started_at?: string;
  conclusion?: CheckConclusion;
  completed_at?: string;
  output?: CheckOutput;
}

type CreateCheckRequest = CheckRequest & { name: string };

type UpdateCheckRequest = CheckRequest & { check_run_id: number };

type CheckStatus = "queued" | "in_progress" | "completed";

type CheckConclusion =
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

interface CheckAnnotation {
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

type AnnotationLevel = "notice" | "warning" | "failure";

export {
  CheckRequest,
  CheckConclusion,
  CheckAnnotation,
  CreateCheckRequest,
  UpdateCheckRequest,
};
