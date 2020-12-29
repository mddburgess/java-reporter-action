import Github from "./index";
import { CheckRequest } from "./types";
import CheckResult from "../check/result";
import { chunk } from "../common/utils";

export default class CheckRun {
  private readonly github: Github;
  private readonly name: string;
  private checkRunId?: number;

  constructor(name: string) {
    this.github = new Github();
    this.name = name;
  }

  async queue() {
    await this.saveCheck({ status: "queued" });
  }

  async complete(result: CheckResult) {
    const chunks = chunk(result.annotations, 50);
    for (const annotations of chunks) {
      await this.saveCheck({
        status: "completed",
        conclusion: result.conclusion,
        output: {
          title: result.title,
          summary: result.summary,
          text: result.text,
          annotations: annotations,
        },
      });
    }
  }

  async saveCheck(request: CheckRequest) {
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
