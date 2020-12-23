import { countBy } from "lodash";
import Github from "./index";
import { CheckAnnotation, CheckConclusion, CheckRequest } from "./types";

class CheckRun<T> {
  private readonly github: Github;
  private readonly name: string;
  private readonly annotationSummary: AnnotationSummary = {
    failures: 0,
    warnings: 0,
    notices: 0
  }

  private conclusion: (report: AnnotationSummary) => CheckConclusion;
  private title: (report: T) => string;
  private summary: (report: T) => string;
  private text: (report: T) => string | undefined;

  private checkRunId?: number;

  constructor(name: string, resolvers?: CheckResolvers<T>) {
    this.github = new Github();
    this.name = name;
    this.conclusion = resolvers?.conclusion ?? (() => "neutral");
    this.title = resolvers?.title ?? (() => this.name);
    this.summary = resolvers?.summary ?? ((report) => this.title(report));
    this.text = resolvers?.text ?? (() => undefined);
  }

  async queue() {
    await this.saveCheck({ status: "queued" });
  }

  async begin() {
    await this.saveCheck({ status: "in_progress" });
  }

  async annotate(report: T, annotations: CheckAnnotation[]) {
    this.summarize(annotations);
    for (let i = 0; i < annotations.length; i += 50) {
      await this.saveCheck({
        output: {
          title: this.title(report),
          summary: this.summary(report),
          text: this.text(report),
          annotations: annotations.slice(i, i + 50)
        }
      });
    }
  }

  async conclude(report: T) {
    await this.saveCheck({
      status: "completed",
      conclusion: this.conclusion(this.annotationSummary),
      output: {
        title: this.title(report),
        summary: this.summary(report),
        text: this.text(report)
      },
    });
  }

  private summarize(annotations: CheckAnnotation[]) {
    const counts = countBy(annotations, "annotation_level");
    this.annotationSummary.failures = counts.failure ?? 0;
    this.annotationSummary.warnings = counts.warning ?? 0;
    this.annotationSummary.notices = counts.notice ?? 0;
  }

  private async saveCheck(request: CheckRequest) {
    if (this.checkRunId === undefined) {
      this.checkRunId = await this.github.createCheck({
        name: this.name,
        ...request,
      });
    } else {
      await this.github.updateCheck({
        check_run_id: this.checkRunId,
        ...request,
      });
    }
  }
}

interface CheckResolvers<T> {
  conclusion: (annotations: AnnotationSummary) => CheckConclusion;
  title: (report: T) => string;
  summary: (report: T) => string;
  text?: (report: T) => string;
}

interface AnnotationSummary {
  failures: number;
  warnings: number;
  notices: number;
}

export {AnnotationSummary};
export default CheckRun;
