import Github from "./index";
import { CheckAnnotation, CheckConclusion, CheckRequest } from "./types";

class CheckRun<T> {
  private readonly github: Github;
  private readonly name: string;

  private conclusion: (report: T) => CheckConclusion;
  private title: (report: T) => string;
  private summary: (report: T) => string;
  private text: (report: T) => string | undefined;

  private checkRunId?: number;

  constructor(name: string, resolvers?: CheckResolvers<T>) {
    this.github = new Github();
    this.name = name;
    this.conclusion = () => "neutral";
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
      conclusion: this.conclusion(report),
      output: {
        title: this.title(report),
        summary: this.summary(report),
        text: this.text(report)
      },
    });
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
  title: (report: T) => string;
  summary: (report: T) => string;
  text?: (report: T) => string;
}

export default CheckRun;
